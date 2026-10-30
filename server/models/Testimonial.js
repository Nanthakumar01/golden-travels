import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'

const Testimonial = sequelize.define('Testimonial', {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	name: {
		type: DataTypes.STRING(150),
		allowNull: false
	},
	role: {
		type: DataTypes.STRING(150),
		allowNull: true
	},
	text: {
		type: DataTypes.TEXT,
		allowNull: false
	},
	rating: {
		type: DataTypes.INTEGER,
		defaultValue: 5
	},
	avatar: {
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
	tableName: 'testimonials',
	timestamps: true
})

export default Testimonial
