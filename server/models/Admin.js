import { DataTypes } from 'sequelize'
import bcrypt from 'bcryptjs'
import sequelize from '../config/db.js'

const Admin = sequelize.define('Admin', {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	username: {
		type: DataTypes.STRING(60),
		allowNull: false,
		unique: true
	},
	email: {
		type: DataTypes.STRING(120),
		allowNull: false,
		unique: true,
		validate: {
			isEmail: true
		}
	},
	password: {
		type: DataTypes.STRING(255),
		allowNull: false
	},
	role: {
		type: DataTypes.STRING(30),
		defaultValue: 'admin'
	},
	lastLogin: {
		type: DataTypes.DATE,
		allowNull: true
	}
}, {
	tableName: 'admins',
	timestamps: true,
	hooks: {
		beforeCreate: async (admin) => {
			if (admin.password) {
				const salt = await bcrypt.genSalt(10)
				admin.password = await bcrypt.hash(admin.password, salt)
			}
		},
		beforeUpdate: async (admin) => {
			if (admin.changed('password')) {
				const salt = await bcrypt.genSalt(10)
				admin.password = await bcrypt.hash(admin.password, salt)
			}
		}
	}
})

Admin.prototype.validPassword = async function (password) {
	return await bcrypt.compare(password, this.password)
}

export default Admin
