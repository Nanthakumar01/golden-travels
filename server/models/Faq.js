import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'

const Faq = sequelize.define('Faq', {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	question: {
		type: DataTypes.STRING(255),
		allowNull: false
	},
	answer: {
		type: DataTypes.TEXT,
		allowNull: false
	},
	order: {
		type: DataTypes.INTEGER,
		defaultValue: 0
	},
	isActive: {
		type: DataTypes.BOOLEAN,
		defaultValue: true
	}
}, {
	tableName: 'faqs',
	timestamps: true
})

export default Faq
