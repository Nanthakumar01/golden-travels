import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import AdminLayout from './AdminLayout'
import { createPackage, updatePackage, fetchPackageByIdOrSlug, fetchPackages } from '@/services/api'
import { useToast } from '@/context/ToastContext'
import {
	IconSave,
	IconPlus,
	IconClose,
	IconTrash
} from '@/components/Icons'
import ImageUploader from '@/components/ImageUploader'
import { getSiteBaseUrl, buildCanonicalUrl, isStandardCanonicalUrl, resolveCanonicalUrl } from '@/utils/siteUrl'

export const slugifyText = (text) => {
	if (!text) return ''
	return text
		.toString()
		.toLowerCase()
		.trim()
		.replace(/&/g, '-and-')
		.replace(/[\s\W-]+/g, '-')
		.replace(/^-+|-+$/g, '')
}

export const computeUniqueSlug = (rawTitle, existingList = [], currentId = null) => {
	const base = slugifyText(rawTitle)
	if (!base) return ''

	const isTaken = (cand) => {
		return existingList.some(item => {
			if (currentId && String(item.id) === String(currentId)) return false
			return (item.slug || '').toLowerCase() === cand.toLowerCase()
		})
	}

	if (!isTaken(base)) {
		return base
	}

	// Base is already taken by another package: find next incremental number: base-2, base-3...
	const cleanBase = base.replace(/-\d+$/, '')
	let counter = 2
	while (isTaken(`${cleanBase}-${counter}`)) {
		counter++
	}
	return `${cleanBase}-${counter}`
}

