import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'

const Destination = sequelize.define('Destination', {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	type: {
		type: DataTypes.ENUM('DOMESTIC', 'INTERNATIONAL'),
		defaultValue: 'INTERNATIONAL'
	},
	category: {
		type: DataTypes.INTEGER,
		allowNull: false,
		defaultValue: 1 // 1: Popular Worldwide, 2: Asia & Exotic, 3: Scenic Peaks, 4: Historic & Cultural
	},
	categoryName: {
		type: DataTypes.STRING(100),
		defaultValue: 'Popular Worldwide'
	},
	name: {
		type: DataTypes.STRING(150),
		allowNull: false
	},
	places: {
		type: DataTypes.STRING(255),
		allowNull: true
	},
	img: {
		type: DataTypes.STRING(255),
		allowNull: false
	},
	packageSlug: {
		type: DataTypes.STRING(150),
		allowNull: true
	},
	link: {
		type: DataTypes.STRING(255),
		defaultValue: '/tour'
	},
	tours: {
		type: DataTypes.STRING(100),
		defaultValue: 'Curated Package'
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
	tableName: 'destinations',
	timestamps: true
})

export default Destination
