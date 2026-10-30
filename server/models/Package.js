import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'

const Package = sequelize.define('Package', {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	slug: {
		type: DataTypes.STRING(150),
		allowNull: false,
		unique: true
	},
	title: {
		type: DataTypes.STRING(255),
		allowNull: false
	},
	shortTitle: {
		type: DataTypes.STRING(100),
		allowNull: true
	},
	type: {
		type: DataTypes.ENUM('DOMESTIC', 'INTERNATIONAL'),
		defaultValue: 'INTERNATIONAL'
	},
	category: {
		type: DataTypes.STRING(50),
		defaultValue: 'international'
	},
	region: {
		type: DataTypes.STRING(100),
		allowNull: true
	},
	destination: {
		type: DataTypes.STRING(255),
		allowNull: true
	},
	cities: {
		type: DataTypes.STRING(255),
		allowNull: true
	},
	duration: {
		type: DataTypes.STRING(50),
		allowNull: true
	},
	nights: {
		type: DataTypes.INTEGER,
		defaultValue: 1
	},
	days: {
		type: DataTypes.INTEGER,
		defaultValue: 1
	},
	badge: {
		type: DataTypes.STRING(100),
		allowNull: true
	},
	image: {
		type: DataTypes.STRING(255),
		allowNull: true
	},
	gallery: {
		type: DataTypes.JSON,
		allowNull: true,
		defaultValue: [],
		get() {
			const val = this.getDataValue('gallery')
			if (!val) return []
			if (typeof val === 'string') {
				try { return JSON.parse(val) } catch { return [] }
			}
			return val
		}
	},
	personas: {
		type: DataTypes.JSON,
		allowNull: true,
		defaultValue: ['couple', 'family'],
		get() {
			const val = this.getDataValue('personas')
			if (!val) return ['couple', 'family']
			if (typeof val === 'string') {
				try { return JSON.parse(val) } catch { return ['couple', 'family'] }
			}
			return val
		}
	},
	keyInclusions: {
		type: DataTypes.JSON,
		allowNull: true,
		defaultValue: [],
		get() {
			const val = this.getDataValue('keyInclusions')
			if (!val) return []
			if (typeof val === 'string') {
				try { return JSON.parse(val) } catch { return [] }
			}
			return val
		}
	},
	tags: {
		type: DataTypes.JSON,
		allowNull: true,
		defaultValue: [],
		get() {
			const val = this.getDataValue('tags')
			if (!val) return []
			if (typeof val === 'string') {
				try { return JSON.parse(val) } catch { return [] }
			}
			return val
		}
	},
	about: {
		type: DataTypes.TEXT,
		allowNull: true
	},
	itinerary: {
		type: DataTypes.JSON,
		allowNull: true,
		defaultValue: [],
		get() {
			const val = this.getDataValue('itinerary')
			if (!val) return []
			if (typeof val === 'string') {
				try { return JSON.parse(val) } catch { return [] }
			}
			return val
		}
	},
	inclusions: {
		type: DataTypes.JSON,
		allowNull: true,
		defaultValue: [],
		get() {
			const val = this.getDataValue('inclusions')
			if (!val) return []
			if (typeof val === 'string') {
				try { return JSON.parse(val) } catch { return [] }
			}
			return val
		}
	},
	exclusions: {
		type: DataTypes.JSON,
		allowNull: true,
		defaultValue: [],
		get() {
			const val = this.getDataValue('exclusions')
			if (!val) return []
			if (typeof val === 'string') {
				try { return JSON.parse(val) } catch { return [] }
			}
			return val
		}
	},
	terms: {
		type: DataTypes.JSON,
		allowNull: true,
		defaultValue: [],
		get() {
			const val = this.getDataValue('terms')
			if (!val) return []
			if (typeof val === 'string') {
				try { return JSON.parse(val) } catch { return [] }
			}
			return val
		}
	},
	isActive: {
		type: DataTypes.BOOLEAN,
		defaultValue: true
	},
	featured: {
		type: DataTypes.BOOLEAN,
		defaultValue: false
	},
	showInExplore: {
		type: DataTypes.BOOLEAN,
		defaultValue: true
	},
	showInExclusive: {
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
	tableName: 'packages',
	timestamps: true
})

export default Package
