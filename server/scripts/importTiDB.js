import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import mysql from 'mysql2/promise'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function importToTiDB() {
  try {
    console.log('Connecting to TiDB Cloud golden_travels database...')
    const conn = await mysql.createConnection({
      host: 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
      port: 4000,
      user: '4JHtFCk5GDJZZ1d.root',
      password: 'Dmsx3mD0xmHwlu71',
      database: 'golden_travels',
      multipleStatements: true,
      ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true
      }
    })
    console.log('Connected to TiDB golden_travels successfully!')

    const dumpPath = path.join(__dirname, '..', 'export', 'golden_travels_dump.sql')
    const sqlContent = fs.readFileSync(dumpPath, 'utf8')

    console.log('Executing SQL dump into TiDB Cloud (16 tables, 96 records)...')
    await conn.query(sqlContent)
    console.log('SQL dump executed successfully!')

    const [tables] = await conn.query('SHOW TABLES')
    console.log(`Verified ${tables.length} tables in TiDB golden_travels:`)
    for (const t of tables) {
      const name = Object.values(t)[0]
      const [[{ count }]] = await conn.query(`SELECT COUNT(*) as count FROM \`${name}\``)
      console.log(`  - ${name}: ${count} rows`)
    }

    await conn.end()
    console.log('\nAll client data imported into TiDB Cloud successfully!')
  } catch (err) {
    console.error('Import Error:', err)
  }
}

importToTiDB()
