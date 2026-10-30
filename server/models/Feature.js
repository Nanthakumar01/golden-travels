import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'

const Feature = sequelize.define('Feature', {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	icon: {
		type: DataTypes.STRING(255),
		defaultValue: 'target'
	},
	title: {
		type: DataTypes.STRING(150),
		allowNull: false
	},
	description: {
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
	tableName: 'features',
	timestamps: true
})

export default Feature
