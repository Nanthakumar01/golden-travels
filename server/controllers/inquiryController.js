import { Inquiry } from '../models/index.js'
import { sendInquiryNotification } from '../services/emailService.js'

export const createInquiry = async (req, res) => {
	try {
		const { name, phone, email, destination, packageName, duration, travelDate, travelers, month, message, source = 'website' } = req.body

		if (!name || !name.trim() || !phone || !phone.trim()) {
			return res.status(400).json({ success: false, message: 'Name and WhatsApp/phone number are required' })
		}

		const digitsOnly = String(phone).replace(/\D/g, '')
		if (digitsOnly.length < 10 || digitsOnly.length > 15 || /[a-zA-Z]/.test(String(phone))) {
			return res.status(400).json({ success: false, message: 'Please enter a valid 10-digit WhatsApp / mobile number' })
		}

		if (email && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(String(email).trim())) {
			return res.status(400).json({ success: false, message: 'Please enter a valid email address' })
		}

		const inquiry = await Inquiry.create({
			name: name.trim(),
			phone: phone.trim(),
			email: email ? email.trim() : '',
			destination: destination ? destination.trim() : '',
			packageName: packageName ? packageName.trim() : '',
			duration: duration ? duration.trim() : (travelDate || ''),
			travelDate: travelDate || duration || '',
			travelers: String(travelers || '2'),
			month,
			message: message ? message.trim() : '',
			source,
			status: 'new'
		})

		// Send email notification to admin via SMTP asynchronously
		sendInquiryNotification(inquiry).catch(err => {
			console.error('Email dispatch error:', err.message)
		})

		res.status(201).json({
			success: true,
			message: 'Thank you! Your inquiry has been submitted successfully. Our team will contact you shortly.',
			data: inquiry
		})
	} catch (error) {
		console.error('Error creating inquiry:', error)
		res.status(500).json({ success: false, message: 'Server error creating inquiry', error: error.message })
	}
}

export const getInquiries = async (req, res) => {
	try {
		const { status } = req.query
		const where = {}

		if (status && status !== 'all') {
			where.status = status
		}

		const inquiries = await Inquiry.findAll({
			where,
			order: [['createdAt', 'DESC']]
		})

		res.json({
			success: true,
			count: inquiries.length,
			data: inquiries
		})
	} catch (error) {
		console.error('Error fetching inquiries:', error)
		res.status(500).json({ success: false, message: 'Server error fetching inquiries', error: error.message })
	}
}

export const updateInquiry = async (req, res) => {
	try {
		const { id } = req.params
		const { status, notes } = req.body

		const inquiry = await Inquiry.findByPk(id)
		if (!inquiry) {
			return res.status(404).json({ success: false, message: 'Inquiry not found' })
		}

		if (status) inquiry.status = status
		if (notes !== undefined) inquiry.notes = notes

		await inquiry.save()

		res.json({
			success: true,
			message: 'Inquiry updated successfully',
			data: inquiry
		})
	} catch (error) {
		console.error('Error updating inquiry:', error)
		res.status(500).json({ success: false, message: 'Server error updating inquiry', error: error.message })
	}
}

export const deleteInquiry = async (req, res) => {
	try {
		const { id } = req.params
		const inquiry = await Inquiry.findByPk(id)

		if (!inquiry) {
			return res.status(404).json({ success: false, message: 'Inquiry not found' })
		}

		await inquiry.destroy()

		res.json({
			success: true,
			message: 'Inquiry deleted successfully'
		})
	} catch (error) {
		console.error('Error deleting inquiry:', error)
		res.status(500).json({ success: false, message: 'Server error deleting inquiry', error: error.message })
	}
}
