import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'

const TrustStat = sequelize.define('TrustStat', {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	icon: {
		type: DataTypes.STRING(255),
		defaultValue: 'trophy'
	},
	number: {
		type: DataTypes.STRING(100),
		allowNull: false
	},
	label: {
		type: DataTypes.STRING(150),
		allowNull: false
	},
	desc: {
		type: DataTypes.STRING(255),
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
	tableName: 'trust_stats',
	timestamps: true
})

export default TrustStat
