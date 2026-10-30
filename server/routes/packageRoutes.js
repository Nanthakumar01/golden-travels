import express from 'express'
import {
	getPackages,
	getPackageBySlugOrId,
	createPackage,
	updatePackage,
	deletePackage
} from '../controllers/packageController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', getPackages)
router.get('/:idOrSlug', getPackageBySlugOrId)
router.post('/', protect, createPackage)
router.put('/:id', protect, updatePackage)
router.delete('/:id', protect, deletePackage)

export default router
