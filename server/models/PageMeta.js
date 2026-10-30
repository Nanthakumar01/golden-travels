import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'

const PageMeta = sequelize.define('PageMeta', {
	pageKey: {
		type: DataTypes.STRING(60),
		primaryKey: true,
		allowNull: false
	},
	pageName: {
		type: DataTypes.STRING(100),
		allowNull: false
	},
	route: {
		type: DataTypes.STRING(100),
		allowNull: false
	},
	metaTitle: {
		type: DataTypes.STRING(255),
		allowNull: true
	},
	metaDescription: {
		type: DataTypes.TEXT,
		allowNull: true
	},
	metaKeywords: {
		type: DataTypes.TEXT,
		allowNull: true
	},
	ogImage: {
		type: DataTypes.STRING(255),
		allowNull: true
	},
	canonicalUrl: {
		type: DataTypes.STRING(255),
		allowNull: true
	}
}, {
	tableName: 'page_meta',
	timestamps: true
})

export default PageMeta
