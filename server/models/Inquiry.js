import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'

const Inquiry = sequelize.define('Inquiry', {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	name: {
		type: DataTypes.STRING(120),
		allowNull: false
	},
	phone: {
		type: DataTypes.STRING(30),
		allowNull: false
	},
	email: {
		type: DataTypes.STRING(120),
		allowNull: true
	},
	destination: {
		type: DataTypes.STRING(150),
		allowNull: true
	},
	packageName: {
		type: DataTypes.STRING(200),
		allowNull: true
	},
	duration: {
		type: DataTypes.STRING(80),
		allowNull: true
	},
	travelDate: {
		type: DataTypes.STRING(60),
		allowNull: true
	},
	travelers: {
		type: DataTypes.STRING(20),
		defaultValue: '2'
	},
	month: {
		type: DataTypes.STRING(60),
		allowNull: true
	},
	message: {
		type: DataTypes.TEXT,
		allowNull: true
	},
	notes: {
		type: DataTypes.TEXT,
		allowNull: true
	},
	status: {
		type: DataTypes.ENUM('new', 'contacted', 'in-progress', 'converted', 'closed'),
		defaultValue: 'new'
	},
	source: {
		type: DataTypes.STRING(50),
		defaultValue: 'website'
	}
}, {
	tableName: 'inquiries',
	timestamps: true
})

export default Inquiry
