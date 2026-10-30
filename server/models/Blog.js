import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'

const Blog = sequelize.define('Blog', {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	slug: {
		type: DataTypes.STRING(255),
		allowNull: false
	},
	title: {
		type: DataTypes.STRING(255),
		allowNull: false
	},
	category: {
		type: DataTypes.STRING(100),
		defaultValue: 'Travel Guide'
	},
	date: {
		type: DataTypes.STRING(100),
		defaultValue: 'Oct 2026'
	},
	readTime: {
		type: DataTypes.STRING(50),
		defaultValue: '5 min read'
	},
	author: {
		type: DataTypes.STRING(100),
		defaultValue: 'Golden Travels Specialist'
	},
	image: {
		type: DataTypes.STRING(255),
		allowNull: false
	},
	excerpt: {
		type: DataTypes.TEXT,
		allowNull: false
	},
	heading: {
		type: DataTypes.STRING(255),
		allowNull: true
	},
	content: {
		type: DataTypes.TEXT('long'),
		allowNull: true
	},
	sections: {
		type: DataTypes.JSON,
		allowNull: true,
		defaultValue: [],
		get() {
			const val = this.getDataValue('sections')
			if (!val) return []
			if (typeof val === 'string') {
				try { return JSON.parse(val) } catch { return [] }
			}
			return val
		}
	},
	order: {
		type: DataTypes.INTEGER,
		defaultValue: 0
	},
	isActive: {
		type: DataTypes.BOOLEAN,
		defaultValue: true
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
	canonicalUrl: {
		type: DataTypes.STRING(255),
		allowNull: true
	}
}, {
	tableName: 'blogs',
	timestamps: true
})

export default Blog
