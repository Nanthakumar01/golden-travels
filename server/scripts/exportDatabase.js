import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import sequelize from '../config/db.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const escapeSqlValue = (val) => {
	if (val === null || val === undefined) return 'NULL'
	if (typeof val === 'boolean') return val ? '1' : '0'
	if (typeof val === 'number') return String(val)
	if (val instanceof Date) {
		return `'${val.toISOString().slice(0, 19).replace('T', ' ')}'`
	}
	if (typeof val === 'object') {
		const str = JSON.stringify(val)
		return `'${str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n').replace(/\r/g, '\\r')}'`
	}
	const str = String(val)
	return `'${str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n').replace(/\r/g, '\\r')}'`
}

async function exportDatabase() {
	try {
		console.log('Connecting to MySQL...')
		await sequelize.authenticate()
		console.log('Connected.')

		const [tables] = await sequelize.query('SHOW TABLES')
		const dbName = sequelize.config.database
		const tableKey = Object.keys(tables[0])[0]

		const outDir = path.join(__dirname, '..', 'export')
		if (!fs.existsSync(outDir)) {
			fs.mkdirSync(outDir, { recursive: true })
		}

		const sqlFilePath = path.join(outDir, 'golden_travels_dump.sql')
		const jsonFilePath = path.join(outDir, 'golden_travels_data.json')

		let sql = '-- ========================================================\n'
		sql += '-- Golden Travels Database Dump\n'
		sql += `-- Export Date: ${new Date().toISOString()}\n`
		sql += `-- Source Database: ${dbName}\n`
		sql += '-- ========================================================\n\n'
		sql += 'SET FOREIGN_KEY_CHECKS = 0;\n\n'

		const fullJson = {}
		let totalRows = 0

		for (const row of tables) {
			const tableName = row[tableKey]
			console.log(`Exporting table: ${tableName}...`)

			const [[createResult]] = await sequelize.query(`SHOW CREATE TABLE \`${tableName}\``)
			const createTableSql = createResult['Create Table']

			sql += `-- Table structure for table \`${tableName}\`\n`
			sql += `DROP TABLE IF EXISTS \`${tableName}\`;\n`
			sql += `${createTableSql};\n\n`

			const [rows] = await sequelize.query(`SELECT * FROM \`${tableName}\``)
			fullJson[tableName] = rows
			totalRows += rows.length

			if (rows.length > 0) {
				const columns = Object.keys(rows[0]).map(c => `\`${c}\``).join(', ')
				sql += `-- Dumping data for table \`${tableName}\` (${rows.length} rows)\n`

				for (const r of rows) {
					const values = Object.values(r).map(escapeSqlValue).join(', ')
					sql += `INSERT INTO \`${tableName}\` (${columns}) VALUES (${values});\n`
				}
				sql += '\n'
			}
		}

		sql += 'SET FOREIGN_KEY_CHECKS = 1;\n'
		sql += `-- Dump completed on ${new Date().toISOString()}\n`

		fs.writeFileSync(sqlFilePath, sql, 'utf8')
		fs.writeFileSync(jsonFilePath, JSON.stringify(fullJson, null, 2), 'utf8')

		console.log('\nDatabase Export Succeeded!')
		console.log(`Exported ${tables.length} tables and ${totalRows} total records.`)
		console.log(`SQL Dump: ${sqlFilePath}`)
		console.log(`JSON Backup: ${jsonFilePath}\n`)
		process.exit(0)
	} catch (error) {
		console.error('Export failed:', error)
		process.exit(1)
	}
}

exportDatabase()
