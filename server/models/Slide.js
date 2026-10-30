import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'

const Slide = sequelize.define('Slide', {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	slideKey: {
		type: DataTypes.STRING(50),
		allowNull: false
	},
	tab: {
		type: DataTypes.STRING(50),
		allowNull: false
	},
	eyebrowBadge: {
		type: DataTypes.STRING(120),
		defaultValue: 'Bespoke Luxury Holidays'
	},
	featuredLabel: {
		type: DataTypes.STRING(120),
		defaultValue: 'Featured destination'
	},
	titleLine1: {
		type: DataTypes.STRING(150),
		defaultValue: 'Your next story'
	},
	titleHighlight: {
		type: DataTypes.STRING(100),
		defaultValue: 'Golden'
	},
	titleLine2: {
		type: DataTypes.STRING(150),
		defaultValue: 'journey'
	},
	text: {
		type: DataTypes.TEXT,
		allowNull: true
	},
	arches: {
		type: DataTypes.JSON,
		allowNull: true,
		defaultValue: [],
		get() {
			const val = this.getDataValue('arches')
			if (!val) return []
			if (typeof val === 'string') {
				try { return JSON.parse(val) } catch { return [] }
			}
			return val
		}
	},
	passTag: {
		type: DataTypes.STRING(100),
		defaultValue: 'Bestseller · Boarding Pass'
	},
	passTitle: {
		type: DataTypes.STRING(150),
		defaultValue: 'Alpine & European Grandeur'
	},
	inquiry: {
		type: DataTypes.STRING(100),
		defaultValue: 'Europe Holiday'
	},
	order: {
		type: DataTypes.INTEGER,
		defaultValue: 0
	},
	isActive: {
		type: DataTypes.BOOLEAN,
		defaultValue: true
	},
	showInCtaBanner: {
		type: DataTypes.BOOLEAN,
		defaultValue: false
	}
}, {
	tableName: 'slides',
	timestamps: true
})

export default Slide
