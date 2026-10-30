import jwt from 'jsonwebtoken'
import { Admin } from '../models/index.js'

export const protect = async (req, res, next) => {
	let token

	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		try {
			token = req.headers.authorization.split(' ')[1]
			const decoded = jwt.verify(
				token,
				process.env.JWT_SECRET || 'golden_travels_super_secure_jwt_secret_key_2026'
			)

			const admin = await Admin.findByPk(decoded.id, {
				attributes: { exclude: ['password'] }
			})

			if (!admin) {
				return res.status(401).json({ success: false, message: 'Not authorized, admin not found' })
			}

			req.admin = admin
			next()
		} catch (error) {
			console.error('Auth token verification error:', error.message)
			return res.status(401).json({ success: false, message: 'Not authorized, token failed' })
		}
	}

	if (!token) {
		return res.status(401).json({ success: false, message: 'Not authorized, no token provided' })
	}
}
