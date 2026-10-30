import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'

const Persona = sequelize.define('Persona', {
	id: {
		type: DataTypes.STRING(50),
		primaryKey: true
	},
	title: {
		type: DataTypes.STRING(100),
		allowNull: false
	},
	subtitle: {
		type: DataTypes.STRING(150),
		allowNull: true
	},
	image: {
		type: DataTypes.STRING(255),
		allowNull: false
	},
	link: {
		type: DataTypes.STRING(255),
		defaultValue: '/tour'
	},
	slug: {
		type: DataTypes.STRING(100),
		allowNull: true
	},
	isActive: {
		type: DataTypes.BOOLEAN,
		defaultValue: true
	}
}, {
	tableName: 'personas',
	timestamps: true
})

export default Persona
