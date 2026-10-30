import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'

const Banner = sequelize.define('Banner', {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	pageKey: {
		type: DataTypes.STRING(50),
		allowNull: false,
		unique: true
	},
	pageName: {
		type: DataTypes.STRING(100),
		allowNull: false
	},
	title: {
		type: DataTypes.STRING(150),
		allowNull: false
	},
	subtitle: {
		type: DataTypes.STRING(255),
		allowNull: true
	},
	bgImage: {
		type: DataTypes.STRING(255),
		defaultValue: '/assets/images/page/breakcrumb.jpg'
	},
	isActive: {
		type: DataTypes.BOOLEAN,
		defaultValue: true
	}
}, {
	tableName: 'banners',
	timestamps: true
})

export default Banner
