import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'

dotenv.config()

const isRemoteDb = process.env.DB_SSL === 'true' || (
	process.env.DB_HOST &&
	!process.env.DB_HOST.includes('localhost') &&
	!process.env.DB_HOST.includes('127.0.0.1')
)

const dialectOptions = isRemoteDb ? {
	ssl: {
		rejectUnauthorized: false
	}
} : {}

const sequelize = process.env.DATABASE_URL
	? new Sequelize(process.env.DATABASE_URL, {
		dialect: 'mysql',
		logging: false,
		dialectOptions,
		pool: { max: 10, min: 0, acquire: 30000, idle: 10000 }
	})
	: new Sequelize(
		process.env.DB_NAME || 'golden_travels',
		process.env.DB_USER || 'root',
		process.env.DB_PASS !== undefined ? process.env.DB_PASS : (process.env.DB_PASSWORD || ''),
		{
			host: process.env.DB_HOST || 'localhost',
			port: Number(process.env.DB_PORT) || 3306,
			dialect: 'mysql',
			logging: false,
			dialectOptions,
			pool: {
				max: 10,
				min: 0,
				acquire: 30000,
				idle: 10000
			}
		}
	)

export const testConnection = async () => {
	try {
		await sequelize.authenticate()
		console.log('✅ Connected successfully to MySQL database: ' + (process.env.DB_NAME || 'golden_travels'))
		return true
	} catch (error) {
		console.error('❌ Unable to connect to MySQL database:', error.message)
		return false
	}
}

export default sequelize