export default function AdminPackageForm() {
	const { showToast } = useToast()
	const navigate = useNavigate()
	const { id } = useParams()
	const isEdit = Boolean(id)

	const [loading, setLoading] = useState(isEdit)
	const [saving, setSaving] = useState(false)
	const [activeTab, setActiveTab] = useState('basic')
	const [existingPackages, setExistingPackages] = useState([])
	const [isSlugCustomized, setIsSlugCustomized] = useState(false)

	// Form State (No pre-filled default text/images when adding a new package)
	const [form, setForm] = useState({
		title: '',
		shortTitle: '',
		slug: '',
		type: 'INTERNATIONAL',
		category: 'international',
		region: '',
		destination: '',
		cities: '',
		duration: '',
		days: '',
		nights: '',
		badge: '',
		image: '',
		gallery: [],
		about: '',
		keyInclusions: ['', '', ''],
		inclusions: [''],
		exclusions: [''],
		terms: [''],
		itinerary: [
			{
				day: 'Day 1',
				title: '',
				loc: '',
				meals: '',
				image: '',
				imageTitle: '',
				desc: '',
				schedule: []
			}
		],
		metaTitle: '',
		metaDescription: '',
		metaKeywords: '',
		canonicalUrl: '',
		showInExplore: true,
		showInExclusive: true
	})

	// Fetch all packages to check slug collisions and auto-increment ending numbers
	useEffect(() => {
		fetchPackages({ activeOnly: 'false' })
			.then(res => {
				if (res?.success && Array.isArray(res.data)) {
					setExistingPackages(res.data)
				}
			})
			.catch(() => {})
	}, [])

	useEffect(() => {
		if (isEdit) {
			const loadPackage = async () => {
				try {
					setLoading(true)
					const res = await fetchPackageByIdOrSlug(id)
					if (res.success && res.data) {
						const pkg = res.data
						if (pkg.slug) {
							setIsSlugCustomized(true)
						}
						setForm({
							...pkg,
							showInExplore: pkg.showInExplore !== undefined ? Boolean(pkg.showInExplore) : true,
							showInExclusive: pkg.showInExclusive !== undefined ? Boolean(pkg.showInExclusive) : true,
							gallery: Array.isArray(pkg.gallery) ? pkg.gallery : [],
							keyInclusions: Array.isArray(pkg.keyInclusions) && pkg.keyInclusions.length > 0
								? pkg.keyInclusions
								: (Array.isArray(pkg.inclusions) && pkg.inclusions.length > 0 ? pkg.inclusions.slice(0, 3) : ['', '', '']),
							inclusions: Array.isArray(pkg.inclusions) && pkg.inclusions.length > 0 ? pkg.inclusions : [''],
							exclusions: Array.isArray(pkg.exclusions) && pkg.exclusions.length > 0 ? pkg.exclusions : [''],
							terms: Array.isArray(pkg.terms) && pkg.terms.length > 0 ? pkg.terms : [''],
							itinerary: Array.isArray(pkg.itinerary) && pkg.itinerary.length > 0
								? pkg.itinerary.map(item => ({
									...item,
									image: item.image || '',
									imageTitle: item.imageTitle || item.photoTitle || '',
									schedule: Array.isArray(item.schedule) ? item.schedule : []
								}))
								: [{ day: 'Day 1', title: '', loc: '', meals: '', image: '', imageTitle: '', desc: '', schedule: [] }],
							metaTitle: pkg.metaTitle || '',
							metaDescription: pkg.metaDescription || '',
							metaKeywords: pkg.metaKeywords || '',
							canonicalUrl: resolveCanonicalUrl(pkg.canonicalUrl, 'tour', pkg.slug)
						})
					}
				} catch (err) {
					showToast('Failed to load package: ' + err.message, 'error')
				} finally {
					setLoading(false)
				}
			}
			loadPackage()
		}
	}, [id, isEdit])

	const handleChange = (e) => {
		const { name, value } = e.target
		setForm(prev => {
			const updated = {
				...prev,
				[name]: value
			}

			// When FULL TOUR TITLE changes: Auto-generate unique slug and canonical URL
			if (name === 'title') {
				if (!isSlugCustomized || !prev.slug) {
					const uniqueSlug = computeUniqueSlug(value, existingPackages, id)
					updated.slug = uniqueSlug
					if (!prev.canonicalUrl || isStandardCanonicalUrl(prev.canonicalUrl, 'tour')) {
						updated.canonicalUrl = uniqueSlug ? buildCanonicalUrl('tour', uniqueSlug) : ''
					}
				}
			}

			// If title is empty and shortTitle is entered, use shortTitle as fallback for slug
			if (name === 'shortTitle' && !prev.title && (!isSlugCustomized || !prev.slug)) {
				const uniqueSlug = computeUniqueSlug(value, existingPackages, id)
				updated.slug = uniqueSlug
				if (!prev.canonicalUrl || isStandardCanonicalUrl(prev.canonicalUrl, 'tour')) {
					updated.canonicalUrl = uniqueSlug ? buildCanonicalUrl('tour', uniqueSlug) : ''
				}
			}

			// When SLUG is manually edited by the user
			if (name === 'slug') {
				setIsSlugCustomized(true)
				const cleanSlug = value
					.toLowerCase()
					.replace(/&/g, '-and-')
					.replace(/[\s\W-]+/g, '-')
					.replace(/^-+/, '')
				updated.slug = cleanSlug
				if (!prev.canonicalUrl || isStandardCanonicalUrl(prev.canonicalUrl, 'tour')) {
					updated.canonicalUrl = cleanSlug ? buildCanonicalUrl('tour', cleanSlug.replace(/-+$/, '')) : ''
				}
			}

			// When Days or Nights change: Auto-update duration
			if (name === 'days' || name === 'nights') {
				const d = parseInt(name === 'days' ? value : prev.days) || 0
				const n = parseInt(name === 'nights' ? value : prev.nights) || 0
				if (d > 0) {
					updated.duration = `${d} Day${d > 1 ? 's' : ''}${n >= 0 ? ` | ${n} Night${n > 1 ? 's' : ''}` : ''}`
				}
			}

			return updated
		})
	}

	const handleSlugBlur = () => {
		if (form.slug) {
			const uniqueSlug = computeUniqueSlug(form.slug, existingPackages, id)
			setForm(prev => ({
				...prev,
				slug: uniqueSlug,
				canonicalUrl: (!prev.canonicalUrl || isStandardCanonicalUrl(prev.canonicalUrl, 'tour'))
					? (uniqueSlug ? buildCanonicalUrl('tour', uniqueSlug) : '')
					: prev.canonicalUrl
			}))
		}
	}

	const handleRegenerateSlug = () => {
		const source = form.title || form.shortTitle || ''
		if (!source.trim()) {
			showToast('Please enter a tour title first!', 'error')
			return
		}
		const uniqueSlug = computeUniqueSlug(source, existingPackages, id)
		setIsSlugCustomized(false)
		setForm(prev => ({
			...prev,
			slug: uniqueSlug,
			canonicalUrl: uniqueSlug ? buildCanonicalUrl('tour', uniqueSlug) : ''
		}))
		showToast(`Slug & Canonical URL auto-generated: ${uniqueSlug}`, 'success')
	}

	// Itinerary management (empty fields when adding a new day)
	const handleAddDay = () => {
		const newDayNum = (form.itinerary?.length || 0) + 1
		setForm(prev => ({
			...prev,
			itinerary: [
				...(prev.itinerary || []),
				{
					day: `Day ${newDayNum}`,
					title: '',
					loc: '',
					meals: '',
					image: '',
					imageTitle: '',
					desc: '',
					schedule: []
				}
			]
		}))
	}

	const handleUpdateDay = (index, field, val) => {
		const updated = [...form.itinerary]
		updated[index] = { ...updated[index], [field]: val }
		setForm(prev => ({ ...prev, itinerary: updated }))
	}

	const handleRemoveDay = (index) => {
		setForm(prev => ({
			...prev,
			itinerary: prev.itinerary.filter((_, i) => i !== index)
		}))
	}

	// Dynamic list management (inclusions, exclusions, terms, keyInclusions)
	const handleAddListItem = (field) => {
		setForm(prev => ({
			...prev,
			[field]: [...(prev[field] || []), '']
		}))
	}

	const handleUpdateListItem = (field, index, val) => {
		const list = [...(form[field] || [])]
		list[index] = val
		setForm(prev => ({ ...prev, [field]: list }))
	}

	const handleRemoveListItem = (field, index) => {
		setForm(prev => ({
			...prev,
			[field]: (form[field] || []).filter((_, i) => i !== index)
		}))
	}

	// Day-by-Day schedule bullet points management (Green box on single tour page)
	const handleAddDaySchedule = (dayIndex) => {
		const updated = [...(form.itinerary || [])]
		const currentDay = updated[dayIndex] || {}
		const currentSched = Array.isArray(currentDay.schedule) ? currentDay.schedule : []
		updated[dayIndex] = {
			...currentDay,
			schedule: [...currentSched, '']
		}
		setForm(prev => ({ ...prev, itinerary: updated }))
	}

	const handleUpdateDaySchedule = (dayIndex, schedIndex, val) => {
		const updated = [...(form.itinerary || [])]
		const currentDay = updated[dayIndex] || {}
		const currentSched = [...(Array.isArray(currentDay.schedule) ? currentDay.schedule : [])]
		currentSched[schedIndex] = val
		updated[dayIndex] = {
			...currentDay,
			schedule: currentSched
		}
		setForm(prev => ({ ...prev, itinerary: updated }))
	}

	const handleRemoveDaySchedule = (dayIndex, schedIndex) => {
		const updated = [...(form.itinerary || [])]
		const currentDay = updated[dayIndex] || {}
		const currentSched = (Array.isArray(currentDay.schedule) ? currentDay.schedule : []).filter((_, i) => i !== schedIndex)
		updated[dayIndex] = {
			...currentDay,
			schedule: currentSched
		}
		setForm(prev => ({ ...prev, itinerary: updated }))
	}

	// Gallery management (Tab 5: Tour Gallery)
	const handleAddGalleryItem = () => {
		setForm(prev => ({
			...prev,
			gallery: [...(prev.gallery || []), { src: '', title: '' }]
		}))
	}

	const handleUpdateGalleryItem = (index, field, val) => {
		const updated = [...(form.gallery || [])]
		updated[index] = { ...updated[index], [field]: val }
		setForm(prev => ({ ...prev, gallery: updated }))
	}

	const handleRemoveGalleryItem = (index) => {
		setForm(prev => ({
			...prev,
			gallery: (prev.gallery || []).filter((_, i) => i !== index)
		}))
	}

	const handleSubmit = async (e) => {
		e.preventDefault()

		// Tab 1 Validations
		if (!form.title?.trim()) {
			showToast('Please enter the Full Tour Title in Tab 1', 'error')
			setActiveTab('basic')
			return
		}
		if (!form.shortTitle?.trim()) {
			showToast('Please enter the Short Menu Title in Tab 1', 'error')
			setActiveTab('basic')
			return
		}
		if (!form.slug?.trim()) {
			showToast('Please provide a URL Slug in Tab 1', 'error')
			setActiveTab('basic')
			return
		}
		if (!form.days || parseInt(form.days) <= 0) {
			showToast('Please specify a valid Days Count in Tab 1', 'error')
			setActiveTab('basic')
			return
		}
		if (!form.image) {
			showToast('Please upload the Main Banner Image in Tab 1', 'error')
			setActiveTab('basic')
			return
		}

		// Tab 2 Validations
		if (!form.destination?.trim()) {
			showToast('Please enter Key Destination Spots in Tab 2', 'error')
			setActiveTab('about')
			return
		}
		if (!form.about?.trim()) {
			showToast('Please enter Detailed Overview (About This Tour) in Tab 2', 'error')
			setActiveTab('about')
			return
		}

		// Tab 3 Itinerary Validations
		if (Array.isArray(form.itinerary) && form.itinerary.length > 0) {
			for (let i = 0; i < form.itinerary.length; i++) {
				const day = form.itinerary[i]
				const dayLabel = day.day || `Day ${i + 1}`
				if (!day.title?.trim()) {
					showToast(`Please enter Title for ${dayLabel} in Tab 3`, 'error')
					setActiveTab('itinerary')
					return
				}
				if (!day.loc?.trim()) {
					showToast(`Please enter Location for ${dayLabel} in Tab 3`, 'error')
					setActiveTab('itinerary')
					return
				}
				if (!day.desc?.trim()) {
					showToast(`Please enter Description / Activities for ${dayLabel} in Tab 3`, 'error')
					setActiveTab('itinerary')
					return
				}
			}
		}

		setSaving(true)
		try {
			const computedSlug = (form.slug || computeUniqueSlug(form.title || form.shortTitle, existingPackages, id)).trim()
			const computedCanonical = (form.canonicalUrl || (computedSlug ? buildCanonicalUrl('tour', computedSlug) : '')).trim()
			const cleanItinerary = (form.itinerary || []).map(day => ({
				...day,
				image: (day.image || '').trim(),
				imageTitle: (day.imageTitle || '').trim(),
				schedule: (Array.isArray(day.schedule) ? day.schedule : []).map(s => (typeof s === 'string' ? s.trim() : s)).filter(Boolean)
			}))
			const cleanKeyInclusions = (form.keyInclusions || []).map(s => (typeof s === 'string' ? s.trim() : s)).filter(Boolean)

			const d = parseInt(form.days) || 1
			const n = (form.nights !== '' && form.nights !== undefined && !isNaN(parseInt(form.nights))) ? parseInt(form.nights) : 0
			const autoDuration = `${d} Day${d > 1 ? 's' : ''} | ${n} Night${n > 1 ? 's' : ''}`

			const payload = {
				...form,
				slug: computedSlug,
				canonicalUrl: computedCanonical,
				days: d,
				nights: n,
				duration: autoDuration,
				showInExplore: form.showInExplore !== false,
				showInExclusive: form.showInExclusive !== false,
				badge: (form.badge || '').trim(),
				keyInclusions: cleanKeyInclusions,
				inclusions: (form.inclusions || []).map(s => s.trim()).filter(Boolean),
				exclusions: (form.exclusions || []).map(s => s.trim()).filter(Boolean),
				terms: (form.terms || []).map(s => s.trim()).filter(Boolean),
				gallery: (form.gallery || []).filter(g => g && g.src),
				itinerary: cleanItinerary
			}

			if (isEdit) {
				await updatePackage(id, payload)
				showToast('Tour package updated successfully!', 'success')
			} else {
				await createPackage(payload)
				showToast('New tour package created successfully!', 'success')
			}
			setTimeout(() => navigate('/packages'), 1000)
		} catch (err) {
			showToast(err.message || 'Error saving package', 'error')
		} finally {
			setSaving(false)
		}
	}

	if (loading) {
		return (
			<AdminLayout title={isEdit ? "Edit Tour" : "Add Tour"}>
				<div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>Loading package details...</div>
			</AdminLayout>
		)
	}

	return (
		<AdminLayout title={isEdit ? `Edit: ${form.shortTitle || form.title}` : "Add New Tour Package"}>
			<form onSubmit={handleSubmit}>
				{/* Top Actions Bar */}
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
					<Link to="/packages" style={{ color: '#64748b', textDecoration: 'none', fontSize: '13.5px', fontWeight: '700' }}>
						← Back to Tour List
					</Link>
					<button
						type="submit"
						disabled={saving}
						style={{
							background: 'linear-gradient(135deg, #16a34a, #0f7a37)',
							color: '#fff',
							padding: '12px 28px',
							borderRadius: '12px',
							border: 'none',
							fontWeight: '800',
							fontSize: '14px',
							cursor: saving ? 'not-allowed' : 'pointer',
							boxShadow: '0 4px 16px rgba(22,163,74,0.3)',
							opacity: saving ? 0.7 : 1,
							display: 'inline-flex',
							alignItems: 'center',
							gap: '8px'
						}}
					>
						{isEdit ? <IconSave size={16} /> : <IconSave size={16} />}
						<span>{saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Publish Tour Package'}</span>
					</button>
				</div>

				{/* Tab Navigation (5 Tabs) */}
				<div style={{ display: 'flex', gap: '10px', marginBottom: '24px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', overflowX: 'auto' }}>
					{[
						{ id: 'basic', label: '1. Basic Information' },
						{ id: 'about', label: '2. Destination & Story' },
						{ id: 'itinerary', label: `3. Day-Wise Itinerary (${form.itinerary?.length || 0})` },
						{ id: 'inclusions', label: '4. Inclusions & Policies' },
						{ id: 'seo', label: '5. SEO & Meta Tags' },
					].map(t => (
						<button
							key={t.id}
							type="button"
							onClick={() => setActiveTab(t.id)}
							style={{
								padding: '9px 18px',
								borderRadius: '10px',
								border: activeTab === t.id ? 'none' : '1px solid #cbd5e1',
								background: activeTab === t.id ? '#16a34a' : '#ffffff',
								color: activeTab === t.id ? '#fff' : '#64748b',
								fontWeight: '700',
								fontSize: '13px',
								cursor: 'pointer',
								whiteSpace: 'nowrap',
								boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
							}}
						>
							{t.label}
						</button>
					))}
				</div>

				{/* TAB 1: BASIC INFORMATION */}
				{activeTab === 'basic' && (
					<div style={{ background: '#ffffff', padding: '28px', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
						<div>
							<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
								<label style={{ fontSize: '12px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', margin: 0 }}>Full Tour Title *</label>
								<span style={{ fontSize: '11px', color: (form.title || '').length > 140 ? '#dc2626' : '#64748b', fontWeight: '700' }}>
									{(form.title || '').length}/150 chars allowed
								</span>
							</div>
							<input type="text" name="title" required maxLength={150} value={form.title} onChange={handleChange} placeholder="e.g. SWITZERLAND & THE ALPS – Zurich, Lucerne & Interlaken" style={inputStyle} />
						</div>

						<div>
							<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
								<label style={{ fontSize: '12px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', margin: 0 }}>Short Menu Title *</label>
								<span style={{ fontSize: '11px', color: (form.shortTitle || '').length > 50 ? '#dc2626' : '#64748b', fontWeight: '700' }}>
									{(form.shortTitle || '').length}/60 chars allowed
								</span>
							</div>
							<input type="text" name="shortTitle" required maxLength={60} value={form.shortTitle} onChange={handleChange} placeholder="e.g. Switzerland Explorer" style={inputStyle} />
						</div>

						<div>
							<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
								<div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
									<label style={{ fontSize: '12px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', margin: 0 }}>
										URL Slug *
									</label>
									<span style={{ fontSize: '11px', color: '#64748b', fontWeight: '700' }}>
										{(form.slug || '').length}/100 chars
									</span>
								</div>
								<button
									type="button"
									onClick={handleRegenerateSlug}
									title="Click to automatically generate slug from tour title"
									style={{
										background: '#ecfdf5',
										color: '#16a34a',
										border: '1px solid #bbf7d0',
										padding: '4px 10px',
										borderRadius: '6px',
										fontSize: '11px',
										fontWeight: '700',
										cursor: 'pointer',
										display: 'inline-flex',
										alignItems: 'center',
										gap: '4px'
									}}
								>
									<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
										<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
									</svg>
									<span>Auto-Generate Slug</span>
								</button>
							</div>
							<input
								type="text"
								name="slug"
								required
								maxLength={100}
								value={form.slug}
								onChange={handleChange}
								onBlur={handleSlugBlur}
								placeholder="e.g. switzerland-alps-explorer"
								style={inputStyle}
							/>
							<div style={{ margin: '5px 0 0', fontSize: '11.5px', color: '#64748b', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px' }}>
								<span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
									<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
										<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
										<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
									</svg>
									<span>Link: <strong style={{ color: '#16a34a' }}>/tour/{form.slug || '...'}</strong></span>
								</span>
							</div>
						</div>

						<div>
							<label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: '#475569', marginBottom: '8px', textTransform: 'uppercase' }}>Type *</label>
							<select name="type" required value={form.type} onChange={handleChange} style={inputStyle}>
								<option value="INTERNATIONAL">INTERNATIONAL</option>
								<option value="DOMESTIC">DOMESTIC</option>
							</select>
						</div>

						<div>
							<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
								<label style={{ fontSize: '12px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', margin: 0 }}>
									Tour Badge / Tag (Card Top-Right Pill)
								</label>
								<span style={{ fontSize: '11px', color: (form.badge || '').length > 50 ? '#dc2626' : '#64748b', fontWeight: '700' }}>
									{(form.badge || '').length}/60 chars allowed
								</span>
							</div>
							<input
								type="text"
								name="badge"
								maxLength={60}
								value={form.badge || ''}
								onChange={handleChange}
								placeholder="e.g. Adventure & Island Gala, Cultural Festival"
								style={inputStyle}
							/>
							{/* <div style={{ margin: '5px 0 0', fontSize: '11.5px', color: '#64748b' }}>
								Displays as the golden pill badge on top right of tour card.
							</div> */}
						</div>

						<div>
							<label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: '#475569', marginBottom: '8px', textTransform: 'uppercase' }}>
								Days Count / Nights Count *
							</label>
							<div style={{ display: 'flex', gap: '10px' }}>
								<input type="number" min="1" max="60" name="days" required value={form.days} onChange={handleChange} placeholder="Days *" style={inputStyle} />
								<input type="number" min="0" max="60" name="nights" required value={form.nights} onChange={handleChange} placeholder="Nights *" style={inputStyle} />
							</div>
							<div style={{ margin: '6px 0 0', fontSize: '11.5px', color: '#16a34a', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '5px' }}>
								<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
									<rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
									<line x1="16" y1="2" x2="16" y2="6" />
									<line x1="8" y1="2" x2="8" y2="6" />
									<line x1="3" y1="10" x2="21" y2="10" />
								</svg>
								<span>Auto Duration: {form.days ? `${form.days} Day${parseInt(form.days) > 1 ? 's' : ''}` : '1 Day'} | {form.nights !== '' && form.nights !== undefined ? `${form.nights} Night${parseInt(form.nights) > 1 ? 's' : ''}` : '0 Nights'}</span>
							</div>
						</div>

						{/* Dynamic Toggle: Show in "Explore The World / Trending Destinations" Slider on Home Page */}
						<div style={{ background: '#f8fafc', padding: '16px 20px', borderRadius: '16px', border: '1.5px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '8px', gridColumn: '1 / -1' }}>
							<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
								<div>
									<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
										<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
											<circle cx="12" cy="12" r="10" />
											<line x1="2" y1="12" x2="22" y2="12" />
											<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
										</svg>
										<label style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a', textTransform: 'uppercase', margin: 0 }}>
											Show in "Explore The World / Trending Destinations" Slider on Home Page
										</label>
									</div>
									<p style={{ margin: '4px 0 0', fontSize: '12px', color: '#64748b' }}>
										Choose whether this package dynamically appears inside the "Explore The World / Top Trending Destinations" homepage slider.
									</p>
								</div>
								<div style={{ display: 'inline-flex', background: '#ffffff', padding: '4px', borderRadius: '10px', border: '1.5px solid #cbd5e1', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
									<button
										type="button"
										onClick={() => setForm(prev => ({ ...prev, showInExplore: true }))}
										style={{
											padding: '7px 18px',
											borderRadius: '7px',
											border: 'none',
											background: form.showInExplore !== false ? '#16a34a' : 'transparent',
											color: form.showInExplore !== false ? '#ffffff' : '#64748b',
											fontWeight: '800',
											fontSize: '12.5px',
											cursor: 'pointer',
											transition: 'all 0.2s',
											boxShadow: form.showInExplore !== false ? '0 2px 6px rgba(22,163,74,0.3)' : 'none',
											display: 'inline-flex',
											alignItems: 'center',
											gap: '5px'
										}}
									>
										<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
										<span>Show in Explore</span>
									</button>
									<button
										type="button"
										onClick={() => setForm(prev => ({ ...prev, showInExplore: false }))}
										style={{
											padding: '7px 18px',
											borderRadius: '7px',
											border: 'none',
											background: form.showInExplore === false ? '#dc2626' : 'transparent',
											color: form.showInExplore === false ? '#ffffff' : '#64748b',
											fontWeight: '800',
											fontSize: '12.5px',
											cursor: 'pointer',
											transition: 'all 0.2s',
											boxShadow: form.showInExplore === false ? '0 2px 6px rgba(220,38,38,0.3)' : 'none',
											display: 'inline-flex',
											alignItems: 'center',
											gap: '5px'
										}}
									>
										<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
										<span>Don't Show</span>
									</button>
								</div>
							</div>
						</div>

						{/* Dynamic Toggle: Show in "Exclusive Tour Packages" Carousel on Home Page */}
						<div style={{ background: '#f8fafc', padding: '16px 20px', borderRadius: '16px', border: '1.5px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '8px', gridColumn: '1 / -1' }}>
							<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
								<div>
									<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
										<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
											<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
										</svg>
										<label style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a', textTransform: 'uppercase', margin: 0 }}>
											Show in "Exclusive Tour Packages" Carousel on Home Page
										</label>
									</div>
									<p style={{ margin: '4px 0 0', fontSize: '12px', color: '#64748b' }}>
										Choose whether this package dynamically appears inside the "Exclusive Tour Packages / Golden Leisure" section on the homepage.
									</p>
								</div>
								<div style={{ display: 'inline-flex', background: '#ffffff', padding: '4px', borderRadius: '10px', border: '1.5px solid #cbd5e1', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
									<button
										type="button"
										onClick={() => setForm(prev => ({ ...prev, showInExclusive: true }))}
										style={{
											padding: '7px 18px',
											borderRadius: '7px',
											border: 'none',
											background: form.showInExclusive !== false ? '#16a34a' : 'transparent',
											color: form.showInExclusive !== false ? '#ffffff' : '#64748b',
											fontWeight: '800',
											fontSize: '12.5px',
											cursor: 'pointer',
											transition: 'all 0.2s',
											boxShadow: form.showInExclusive !== false ? '0 2px 6px rgba(22,163,74,0.3)' : 'none',
											display: 'inline-flex',
											alignItems: 'center',
											gap: '5px'
										}}
									>
										<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
										<span>Show in Exclusive</span>
									</button>
									<button
										type="button"
										onClick={() => setForm(prev => ({ ...prev, showInExclusive: false }))}
										style={{
											padding: '7px 18px',
											borderRadius: '7px',
											border: 'none',
											background: form.showInExclusive === false ? '#dc2626' : 'transparent',
											color: form.showInExclusive === false ? '#ffffff' : '#64748b',
											fontWeight: '800',
											fontSize: '12.5px',
											cursor: 'pointer',
											transition: 'all 0.2s',
											boxShadow: form.showInExclusive === false ? '0 2px 6px rgba(220,38,38,0.3)' : 'none',
											display: 'inline-flex',
											alignItems: 'center',
											gap: '5px'
										}}
									>
										<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
										<span>Don't Show</span>
									</button>
								</div>
							</div>
						</div>

						<div>
							<ImageUploader
								label="Main Banner Image (Drag & Drop or Browse)"
								resolution="800 × 600 px · 4:3 Landscape"
								required={true}
								value={form.image}
								onChange={url => setForm(prev => ({ ...prev, image: url }))}
								placeholder="Upload or enter image URL"
							/>
						</div>
					</div>
				)}

				{/* TAB 2: DESTINATION & STORY */}
				{activeTab === 'about' && (
					<div style={{ background: '#ffffff', padding: '28px', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '22px' }}>
						<div>
							<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
								<label style={{ fontSize: '12px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', margin: 0 }}>
									Key Destination Spots *
								</label>
								<span style={{ fontSize: '11px', color: (form.destination || '').length > 140 ? '#dc2626' : '#64748b', fontWeight: '700' }}>
									{(form.destination || '').length}/150 chars allowed
								</span>
							</div>
							<input
								type="text"
								name="destination"
								required
								maxLength={150}
								value={form.destination}
								onChange={handleChange}
								placeholder="e.g. Zurich, Lucerne, Interlaken & Mount Titlis"
								style={inputStyle}
							/>
							<p style={{ margin: '6px 0 0', fontSize: '11.5px', color: '#64748b' }}>
								Displayed as the destination spot on tour cards and inside the package page.
							</p>
						</div>

						{/* Card Key Highlights / Inclusions (Green Checkmarks) */}
						<div style={{ background: '#f8fafc', padding: '22px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
							<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
								<div>
									<h4 style={{ fontSize: '14px', fontWeight: '800', color: '#16a34a', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
										<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
										<span>Tour Card Key Highlights</span>
									</h4>
									<p style={{ margin: '4px 0 0', fontSize: '12px', color: '#64748b' }}>
										Add key highlights shown with green checkmarks on the tour card and details banner (top 3–4 items shown, max 140 chars each).
									</p>
								</div>
								<button
									type="button"
									onClick={() => handleAddListItem('keyInclusions')}
									style={addBtnStyle}
								>
									+ Add Highlight
								</button>
							</div>

							<div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
								{(form.keyInclusions || []).map((item, idx) => (
									<div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
										<span style={{ color: '#16a34a', width: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
											<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
										</span>
										<div style={{ position: 'relative', flex: 1 }}>
											<input
												type="text"
												maxLength={140}
												value={item}
												onChange={(e) => handleUpdateListItem('keyInclusions', idx, e.target.value)}
												placeholder={`e.g. ${idx === 0 ? '5-Star Luxury Resort Stay' : idx === 1 ? 'Roundtrip Flights & Airport Transfers' : 'All Buffet Meals & High Tea'}`}
												style={{ ...inputStyle, paddingRight: '75px' }}
											/>
											<span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '10.5px', color: (item || '').length > 130 ? '#dc2626' : '#94a3b8', pointerEvents: 'none', fontWeight: '600' }}>
												{(item || '').length}/140
											</span>
										</div>
										<button
											type="button"
											onClick={() => handleRemoveListItem('keyInclusions', idx)}
											style={delBtnStyle}
											title="Remove highlight"
										>
											<IconClose size={12} />
										</button>
									</div>
								))}
								{(!form.keyInclusions || form.keyInclusions.length === 0) && (
									<div style={{ textAlign: 'center', padding: '16px', color: '#94a3b8', fontSize: '13px' }}>
										No key highlights added yet. Click <strong>+ Add Highlight</strong> above to add bullet points shown with green checkmarks.
									</div>
								)}
							</div>
						</div>

						<div>
							<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
								<label style={{ fontSize: '12px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', margin: 0 }}>
									Detailed Overview (About This Tour) *
								</label>
								<span style={{ fontSize: '11px', color: (form.about || '').length > 2400 ? '#dc2626' : '#64748b', fontWeight: '700' }}>
									{(form.about || '').length}/2500 chars allowed
								</span>
							</div>
							<textarea
								name="about"
								required
								maxLength={2500}
								rows="6"
								value={form.about}
								onChange={handleChange}
								placeholder="Write the compelling destination narrative and overview..."
								style={{ ...inputStyle, resize: 'vertical' }}
							/>
						</div>
					</div>
				)}

				{/* TAB 3: ITINERARY MANAGER */}
				{activeTab === 'itinerary' && (
					<div style={{ background: '#ffffff', padding: '28px', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
						<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
							<h3 style={{ fontSize: '17px', fontWeight: '800', color: '#0f172a', margin: 0 }}>Day-by-Day Itinerary Planner</h3>
							<button type="button" onClick={handleAddDay} style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: '700', fontSize: '12px', cursor: 'pointer', boxShadow: '0 2px 6px rgba(22,163,74,0.2)' }}>
								+ Add Next Day
							</button>
						</div>

						<div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
							{(form.itinerary || []).map((item, idx) => (
								<div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
									<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
										<div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
											<input
												type="text"
												value={item.day}
												onChange={(e) => handleUpdateDay(idx, 'day', e.target.value)}
												style={{ ...inputStyle, width: '90px', padding: '6px 10px', fontWeight: '800', background: '#ffffff', color: '#d97706', border: '1px solid #cbd5e1' }}
											/>
											<span style={{ fontSize: '13px', color: '#64748b' }}>Day #{idx + 1}</span>
										</div>
										<button
											type="button"
											onClick={() => handleRemoveDay(idx)}
											style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', cursor: 'pointer', fontSize: '12px', fontWeight: '700', padding: '4px 10px', borderRadius: '6px' }}
										>
											Remove Day
										</button>
									</div>

									<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '14px' }}>
										<div>
											<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
												<label style={{ fontSize: '11.5px', fontWeight: '700', color: '#475569', margin: 0 }}>Title *</label>
												<span style={{ fontSize: '10.5px', color: (item.title || '').length > 110 ? '#dc2626' : '#94a3b8', fontWeight: '600' }}>
													{(item.title || '').length}/120 chars
												</span>
											</div>
											<input type="text" required maxLength={120} value={item.title || ''} onChange={(e) => handleUpdateDay(idx, 'title', e.target.value)} placeholder="Enter day title..." style={inputStyle} />
										</div>
										<div>
											<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
												<label style={{ fontSize: '11.5px', fontWeight: '700', color: '#475569', margin: 0 }}>Location *</label>
												<span style={{ fontSize: '10.5px', color: (item.loc || '').length > 90 ? '#dc2626' : '#94a3b8', fontWeight: '600' }}>
													{(item.loc || '').length}/100 chars
												</span>
											</div>
											<input type="text" required maxLength={100} value={item.loc || ''} onChange={(e) => handleUpdateDay(idx, 'loc', e.target.value)} placeholder="Enter location..." style={inputStyle} />
										</div>
										<div>
											<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
												<label style={{ fontSize: '11.5px', fontWeight: '700', color: '#475569', margin: 0 }}>Meals Plan</label>
												<span style={{ fontSize: '10.5px', color: '#94a3b8', fontWeight: '600' }}>
													{(item.meals || '').length}/80 chars
												</span>
											</div>
											<input type="text" maxLength={80} value={item.meals || ''} onChange={(e) => handleUpdateDay(idx, 'meals', e.target.value)} placeholder="e.g. Breakfast, Dinner" style={inputStyle} />
										</div>
									</div>

									{/* Drag & Drop Day Destination Photo Uploader with Photo Name / Caption */}
									<div style={{ marginBottom: '16px', background: '#f8fafc', padding: '16px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
										<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', alignItems: 'flex-start' }}>
											<div>
												<ImageUploader
													label={`Day ${idx + 1} Destination Photo (Drag & Drop or Browse)`}
													placeholder="Drag and drop photo here, browse from device, or enter image URL"
													value={item.image || ''}
													onChange={(url) => handleUpdateDay(idx, 'image', url)}
												/>
											</div>
											<div>
												<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
													<label style={{ fontSize: '12px', fontWeight: '800', color: '#1e293b', margin: 0 }}>
														Photo Name / Caption
													</label>
													<span style={{ fontSize: '10.5px', color: (item.imageTitle || '').length > 70 ? '#dc2626' : '#94a3b8', fontWeight: '600' }}>
														{(item.imageTitle || '').length}/80 chars
													</span>
												</div>
												<input
													type="text"
													maxLength={80}
													value={item.imageTitle || ''}
													onChange={(e) => handleUpdateDay(idx, 'imageTitle', e.target.value)}
													placeholder={`e.g. Day ${idx + 1}: ${item.title || 'Scenic Destination View'}`}
													style={{ ...inputStyle, background: '#ffffff', border: '1.5px solid #cbd5e1', padding: '10px 12px', fontSize: '13px', borderRadius: '10px' }}
												/>
												{/* <div style={{ fontSize: '11px', color: '#64748b', marginTop: '6px', lineHeight: 1.4 }}>
													💡 <em>This name appears as the dark overlay caption on the bottom of the photo in the tour details page. If left blank, it automatically uses &ldquo;{item.title ? `${item.day || `Day ${idx + 1}`}: ${item.title}` : `Day ${idx + 1}: Scenic View`}&rdquo;.</em>
												</div> */}
											</div>
										</div>
									</div>

									<div>
										<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
											<label style={{ fontSize: '11.5px', fontWeight: '700', color: '#475569', margin: 0 }}>Description / Activities *</label>
											<span style={{ fontSize: '10.5px', color: (item.desc || '').length > 1400 ? '#dc2626' : '#94a3b8', fontWeight: '600' }}>
												{(item.desc || '').length}/1500 chars allowed
											</span>
										</div>
										<textarea required maxLength={1500} rows="4" value={item.desc || ''} onChange={(e) => handleUpdateDay(idx, 'desc', e.target.value)} placeholder="Enter day description and sightseeing activities..." style={{ ...inputStyle, resize: 'vertical' }} />
									</div>

									{/* Timed Schedule / Activities (Green Box Bullet Points) */}
									<div style={{ marginTop: '16px', padding: '16px', backgroundColor: '#f0fdf4', borderRadius: '12px', border: '1px solid #bbf7d0', borderLeft: '4px solid #16a34a' }}>
										<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
											<div>
												<label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: '#15803d', margin: 0 }}>
													Timed Schedule &amp; Activity Points
												</label>
											</div>
											<button
												type="button"
												onClick={() => handleAddDaySchedule(idx)}
												style={{
													background: '#16a34a',
													color: '#ffffff',
													border: 'none',
													padding: '4px 12px',
													borderRadius: '6px',
													fontSize: '11.5px',
													fontWeight: '700',
													cursor: 'pointer'
												}}
											>
												+ Add Point
											</button>
										</div>

										<div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
											{(Array.isArray(item.schedule) ? item.schedule : []).map((slot, sIdx) => (
												<div key={sIdx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
													<span style={{ color: '#16a34a', fontWeight: '800', fontSize: '15px' }}>•</span>
													<div style={{ position: 'relative', flex: 1 }}>
														<input
															type="text"
															maxLength={200}
															value={slot}
															onChange={(e) => handleUpdateDaySchedule(idx, sIdx, e.target.value)}
															placeholder="e.g. 12:30 PM onwards: Welcome and check-in at resort"
															style={{ ...inputStyle, background: '#ffffff', fontSize: '12.5px', padding: '7px 75px 7px 10px' }}
														/>
														<span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '10px', color: '#94a3b8', pointerEvents: 'none', fontWeight: '600' }}>
															{(slot || '').length}/200
														</span>
													</div>
													<button
														type="button"
														onClick={() => handleRemoveDaySchedule(idx, sIdx)}
														style={{ ...delBtnStyle, background: '#fee2e2' }}
														title="Remove point"
													>
														<IconClose size={12} />
													</button>
												</div>
											))}
											{(!item.schedule || item.schedule.length === 0) && (
												<div style={{ fontSize: '11.5px', color: '#65a30d', fontStyle: 'italic', padding: '4px 0' }}>
													No timed bullet points added yet. Click <strong>+ Add Point</strong> above if this day includes a timed itinerary box.
												</div>
											)}
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{/* TAB 4: INCLUSIONS & POLICIES */}
				{activeTab === 'inclusions' && (
					<div style={{ background: '#ffffff', padding: '28px', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
						{/* Inclusions */}
						<div>
							<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
								<div>
									<h4 style={{ fontSize: '14px', fontWeight: '800', color: '#16a34a', margin: 0 }}>What Is Included</h4>
									<span style={{ fontSize: '11px', color: '#64748b' }}>Max 200 chars per item</span>
								</div>
								<button type="button" onClick={() => handleAddListItem('inclusions')} style={addBtnStyle}>+ Add</button>
							</div>
							<div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
								{(form.inclusions || []).map((item, idx) => (
									<div key={idx} style={{ display: 'flex', gap: '8px' }}>
										<input type="text" maxLength={200} value={item} onChange={(e) => handleUpdateListItem('inclusions', idx, e.target.value)} placeholder="Enter inclusion item..." style={inputStyle} />
										<button type="button" onClick={() => handleRemoveListItem('inclusions', idx)} style={delBtnStyle}>
											<IconClose size={12} />
										</button>
									</div>
								))}
							</div>
						</div>

						{/* Exclusions */}
						<div>
							<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
								<div>
									<h4 style={{ fontSize: '14px', fontWeight: '800', color: '#dc2626', margin: 0 }}>Exclusions / Not Included</h4>
									<span style={{ fontSize: '11px', color: '#64748b' }}>Max 200 chars per item</span>
								</div>
								<button type="button" onClick={() => handleAddListItem('exclusions')} style={addBtnStyle}>+ Add</button>
							</div>
							<div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
								{(form.exclusions || []).map((item, idx) => (
									<div key={idx} style={{ display: 'flex', gap: '8px' }}>
										<input type="text" maxLength={200} value={item} onChange={(e) => handleUpdateListItem('exclusions', idx, e.target.value)} placeholder="Enter exclusion item..." style={inputStyle} />
										<button type="button" onClick={() => handleRemoveListItem('exclusions', idx)} style={delBtnStyle}>
											<IconClose size={12} />
										</button>
									</div>
								))}
							</div>
						</div>

						{/* Terms */}
						<div style={{ gridColumn: '1 / -1' }}>
							<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
								<div>
									<h4 style={{ fontSize: '14px', fontWeight: '800', color: '#d97706', margin: 0 }}>Terms &amp; Conditions</h4>
									<span style={{ fontSize: '11px', color: '#64748b' }}>Max 350 chars per condition</span>
								</div>
								<button type="button" onClick={() => handleAddListItem('terms')} style={addBtnStyle}>+ Add</button>
							</div>
							<div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
								{(form.terms || []).map((item, idx) => (
									<div key={idx} style={{ display: 'flex', gap: '8px' }}>
										<input type="text" maxLength={350} value={item} onChange={(e) => handleUpdateListItem('terms', idx, e.target.value)} placeholder="Enter terms & conditions item..." style={inputStyle} />
										<button type="button" onClick={() => handleRemoveListItem('terms', idx)} style={delBtnStyle}>
											<IconClose size={12} />
										</button>
									</div>
								))}
							</div>
						</div>
					</div>
				)}

				{/* TAB 5: SEO & Meta Tags */}
				{activeTab === 'seo' && (
					<div style={{ maxWidth: '800px', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '28px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
						<h3 style={{ fontSize: '17px', fontWeight: '800', color: '#0f172a', margin: '0 0 8px 0' }}>
							Tour Package SEO & Meta Tags
						</h3>
						<p style={{ margin: '0 0 24px 0', fontSize: '13px', color: '#64748b' }}>
							Configure meta title, description, and keywords for search engines.
						</p>

						{/* Custom Meta Title */}
						<div style={{ marginBottom: '20px' }}>
							<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
								<label style={{ fontSize: '13px', fontWeight: '700', color: '#334155' }}>
									Meta Title (Search Headline)
								</label>
								<span style={{ fontSize: '11.5px', color: (form.metaTitle || '').length > 65 ? '#dc2626' : '#64748b', fontWeight: '600' }}>
									{(form.metaTitle || '').length}/70 chars allowed
								</span>
							</div>
							<input
								type="text"
								name="metaTitle"
								maxLength={70}
								value={form.metaTitle || ''}
								onChange={handleChange}
								placeholder={form.title ? `${form.title} | Golden Travels` : 'e.g. 5 Days Dubai Luxury Tour Package | Golden Travels'}
								style={inputStyle}
							/>
						</div>

						{/* Custom Meta Description */}
						<div style={{ marginBottom: '20px' }}>
							<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
								<label style={{ fontSize: '13px', fontWeight: '700', color: '#334155' }}>
									Meta Description (Search Snippet)
								</label>
								<span style={{ fontSize: '11.5px', color: (form.metaDescription || '').length > 165 ? '#dc2626' : '#64748b', fontWeight: '600' }}>
									{(form.metaDescription || '').length}/180 chars allowed
								</span>
							</div>
							<textarea
								name="metaDescription"
								maxLength={180}
								rows={3}
								value={form.metaDescription || ''}
								onChange={handleChange}
								placeholder={form.about ? form.about.slice(0, 150) + '...' : 'e.g. Book handcrafted luxury tour package with stays and transfers from Golden Travels.'}
								style={{ ...inputStyle, resize: 'vertical' }}
							/>
						</div>

						{/* Custom Keywords */}
						<div style={{ marginBottom: '20px' }}>
							<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
								<label style={{ fontSize: '13px', fontWeight: '700', color: '#334155', margin: 0 }}>
									Meta Keywords (Comma separated)
								</label>
								<span style={{ fontSize: '11.5px', color: (form.metaKeywords || '').length > 370 ? '#dc2626' : '#64748b', fontWeight: '600' }}>
									{(form.metaKeywords || '').length}/400 chars allowed
								</span>
							</div>
							<input
								type="text"
								name="metaKeywords"
								maxLength={400}
								value={form.metaKeywords || ''}
								onChange={handleChange}
								placeholder={`e.g. ${form.title || 'tour'}, ${form.destination || 'destination'}, holiday package, golden travels`}
								style={inputStyle}
							/>
						</div>

						{/* Canonical Link */}
						<div style={{ marginBottom: '10px' }}>
							<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
								<label style={{ fontSize: '13px', fontWeight: '700', color: '#334155', display: 'block', margin: 0 }}>
									Canonical Link (Canonical URL)
								</label>
								<button
									type="button"
									onClick={() => {
										const currentSlug = form.slug || computeUniqueSlug(form.title || form.shortTitle, existingPackages, id)
										const link = currentSlug ? buildCanonicalUrl('tour', currentSlug) : ''
										setForm(prev => ({ ...prev, canonicalUrl: link }))
										showToast(`Canonical link updated: ${link}`, 'info')
									}}
									style={{
										background: '#ecfdf5',
										color: '#16a34a',
										border: '1px solid #bbf7d0',
										padding: '4px 10px',
										borderRadius: '6px',
										fontSize: '11px',
										fontWeight: '700',
										cursor: 'pointer',
										display: 'inline-flex',
										alignItems: 'center',
										gap: '4px'
									}}
								>
									<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
										<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
									</svg>
									<span>Auto-sync with Slug</span>
								</button>
							</div>
							<input
								type="url"
								name="canonicalUrl"
								value={form.canonicalUrl ? resolveCanonicalUrl(form.canonicalUrl, 'tour', form.slug) : (form.slug ? buildCanonicalUrl('tour', form.slug) : '')}
								onChange={handleChange}
								placeholder={form.slug ? buildCanonicalUrl('tour', form.slug) : `${getSiteBaseUrl()}/tour/...`}
								style={inputStyle}
							/>
							
						</div>
					</div>
				)}
			</form>
		</AdminLayout>
	)
}

const inputStyle = {
	width: '100%',
	padding: '11px 14px',
	background: '#ffffff',
	border: '1px solid #cbd5e1',
	borderRadius: '10px',
	color: '#0f172a',
	fontSize: '13.5px',
	outline: 'none',
	boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
}

const addBtnStyle = {
	background: '#f1f5f9',
	color: '#0f172a',
	border: '1px solid #cbd5e1',
	padding: '5px 12px',
	borderRadius: '6px',
	fontSize: '11.5px',
	fontWeight: '700',
	cursor: 'pointer'
}

const delBtnStyle = {
	background: '#fef2f2',
	border: '1px solid #fecaca',
	color: '#dc2626',
	borderRadius: '8px',
	padding: '0 10px',
	cursor: 'pointer',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center'
}
