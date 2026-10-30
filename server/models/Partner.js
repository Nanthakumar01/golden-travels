import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'

const Partner = sequelize.define('Partner', {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	name: {
		type: DataTypes.STRING(150),
		allowNull: false
	},
	tagline: {
		type: DataTypes.STRING(255),
		allowNull: false
	},
	iconType: {
		type: DataTypes.STRING(50),
		defaultValue: 'plane' // 'plane', 'hotel', 'train', 'globe', 'star', 'building'
	},
	imageUrl: {
		type: DataTypes.STRING(255),
		allowNull: true
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
	tableName: 'partners',
	timestamps: true
})

export default Partner
