import jwt from 'jsonwebtoken'
import { Op } from 'sequelize'
import { Admin } from '../models/index.js'

const generateToken = (id) => {
	return jwt.sign(
		{ id },
		process.env.JWT_SECRET || 'golden_travels_super_secure_jwt_secret_key_2026',
		{ expiresIn: '30d' }
	)
}

export const login = async (req, res) => {
	try {
		const { username, password } = req.body

		if (!username || !password) {
			return res.status(400).json({ success: false, message: 'Please provide username and password' })
		}

		// Strictly reject leading or trailing spaces as invalid
		if (username !== username.trim() || password !== password.trim()) {
			return res.status(401).json({ success: false, message: 'Invalid credentials' })
		}

		// Find admin by exact username or email
		const admin = await Admin.findOne({
			where: {
				[Op.or]: [
					{ username },
					{ email: username }
				]
			}
		})

		if (!admin) {
			return res.status(401).json({ success: false, message: 'Invalid credentials' })
		}

		let isMatch = await admin.validPassword(password)

		// Also check against current environment variable ADMIN_PASSWORD
		const envPassword = process.env.ADMIN_PASSWORD || process.env.ADMIN_DEFAULT_PASS
		if (!isMatch && envPassword && password === envPassword) {
			isMatch = true
			admin.password = password
			await admin.save()
		}

		if (!isMatch) {
			return res.status(401).json({ success: false, message: 'Invalid credentials' })
		}

		// Update last login
		admin.lastLogin = new Date()
		await admin.save()

		res.json({
			success: true,
			data: {
				id: admin.id,
				username: admin.username,
				email: admin.email,
				role: admin.role,
				token: generateToken(admin.id)
			}
		})
	} catch (error) {
		console.error('Login error:', error)
		res.status(500).json({ success: false, message: 'Server error during login', error: error.message })
	}
}

export const getMe = async (req, res) => {
	try {
		res.json({
			success: true,
			data: req.admin
		})
	} catch (error) {
		res.status(500).json({ success: false, message: 'Server error', error: error.message })
	}
}
