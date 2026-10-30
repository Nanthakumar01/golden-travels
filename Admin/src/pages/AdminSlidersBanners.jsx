import React, { useEffect, useState } from 'react'
import AdminLayout from './AdminLayout'
import {
	fetchSlides,
	updateSlide,
	createSlide,
	deleteSlide,
	fetchBanners,
	updateBanner,
	fetchPartners,
	createPartner,
	updatePartner,
	deletePartner
} from '@/services/api'
import { useToast } from '@/context/ToastContext'
import ImageUploader from '@/components/ImageUploader'
import {
	IconSliders,
	IconTag,
	IconPlus,
	IconEdit,
	IconTrash,
	IconSave,
	IconClose,
	IconGlobe,
	IconStar,
	IconImage,
	IconLocation
} from '@/components/Icons'
import EmojiKeyboardPicker, { getDisplayEmoji } from '@/components/EmojiKeyboardPicker'

export default function AdminSlidersBanners() {
	const { showToast, confirmAction } = useToast()
	const [activeTab, setActiveTab] = useState('sliders')
	const [slides, setSlides] = useState([])
	const [banners, setBanners] = useState([])
	const [partners, setPartners] = useState([])
	const [loading, setLoading] = useState(true)
	const [editingSlide, setEditingSlide] = useState(null)
	const [editingBanner, setEditingBanner] = useState(null)
	const [editingPartner, setEditingPartner] = useState(null)
	const [saving, setSaving] = useState(false)

	const loadData = async () => {
		try {
			setLoading(true)
			const [resSlides, resBanners, resPartners] = await Promise.all([
				fetchSlides(),
				fetchBanners(),
				fetchPartners({ all: 'true' })
			])
			if (resSlides.success) setSlides(resSlides.data)
			if (resBanners.success) {
				setBanners((resBanners.data || []).filter(b => ['tours', 'blog', 'contact'].includes(b.pageKey)))
			}
			if (resPartners && resPartners.success) {
				setPartners(resPartners.data || [])
			}
		} catch (err) {
			console.error(err)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		loadData()
	}, [])

	const handleSaveSlide = async (e) => {
		e.preventDefault()
		if (!editingSlide?.arches || !editingSlide.arches[0]?.src?.trim()) {
			showToast('Please upload an image for Photo #1 (Main Arch)!', 'error')
			return
		}
		setSaving(true)
		try {
			if (editingSlide.id) {
				await updateSlide(editingSlide.id, editingSlide)
				setSlides(slides.map(s => s.id === editingSlide.id ? editingSlide : s))
				showToast('Slide updated successfully!', 'success')
			} else {
				const res = await createSlide(editingSlide)
				if (res.success) setSlides([...slides, res.data])
				showToast('New slide created successfully!', 'success')
			}
			setEditingSlide(null)
		} catch (err) {
			showToast('Failed to save slide: ' + err.message, 'error')
		} finally {
			setSaving(false)
		}
	}

	const handleDeleteSlide = (id, title) => {
		confirmAction({
			title: 'Delete Hero Slide?',
			message: `Are you sure you want to delete "${title || 'this hero slide'}"? This action cannot be undone.`,
			confirmText: 'Yes, Delete',
			onConfirm: async () => {
				try {
					await deleteSlide(id)
					setSlides(prev => prev.filter(s => s.id !== id))
					showToast('Hero slide deleted successfully', 'success')
				} catch (err) {
					showToast('Delete failed: ' + err.message, 'error')
				}
			}
		})
	}

	const handleToggleCtaBanner = async (slide) => {
		try {
			if (slide.showInCtaBanner) {
				showToast(`Slide "${slide.tab}" is already active in "Experience The World" banner!`, 'info')
				return
			}
			await updateSlide(slide.id, { ...slide, showInCtaBanner: true })
			setSlides(prev => prev.map(s => ({
				...s,
				showInCtaBanner: s.id === slide.id
			})))
			showToast(`Slide "${slide.tab}" photos are now set for "Experience The World" banner!`, 'success')
		} catch (err) {
			showToast('Failed to update banner slide: ' + err.message, 'error')
		}
	}

	const handleSaveBanner = async (e) => {
		e.preventDefault()
		setSaving(true)
		try {
			await updateBanner(editingBanner.id, editingBanner)
			setBanners(banners.map(b => b.id === editingBanner.id ? editingBanner : b))
			showToast('Page banner updated successfully!', 'success')
			setEditingBanner(null)
		} catch (err) {
			showToast('Failed to update banner: ' + err.message, 'error')
		} finally {
			setSaving(false)
		}
	}

	const handleSavePartner = async (e) => {
		e.preventDefault()
		if (!editingPartner?.name?.trim()) {
			showToast('Please enter partner name!', 'error')
			return
		}
		setSaving(true)
		try {
			if (editingPartner.id) {
				const res = await updatePartner(editingPartner.id, editingPartner)
				if (res.success) {
					setPartners(partners.map(p => p.id === editingPartner.id ? res.data : p))
					showToast('Partner updated successfully!', 'success')
				}
			} else {
				const res = await createPartner(editingPartner)
				if (res.success) {
					setPartners([...partners, res.data])
					showToast('New partner badge added!', 'success')
				}
			}
			setEditingPartner(null)
		} catch (err) {
			showToast('Failed to save partner: ' + err.message, 'error')
		} finally {
			setSaving(false)
		}
	}

	const handleDeletePartner = (id, name) => {
		confirmAction({
			title: 'Delete Partner Logo?',
			message: `Are you sure you want to delete "${name}" from the partners ticker?`,
			confirmText: 'Yes, Delete',
			onConfirm: async () => {
				try {
					await deletePartner(id)
					setPartners(prev => prev.filter(p => p.id !== id))
					showToast('Partner badge deleted successfully', 'success')
				} catch (err) {
					showToast('Delete failed: ' + err.message, 'error')
				}
			}
		})
	}

	const handleTogglePartnerActive = async (partner) => {
		try {
			const updated = { ...partner, isActive: !partner.isActive }
			const res = await updatePartner(partner.id, updated)
			if (res.success) {
				setPartners(prev => prev.map(p => p.id === partner.id ? res.data : p))
				showToast(`"${partner.name}" is now ${updated.isActive ? 'Active' : 'Hidden'}`, 'success')
			}
		} catch (err) {
			showToast('Failed to toggle partner: ' + err.message, 'error')
		}
	}

	const renderPartnerIcon = (p) => {
		if (!p) {
			return (
				<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
					<path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
				</svg>
			)
		}
		if (p.imageUrl) {
			return <img src={p.imageUrl} alt={p.name} style={{ width: '22px', height: '22px', objectFit: 'contain' }} />
		}
		const val = (p.iconType || '').trim()

		// 1. Airplane / Flight
		if (['✈️', '🛫', '🛬', '🛩️', 'plane', 'flight', 'airline'].includes(val)) {
			return (
				<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
					<path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
				</svg>
			)
		}

		// 2. Hotel / Bed
		if (['🏨', '🛏️', '🏩', 'hotel', 'resort', 'stay'].includes(val)) {
			return (
				<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
					<path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z"/>
				</svg>
			)
		}

		// 3. Train / Rail
		if (['🚆', '🚄', '🚅', '🚇', 'train', 'rail'].includes(val)) {
			return (
				<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
					<path d="M12 2c-4 0-8 .5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h12v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-4-4-8-4zM7.5 17c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z"/>
				</svg>
			)
		}

		// 4. Globe / Network / World
		if (['🌐', '🌍', '🌎', '🌏', 'globe', 'world'].includes(val)) {
			return (
				<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
					<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
				</svg>
			)
		}

		// 5. Palace / Building / Heritage
		if (['🏛️', '🏢', '🏰', '🏯', 'building', 'palace'].includes(val)) {
			return (
				<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
					<path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zm-7 5h5v5h-5z"/>
				</svg>
			)
		}

		// 6. Star / Luxury
		if (['⭐', '🌟', '✨', 'star'].includes(val)) {
			return (
				<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
					<path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
				</svg>
			)
		}

		// 7. Crown / Royal
		if (['👑', 'crown', 'royal'].includes(val)) {
			return (
				<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
					<path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .55-.45 1-1 1H6c-.55 0-1-.45-1-1v-1h14v1z"/>
				</svg>
			)
		}

		// 8. Diamond
		if (['💎', 'diamond', 'jewel'].includes(val)) {
			return (
				<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
					<path d="M19 3H5L2 9l10 12L22 9l-3-6zM9.62 8l1.5-3h1.76l1.5 3H9.62zM11 10v6.68L5.44 10H11zm2 0h5.56L13 16.68V10zm3.88-2l-1.5-3h2.7l1.5 3h-2.7zM4.92 8l1.5-3H9.12l-1.5 3H4.92z"/>
				</svg>
			)
		}

		// 9. Cruise Ship
		if (['🛳️', '🚢', '🛥️', '⛵', 'ship', 'cruise', 'boat'].includes(val)) {
			return (
				<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
					<path d="M20 21c-1.39 0-2.78-.47-4-1.32-2.44 1.71-5.56 1.71-8 0C6.78 20.53 5.39 21 4 21H2v2h2c1.38 0 2.74-.35 4-.99 2.52 1.29 5.48 1.29 8 0 1.26.65 2.62.99 4 .99h2v-2h-2zM3.95 19H4c1.6 0 3.02-.88 4-2 .98 1.12 2.4 2 4 2s3.02-.88 4-2c.98 1.12 2.4 2 4 2h.05l1.89-6.68c.08-.26.06-.54-.06-.78s-.34-.42-.6-.47L20 11V6c0-1.1-.9-2-2-2h-3V1h-2v3h-2V1H9v3H6c-1.1 0-2 .9-2 2v5l-1.28.27c-.26.05-.48.23-.6.47s-.14.52-.06.78L3.95 19zM6 6h12v5H6V6z"/>
				</svg>
			)
		}

		// 10. Palm Island
		if (['🌴', '🏖️', '🏝️', 'palm', 'beach', 'island'].includes(val)) {
			return (
				<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
					<path d="M13 16.5c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-3-2c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm6 0c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm1.5-4.5C17.5 7.5 15 5.5 12 5.5S6.5 7.5 6.5 10c0 1.93 1.57 3.5 3.5 3.5h4c1.93 0 3.5-1.57 3.5-3.5zm-5.5-8C7.5 2 3.5 5 3.5 9c0 1.5.6 2.8 1.5 3.8-.3-1-.5-2.1-.5-3.3C4.5 6 7 3.5 10 3.5c.7 0 1.4.1 2 .4-.7-1.1-1.3-1.9-2-1.9zm4 0c-.7 0-1.3.8-2 1.9.6-.3 1.3-.4 2-.4 3 0 5.5 2.5 5.5 6 0 1.2-.2 2.3-.5 3.3.9-1 1.5-2.3 1.5-3.8 0-4-4-7-6.5-7z"/>
				</svg>
			)
		}

		// 11. Tower / Monument / Landmark (Tokyo tower, Eiffel tower, etc.)
		if (['🗼', '🗽', '🗿', 'tower', 'monument', 'landmark'].includes(val)) {
			return (
				<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
					<path d="M12 2l-1.5 5.5h3L12 2zm-1.8 7l-1 5h5.6l-1-5h-3.6zm-1.6 7l-2 6h2.5l.6-2.5h4.6l.6 2.5h2.5l-2-6H8.6z"/>
				</svg>
			)
		}

		// 12. Calendar / Booking / Dates
		if (['📅', '🗓️', '📆', 'calendar', 'date', 'booking'].includes(val)) {
			return (
				<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
					<path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM7 11h5v5H7z"/>
				</svg>
			)
		}

		// 13. Compass / Navigation / Explore
		if (['🧭', 'compass', 'navigation'].includes(val)) {
			return (
				<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
					<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm2.19 5.81l-2 6.19 6.19-2-2-6.19zM12 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>
				</svg>
			)
		}

		// Fallback emoji - rendered in pure white silhouette so all badges match the luxury green & white theme!
		return val ? (
			<span
				style={{
					fontSize: '20px',
					lineHeight: 1,
					display: 'inline-flex',
					alignItems: 'center',
					justifyContent: 'center',
					filter: 'brightness(0) invert(1)',
					opacity: 0.95
				}}
			>
				{val}
			</span>
		) : (
			<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
				<path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
			</svg>
		)
	}

	return (
		<AdminLayout title="Sliders &amp; Page Banners">
			{/* Top Tabs */}
			<div style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>
				<button
					type="button"
					onClick={() => setActiveTab('sliders')}
					style={{
						padding: '10px 20px',
						borderRadius: '10px',
						border: activeTab === 'sliders' ? 'none' : '1px solid #cbd5e1',
						background: activeTab === 'sliders' ? '#16a34a' : '#ffffff',
						color: activeTab === 'sliders' ? '#fff' : '#475569',
						fontWeight: '800',
						fontSize: '13.5px',
						cursor: 'pointer',
						display: 'inline-flex',
						alignItems: 'center',
						gap: '8px'
					}}
				>
					<IconSliders size={16} />
					<span>Home Hero Sliders ({slides.length})</span>
				</button>
				<button
					type="button"
					onClick={() => setActiveTab('banners')}
					style={{
						padding: '10px 20px',
						borderRadius: '10px',
						border: activeTab === 'banners' ? 'none' : '1px solid #cbd5e1',
						background: activeTab === 'banners' ? '#16a34a' : '#ffffff',
						color: activeTab === 'banners' ? '#fff' : '#475569',
						fontWeight: '800',
						fontSize: '13.5px',
						cursor: 'pointer',
						display: 'inline-flex',
						alignItems: 'center',
						gap: '8px'
					}}
				>
					<IconTag size={16} />
					<span>All Page Banners ({banners.length})</span>
				</button>
				<button
					type="button"
					onClick={() => setActiveTab('partners')}
					style={{
						padding: '10px 20px',
						borderRadius: '10px',
						border: activeTab === 'partners' ? 'none' : '1px solid #cbd5e1',
						background: activeTab === 'partners' ? '#16a34a' : '#ffffff',
						color: activeTab === 'partners' ? '#fff' : '#475569',
						fontWeight: '800',
						fontSize: '13.5px',
						cursor: 'pointer',
						display: 'inline-flex',
						alignItems: 'center',
						gap: '8px'
					}}
				>
					<IconGlobe size={16} />
					<span>Airlines &amp; Hotel Partners ({partners.length})</span>
				</button>
			</div>

			{loading ? (
				<div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>Loading sliders and banners...</div>
			) : activeTab === 'sliders' ? (
				/* SLIDERS TAB */
				<div>
					<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
						<p style={{ margin: 0, fontSize: '13.5px', color: '#64748b' }}>
							Manage the 3 main animated hero destination slides shown on the home page header.
						</p>
						<button
							onClick={() => setEditingSlide({
								slideKey: `slide_${Date.now()}`,
								tab: '',
								eyebrowBadge: '',
								featuredLabel: '',
								titleLine1: '',
								titleHighlight: '',
								titleLine2: '',
								text: '',
								passTag: '',
								passTitle: '',
								inquiry: '',
								arches: [
									{ src: '', label: '' },
									{ src: '', label: '' },
									{ src: '', label: '' }
								],
								order: slides.length + 1
							})}
							style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
						>
							<IconPlus size={15} />
							<span>Add Hero Slide</span>
						</button>
					</div>

					<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
						{slides.map(slide => (
							<div key={slide.id} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '22px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
								<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
									<div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
										<span style={{ background: '#ecfdf5', color: '#16a34a', border: '1px solid #bbf7d0', padding: '3px 10px', borderRadius: '12px', fontSize: '11.5px', fontWeight: '800', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
											<IconTag size={12} color="#16a34a" />
											<span>Tab: {slide.tab}</span>
										</span>
										<span style={{ background: '#fffaf0', color: '#b45309', border: '1px solid #fef08a', padding: '3px 8px', borderRadius: '12px', fontSize: '10.5px', fontWeight: '700' }}>
											{slide.eyebrowBadge || 'Bespoke Luxury Holidays'}
										</span>
										{slide.showInCtaBanner ? (
											<span style={{ background: '#fefce8', color: '#854d0e', border: '1px solid #fde047', padding: '3px 9px', borderRadius: '12px', fontSize: '10.5px', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
												⭐ Experience The World Banner
											</span>
										) : null}
									</div>
									<span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600' }}>Order #{slide.order}</span>
								</div>

								<h3 style={{ fontSize: '17px', fontWeight: '800', color: '#0f172a', margin: '0 0 6px' }}>
									{slide.titleLine1} <span style={{ color: '#d97706' }}>{slide.titleHighlight}</span> {slide.titleLine2}
								</h3>
								<p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5, margin: '0 0 14px' }}>
									{slide.text}
								</p>

								{/* Arches preview images */}
								{slide.arches && Array.isArray(slide.arches) && slide.arches.length > 0 && (
									<div style={{ display: 'flex', gap: '10px', marginBottom: '14px', overflowX: 'auto', paddingBottom: '6px' }}>
										{slide.arches.map((arch, idx) => (
											<div key={idx} style={{ position: 'relative', width: '82px', height: '72px', borderRadius: '10px', overflow: 'hidden', border: '1.5px solid #cbd5e1', flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', background: '#f1f5f9' }}>
												<img
													src={arch.src}
													alt={arch.label}
													style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
													onError={e => { e.target.src = '/assets/images/tour/tour-details.jpg' }}
												/>
												<span style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(15,23,42,0.75)', color: '#fff', fontSize: '9.5px', fontWeight: '700', padding: '2px 4px', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
													{arch.label}
												</span>
											</div>
										))}
									</div>
								)}

								<div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '10px', marginBottom: '16px', border: '1px solid #e2e8f0', fontSize: '12px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '4px' }}>
									<div><strong>Tag on Image:</strong> <span style={{ color: '#d97706' }}>{slide.featuredLabel || 'Featured destination'}</span></div>
									<div><strong>Boarding Pass:</strong> {slide.passTitle} ({slide.passTag})</div>
									<div><strong>Enquiry Prefill:</strong> <span style={{ color: '#16a34a', fontWeight: '700' }}>{slide.inquiry}</span></div>
								</div>

								<div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', alignItems: 'center', flexWrap: 'wrap' }}>
									<button
										type="button"
										onClick={() => handleToggleCtaBanner(slide)}
										title="Show this slide's destination photos in 'Experience The World With Golden Travels' home banner"
										style={{
											background: slide.showInCtaBanner ? '#fefce8' : '#ffffff',
											border: slide.showInCtaBanner ? '1.5px solid #eab308' : '1px solid #cbd5e1',
											color: slide.showInCtaBanner ? '#a16207' : '#475569',
											padding: '7px 12px',
											borderRadius: '8px',
											fontWeight: '700',
											fontSize: '11.5px',
											cursor: 'pointer',
											display: 'inline-flex',
											alignItems: 'center',
											gap: '5px',
											transition: 'all 0.2s',
											boxShadow: slide.showInCtaBanner ? '0 2px 6px rgba(234,179,8,0.25)' : 'none'
										}}
									>
										{slide.showInCtaBanner ? (
											<>
												<IconStar size={13} filled color="#eab308" />
												<span>Showing in "Experience The World"</span>
											</>
										) : (
											<>
												<IconImage size={13} />
												<span>Show in "Experience The World"</span>
											</>
										)}
									</button>

									<button
										onClick={() => setEditingSlide({ ...slide })}
										style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '7px 14px', borderRadius: '8px', fontWeight: '700', fontSize: '12px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
									>
										<IconEdit size={13} color="#ffffff" />
										<span>Edit Slide</span>
									</button>
									<button
										onClick={() => handleDeleteSlide(slide.id, slide.title)}
										style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '7px 12px', borderRadius: '8px', fontWeight: '700', fontSize: '12px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
									>
										<IconTrash size={13} color="#dc2626" />
									</button>
								</div>
							</div>
						))}
					</div>
				</div>
			) : activeTab === 'banners' ? (
				/* BANNERS TAB */
				<div>
					<p style={{ margin: '0 0 20px', fontSize: '13.5px', color: '#64748b' }}>
						Manage page header banners (title, subtitle, background image) across all subpages.
					</p>

					<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
						{banners.filter(b => ['tours', 'blog', 'contact'].includes(b.pageKey)).map(b => (
							<div key={b.id} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '20px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column' }}>
								<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
									<span style={{ background: '#fefce8', color: '#b45309', border: '1px solid #fef08a', padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}>
										{b.pageName}
									</span>
									<span style={{ fontSize: '11px', color: '#94a3b8' }}>Key: {b.pageKey}</span>
								</div>

								{/* Banner Image Preview */}
								<div style={{ position: 'relative', height: '120px', borderRadius: '12px', overflow: 'hidden', marginBottom: '14px', border: '1px solid #e2e8f0', background: '#f1f5f9' }}>
									<img
										src={b.bgImage || '/assets/images/page/breakcrumb.jpg'}
										alt={b.title}
										style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
										onError={e => { e.target.src = '/assets/images/page/breakcrumb.jpg' }}
									/>
									<div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,23,42,0.7) 0%, rgba(15,23,42,0.1) 60%)' }} />
									<div style={{ position: 'absolute', bottom: '8px', left: '10px', right: '10px', color: '#fff', fontSize: '11px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '4px' }}>
										<IconImage size={12} /> <span style={{ opacity: 0.9 }}>{b.bgImage}</span>
									</div>
								</div>

								<h4 style={{ fontSize: '17px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px' }}>
									{b.title}
								</h4>
								<p style={{ fontSize: '12.5px', color: '#64748b', margin: '0 0 16px', flex: 1 }}>
									{b.subtitle || 'Standard Page Banner'}
								</p>

								<button
									onClick={() => setEditingBanner({ ...b })}
									style={{ width: '100%', background: '#16a34a', color: '#fff', border: 'none', padding: '9px', borderRadius: '8px', fontWeight: '700', fontSize: '12.5px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
								>
									<IconEdit size={13} color="#ffffff" />
									<span>Edit Page Banner</span>
								</button>
							</div>
						))}
					</div>
				</div>
			) : (
				/* PARTNERS TAB */
				<div>
					<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
						<p style={{ margin: 0, fontSize: '13.5px', color: '#64748b' }}>
							Manage the continuous scrolling Airline &amp; Luxury Hotel partner badges displayed on the home page.
						</p>
						<button
							onClick={() => setEditingPartner({
								name: '',
								tagline: '',
								iconType: 'plane',
								isActive: true
							})}
							style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
						>
							<IconPlus size={15} />
							<span>Add Partner Badge</span>
						</button>
					</div>

					<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
						{partners.map(partner => (
							<div key={partner.id} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '18px', boxShadow: '0 4px 14px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
								<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
									<div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
										<div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#0f4c28', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 10px rgba(15,76,40,0.25)' }}>
											{renderPartnerIcon(partner)}
										</div>
										<div>
											<div style={{ fontWeight: '800', fontSize: '15px', color: '#0f172a' }}>
												{partner.name}
											</div>
											<div style={{ fontSize: '11px', fontWeight: '700', color: '#b45309', letterSpacing: '0.04em' }}>
												{partner.tagline || 'PARTNER'}
											</div>
										</div>
									</div>

									<button
										onClick={() => handleTogglePartnerActive(partner)}
										title="Click to toggle active status"
										style={{
											background: partner.isActive ? '#ecfdf5' : '#f1f5f9',
											color: partner.isActive ? '#16a34a' : '#64748b',
											border: partner.isActive ? '1px solid #bbf7d0' : '1px solid #cbd5e1',
											padding: '3px 9px',
											borderRadius: '12px',
											fontSize: '11px',
											fontWeight: '800',
											cursor: 'pointer'
										}}
									>
										{partner.isActive ? 'Active' : 'Hidden'}
									</button>
								</div>

								<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
									<div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748b' }}>
										<span>Badge Emoji:</span>
										<strong style={{ fontSize: '15px' }}>{renderPartnerIcon(partner)}</strong>
									</div>
									<div style={{ display: 'flex', gap: '8px' }}>
										<button
											onClick={() => setEditingPartner({ ...partner, iconType: getDisplayEmoji(partner.iconType) })}
											style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#334155', padding: '6px 10px', borderRadius: '8px', fontWeight: '700', fontSize: '12px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
										>
											<IconEdit size={13} color="#334155" />
											<span>Edit</span>
										</button>
										<button
											onClick={() => handleDeletePartner(partner.id, partner.name)}
											style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '6px 10px', borderRadius: '8px', fontWeight: '700', fontSize: '12px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
										>
											<IconTrash size={13} color="#dc2626" />
										</button>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{/* EDIT SLIDE MODAL */}
			{editingSlide && (
				<div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
					<div style={{ background: '#ffffff', borderRadius: '20px', maxWidth: '640px', width: '100%', padding: '28px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 50px rgba(0,0,0,0.15)' }}>
						<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
							<h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
								{editingSlide.id ? `Edit Hero Slide (${editingSlide.tab})` : 'Create New Hero Slide'}
							</h3>
							<button onClick={() => setEditingSlide(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
								<IconClose size={20} />
							</button>
						</div>

						<form onSubmit={handleSaveSlide} autoComplete="off" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
							<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
								<div>
									<label style={labelStyle}>Name *</label>
									<input type="text" required autoComplete="off" value={editingSlide.tab} onChange={e => setEditingSlide({ ...editingSlide, tab: e.target.value })} style={inputStyle} placeholder="e.g. Europe" />
								</div>
								<div>
									<label style={labelStyle}>Display Order</label>
									<input type="number" autoComplete="off" value={editingSlide.order} onChange={e => setEditingSlide({ ...editingSlide, order: parseInt(e.target.value) || 0 })} style={inputStyle} placeholder="1" />
								</div>
							</div>

							<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
								<div>
									<label style={labelStyle}>Badge</label>
									<input
										type="text"
										autoComplete="off"
										value={editingSlide.eyebrowBadge ?? ''}
										onChange={e => setEditingSlide({ ...editingSlide, eyebrowBadge: e.target.value })}
										style={inputStyle}
										placeholder="e.g. Bespoke Luxury Holidays"
									/>
								</div>
								<div>
									<label style={labelStyle}>Featured Tag on Image</label>
									<input
										type="text"
										autoComplete="off"
										value={editingSlide.featuredLabel ?? ''}
										onChange={e => setEditingSlide({ ...editingSlide, featuredLabel: e.target.value })}
										style={inputStyle}
										placeholder="e.g. Featured destination"
									/>
								</div>
							</div>

							<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
								<div>
									<label style={labelStyle}>Title Line 1</label>
									<input type="text" autoComplete="off" value={editingSlide.titleLine1} onChange={e => setEditingSlide({ ...editingSlide, titleLine1: e.target.value })} style={inputStyle} placeholder="e.g. Your next story" />
								</div>
								<div>
									<label style={labelStyle}>Highlighted Word</label>
									<input type="text" autoComplete="off" value={editingSlide.titleHighlight} onChange={e => setEditingSlide({ ...editingSlide, titleHighlight: e.target.value })} style={inputStyle} placeholder="e.g. Golden" />
								</div>
								<div>
									<label style={labelStyle}>Title Line 2</label>
									<input type="text" autoComplete="off" value={editingSlide.titleLine2} onChange={e => setEditingSlide({ ...editingSlide, titleLine2: e.target.value })} style={inputStyle} placeholder="e.g. journey" />
								</div>
							</div>

							<div>
								<label style={labelStyle}>Description Text</label>
								<textarea rows="3" autoComplete="off" value={editingSlide.text} onChange={e => setEditingSlide({ ...editingSlide, text: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} placeholder="e.g. Switzerland to Italy with hotels, transfers and a trip manager on call. Easy for families..." />
							</div>

							<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
								<div>
									<label style={labelStyle}>Boarding Pass Category / Badge</label>
									<input
										type="text"
										autoComplete="off"
										name="slide_pass_category"
										value={editingSlide.passTag}
										onChange={e => setEditingSlide({ ...editingSlide, passTag: e.target.value })}
										style={inputStyle}
										placeholder="e.g. Bestseller · Boarding Pass"
									/>
								</div>
								<div>
									<label style={labelStyle}>Boarding Pass Title</label>
									<input
										type="text"
										autoComplete="off"
										name="slide_pass_title"
										value={editingSlide.passTitle}
										onChange={e => setEditingSlide({ ...editingSlide, passTitle: e.target.value })}
										style={inputStyle}
										placeholder="e.g. Alpine & European Grandeur"
									/>
								</div>
							</div>

							<div>
								<label style={labelStyle}>Enquiry Package Name</label>
								<input
									type="text"
									autoComplete="off"
									name="slide_inquiry_package"
									value={editingSlide.inquiry}
									onChange={e => setEditingSlide({ ...editingSlide, inquiry: e.target.value })}
									style={inputStyle}
									placeholder="e.g. Europe Holiday"
								/>
							</div>

							<div>
								<label style={labelStyle}>Showcase Photos &amp; Location Labels</label>
								<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
									{[0, 1, 2].map(idx => {
										const item = editingSlide.arches?.[idx] || { src: '', label: '' }
										const photoTitles = [
											'Photo #1 (Main Arch + Pin Location Text) *',
											'Photo #2 (Top Mini Arch)',
											'Photo #3 (Bottom Mini Arch)'
										]
										const placeholders = [
											'e.g. Switzerland',
											'e.g. Italy',
											'e.g. France'
										]
										const archResolutions = [
											'600 × 800 px · 3:4 Portrait',
											'400 × 520 px · 3:4 Portrait',
											'500 × 320 px · 16:10 Landscape'
										]
										return (
											<div key={idx} style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
												<span style={{ fontSize: '11.5px', fontWeight: '800', color: idx === 0 ? '#16a34a' : '#475569' }}>
													{photoTitles[idx]}
												</span>
												<ImageUploader
													label=""
													value={item.src}
													resolution={archResolutions[idx]}
													required={idx === 0}
													onChange={url => {
														const nextArches = [...(editingSlide.arches || [])]
														nextArches[idx] = { ...item, src: url }
														setEditingSlide({ ...editingSlide, arches: nextArches })
													}}
													placeholder="Drag image here or enter URL"
												/>
												<div>
													<label style={{ display: 'block', fontSize: '10.5px', fontWeight: '700', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase' }}>
														{idx === 0 ? 'Location Name (Shown next to Pin Icon) *' : 'Location Label'}
													</label>
													<input
														type="text"
														autoComplete="off"
														placeholder={placeholders[idx]}
														value={item.label}
														onChange={e => {
															const nextArches = [...(editingSlide.arches || [])]
															nextArches[idx] = { ...item, label: e.target.value }
															setEditingSlide({ ...editingSlide, arches: nextArches })
														}}
														style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px' }}
													/>
												</div>
											</div>
										)
									})}
								</div>
							</div>

							<div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
								<button type="button" onClick={() => setEditingSlide(null)} style={{ padding: '8px 16px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: '700', color: '#475569', cursor: 'pointer' }}>Cancel</button>
								<button type="submit" disabled={saving} style={{ padding: '8px 20px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '800', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
									<IconSave size={15} />
									<span>{saving ? 'Saving...' : 'Save Slide'}</span>
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{/* EDIT BANNER MODAL */}
			{editingBanner && (
				<div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
					<div style={{ background: '#ffffff', borderRadius: '20px', maxWidth: '520px', width: '100%', padding: '28px', boxShadow: '0 20px 50px rgba(0,0,0,0.15)' }}>
						<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
							<h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
								Edit Banner: {editingBanner.pageName}
							</h3>
							<button onClick={() => setEditingBanner(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
								<IconClose size={20} />
							</button>
						</div>

						<form onSubmit={handleSaveBanner} autoComplete="off" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
							<div>
								<label style={labelStyle}>Banner Title *</label>
								<input type="text" required autoComplete="off" value={editingBanner.title} onChange={e => setEditingBanner({ ...editingBanner, title: e.target.value })} style={inputStyle} />
							</div>

							<div>
								<label style={labelStyle}>Banner Subtitle</label>
								<input type="text" autoComplete="off" value={editingBanner.subtitle || ''} onChange={e => setEditingBanner({ ...editingBanner, subtitle: e.target.value })} style={inputStyle} placeholder="e.g. Handcrafted holiday packages tailored for your style" />
							</div>

							<div>
								<ImageUploader
									label="Background Image (Drag & Drop or Browse)"
									resolution="1920 × 500 px · Ultrawide Header"
									required={true}
									value={editingBanner.bgImage}
									onChange={url => setEditingBanner({ ...editingBanner, bgImage: url })}
									placeholder="/assets/images/page/breakcrumb.jpg"
								/>
							</div>

							<div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
								<button type="button" onClick={() => setEditingBanner(null)} style={{ padding: '8px 16px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: '700', color: '#475569', cursor: 'pointer' }}>Cancel</button>
								<button type="submit" disabled={saving} style={{ padding: '8px 20px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '800', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
									<IconSave size={15} />
									<span>{saving ? 'Saving...' : 'Save Banner'}</span>
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{/* EDIT PARTNER MODAL */}
			{editingPartner && (
				<div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', overflowY: 'auto', boxSizing: 'border-box' }}>
					<div style={{ background: '#ffffff', borderRadius: '20px', maxWidth: '480px', width: '100%', padding: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.15)', maxHeight: '90vh', overflowY: 'auto', margin: 'auto', boxSizing: 'border-box' }}>
						<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
							<h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
								{editingPartner.id ? `Edit Partner: ${editingPartner.name}` : 'Add New Partner Badge'}
							</h3>
							<button
								type="button"
								onClick={() => setEditingPartner(null)}
								style={{
									background: '#f1f5f9',
									border: 'none',
									width: '32px',
									minWidth: '32px',
									height: '32px',
									borderRadius: '50%',
									color: '#64748b',
									cursor: 'pointer',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									padding: 0
								}}
							>
								<IconClose size={16} />
							</button>
						</div>

						<form onSubmit={handleSavePartner} autoComplete="off" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
							<div>
								<label style={labelStyle}>Partner / Brand Name *</label>
								<input
									type="text"
									required
									autoComplete="off"
									value={editingPartner.name}
									onChange={e => setEditingPartner({ ...editingPartner, name: e.target.value })}
									style={inputStyle}
									placeholder="e.g. Qatar Airways or Marriott Bonvoy"
								/>
							</div>

							<div>
								<label style={labelStyle}>Tagline / Sub-label</label>
								<input
									type="text"
									autoComplete="off"
									value={editingPartner.tagline || ''}
									onChange={e => setEditingPartner({ ...editingPartner, tagline: e.target.value })}
									style={inputStyle}
									placeholder="e.g. WORLD'S BEST AIRLINE or LUXURY RESORTS"
								/>
							</div>

							<div>
								<label style={labelStyle}>Badge Emoji / Icon *</label>
								<div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
									<div
										title="Live Icon Preview (As shown in UI)"
										style={{
											width: '42px',
											height: '42px',
											borderRadius: '10px',
											background: '#0f4c28',
											color: '#ffffff',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											flexShrink: 0,
											boxShadow: '0 4px 10px rgba(15,76,40,0.25)'
										}}
									>
										{renderPartnerIcon(editingPartner)}
									</div>
									<div style={{ flex: 1, minWidth: 0 }}>
										<EmojiKeyboardPicker
											value={editingPartner.iconType || 'plane'}
											onChange={(char) => setEditingPartner({ ...editingPartner, iconType: char })}
										/>
									</div>
								</div>
							</div>

							<div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
								<input
									type="checkbox"
									id="partnerActiveCheck"
									checked={editingPartner.isActive !== false}
									onChange={e => setEditingPartner({ ...editingPartner, isActive: e.target.checked })}
									style={{ width: '18px', height: '18px', accentColor: '#16a34a', cursor: 'pointer' }}
								/>
								<label htmlFor="partnerActiveCheck" style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', cursor: 'pointer' }}>
									Active &amp; Visible in Continuous Scrolling Ticker
								</label>
							</div>

							<div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
								<button type="button" onClick={() => setEditingPartner(null)} style={{ padding: '8px 16px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: '700', color: '#475569', cursor: 'pointer' }}>Cancel</button>
								<button type="submit" disabled={saving} style={{ padding: '8px 20px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '800', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
									<IconSave size={15} />
									<span>{saving ? 'Saving...' : 'Save Partner'}</span>
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</AdminLayout>
	)
}

const labelStyle = {
	display: 'block',
	fontSize: '11.5px',
	fontWeight: '700',
	color: '#475569',
	marginBottom: '6px',
	textTransform: 'uppercase'
}

const inputStyle = {
	width: '100%',
	padding: '10px 14px',
	background: '#ffffff',
	border: '1px solid #cbd5e1',
	borderRadius: '10px',
	color: '#0f172a',
	fontSize: '13px',
	outline: 'none'
}
