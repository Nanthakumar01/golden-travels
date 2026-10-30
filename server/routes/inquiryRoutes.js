import express from 'express'
import {
	createInquiry,
	getInquiries,
	updateInquiry,
	deleteInquiry
} from '../controllers/inquiryController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/', createInquiry)
router.get('/', protect, getInquiries)
router.put('/:id', protect, updateInquiry)
router.delete('/:id', protect, deleteInquiry)

export default router
