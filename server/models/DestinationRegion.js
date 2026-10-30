import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'

const DestinationRegion = sequelize.define('DestinationRegion', {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	group: {
		type: DataTypes.STRING(50), // 'International' or 'India'
		allowNull: false,
		defaultValue: 'International'
	},
	slug: {
		type: DataTypes.STRING(100),
		allowNull: false
	},
	name: {
		type: DataTypes.STRING(150),
		allowNull: false
	},
	countries: {
		type: DataTypes.JSON,
		allowNull: false,
		defaultValue: [],
		get() {
			const raw = this.getDataValue('countries')
			if (!raw) return []
			if (Array.isArray(raw)) return raw
			if (typeof raw === 'string') {
				try {
					const p = JSON.parse(raw)
					if (Array.isArray(p)) return p
				} catch (_) {
					return raw.split(',').map(s => s.trim()).filter(Boolean)
				}
			}
			return []
		},
		set(val) {
			if (Array.isArray(val)) {
				this.setDataValue('countries', val)
			} else if (typeof val === 'string') {
				try {
					const p = JSON.parse(val)
					if (Array.isArray(p)) this.setDataValue('countries', p)
					else this.setDataValue('countries', val.split(',').map(s => s.trim()).filter(Boolean))
				} catch (_) {
					this.setDataValue('countries', val.split(',').map(s => s.trim()).filter(Boolean))
				}
			} else {
				this.setDataValue('countries', [])
			}
		}
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
	tableName: 'destination_regions',
	timestamps: true
})

export default DestinationRegion
