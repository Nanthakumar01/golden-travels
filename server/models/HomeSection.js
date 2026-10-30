import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'

const HomeSection = sequelize.define('HomeSection', {
	sectionKey: {
		type: DataTypes.STRING(50),
		primaryKey: true
	},
	sectionName: {
		type: DataTypes.STRING(100),
		allowNull: false
	},
	badge: {
		type: DataTypes.STRING(100),
		allowNull: true
	},
	title: {
		type: DataTypes.STRING(255),
		allowNull: false
	},
	subtitle: {
		type: DataTypes.TEXT,
		allowNull: true
	},
	bgImage: {
		type: DataTypes.STRING(255),
		allowNull: true
	},
	extraData: {
		type: DataTypes.JSON,
		allowNull: true
	},
	isActive: {
		type: DataTypes.BOOLEAN,
		defaultValue: true
	}
}, {
	tableName: 'home_sections',
	timestamps: true
})

export default HomeSection
