import React, { useState, useEffect } from 'react'
import AdminLayout from './AdminLayout'
import { fetchPageMetaList, updatePageMeta } from '../services/api'
import { useToast } from '../context/ToastContext'
import ImageUploader from '@/components/ImageUploader'
import { getSiteBaseUrl, resolvePageCanonicalUrl } from '@/utils/siteUrl'
import { IconGlobe, IconSave } from '@/components/Icons'

const ALLOWED_PAGES = [
	{ key: 'home', label: 'Home Page', defaultRoute: '/' },
	{ key: 'tours', label: 'Tour Package Page', defaultRoute: '/tour' },
	{ key: 'blog', label: 'Blogs', defaultRoute: '/blog' },
	{ key: 'contact', label: 'Contact Page', defaultRoute: '/contact-us' }
]

export default function AdminSEO() {
	const { showToast } = useToast()
	const [pages, setPages] = useState([])
	const [selectedKey, setSelectedKey] = useState('home')
	const [loading, setLoading] = useState(true)
	const [saving, setSaving] = useState(false)
	const [formData, setFormData] = useState({
		metaTitle: '',
		metaDescription: '',
		metaKeywords: '',
		ogImage: '',
		canonicalUrl: ''
	})

	const loadData = async () => {
		try {
			setLoading(true)
			const res = await fetchPageMetaList()
			if (res && res.success && Array.isArray(res.data)) {
				// Filter to only the 4 allowed pages
				const allowedKeys = ALLOWED_PAGES.map(p => p.key)
				const filtered = res.data.filter(p => allowedKeys.includes(p.pageKey))
				setPages(filtered)

				const initial = filtered.find(p => p.pageKey === selectedKey) || filtered[0]
				if (initial) {
					setSelectedKey(initial.pageKey)
					const defaultRoute = ALLOWED_PAGES.find(p => p.key === initial.pageKey)?.defaultRoute || initial.route || '/'
					const defaultCan = resolvePageCanonicalUrl(initial.canonicalUrl, defaultRoute)
					setFormData({
						metaTitle: initial.metaTitle || '',
						metaDescription: initial.metaDescription || '',
						metaKeywords: initial.metaKeywords || '',
						ogImage: initial.ogImage || '',
						canonicalUrl: defaultCan
					})
				}
			}
		} catch (err) {
			showToast('Failed to load SEO page metadata', 'error')
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		loadData()
	}, [])

	const handleSelectPage = (pageKey) => {
		setSelectedKey(pageKey)
		const target = pages.find(p => p.pageKey === pageKey)
		if (target) {
			const defaultRoute = ALLOWED_PAGES.find(p => p.key === target.pageKey)?.defaultRoute || target.route || '/'
			const defaultCan = resolvePageCanonicalUrl(target.canonicalUrl, defaultRoute)
			setFormData({
				metaTitle: target.metaTitle || '',
				metaDescription: target.metaDescription || '',
				metaKeywords: target.metaKeywords || '',
				ogImage: target.ogImage || '',
				canonicalUrl: defaultCan
			})
		}
	}

	const handleChange = (e) => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))
	}

	const handleSave = async (e) => {
		e.preventDefault()
		try {
			setSaving(true)
			const res = await updatePageMeta(selectedKey, formData)
			if (res && res.success) {
				showToast(`SEO settings saved successfully for ${currentPageConfig?.label || selectedKey}!`, 'success')
				// update local state
				setPages(prev => prev.map(p => p.pageKey === selectedKey ? { ...p, ...formData } : p))
			} else {
				throw new Error(res?.message || 'Update failed')
			}
		} catch (err) {
			showToast(err.message || 'Error updating SEO settings', 'error')
		} finally {
			setSaving(false)
		}
	}

	const currentPageConfig = ALLOWED_PAGES.find(p => p.key === selectedKey) || ALLOWED_PAGES[0]
	const titleLength = formData.metaTitle.length
	const descLength = formData.metaDescription.length

	return (
		<AdminLayout title="SEO & Meta Tags">
			<div style={{ maxWidth: '860px', margin: '0 auto', paddingBottom: '60px' }}>
				{/* Top Bar Header */}
				<div style={{ marginBottom: '24px' }}>
					<h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
						<IconGlobe size={24} color="#16a34a" />
						<span>Search Engine Optimization (SEO)</span>
					</h1>
					<p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
						Manage Meta Title, Meta Description, Keywords, and Social Share Image for core pages.
					</p>
				</div>

				{/* 4 Page Selector Tabs */}
				<div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '24px' }}>
					{ALLOWED_PAGES.map((p) => {
						const isSelected = p.key === selectedKey
						return (
							<button
								key={p.key}
								type="button"
								onClick={() => handleSelectPage(p.key)}
								style={{
									padding: '11px 22px',
									borderRadius: '12px',
									border: isSelected ? '2px solid #16a34a' : '1px solid #e2e8f0',
									backgroundColor: isSelected ? '#ecfdf5' : '#ffffff',
									color: isSelected ? '#16a34a' : '#475569',
									fontWeight: isSelected ? '800' : '700',
									fontSize: '14.5px',
									cursor: 'pointer',
									whiteSpace: 'nowrap',
									display: 'flex',
									alignItems: 'center',
									gap: '8px',
									transition: 'all 0.2s ease',
									boxShadow: isSelected ? '0 3px 10px rgba(22, 163, 74, 0.15)' : 'none'
								}}
							>
								<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
									<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
									<polyline points="14 2 14 8 20 8" />
									<line x1="16" y1="13" x2="8" y2="13" />
									<line x1="16" y1="17" x2="8" y2="17" />
									<polyline points="10 9 9 9 8 9" />
								</svg>
								<span>{p.label}</span>
							</button>
						)
					})}
				</div>

				{loading ? (
					<div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>Loading SEO records...</div>
				) : (
					<div style={{
						backgroundColor: '#ffffff',
						borderRadius: '18px',
						border: '1px solid #e2e8f0',
						padding: '30px',
						boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
					}}>
						<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #f1f5f9', paddingBottom: '14px' }}>
							<div>
								<h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0' }}>
									{currentPageConfig.label} Meta Settings
								</h2>
								<span style={{ fontSize: '12.5px', color: '#64748b' }}>
									Website Route: <code style={{ backgroundColor: '#f1f5f9', padding: '2px 8px', borderRadius: '6px', color: '#0f172a' }}>{currentPageConfig.defaultRoute}</code>
								</span>
							</div>
						</div>

						<form onSubmit={handleSave}>
							{/* 1. Meta Title */}
							<div style={{ marginBottom: '22px' }}>
								<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
									<label style={{ fontSize: '13.5px', fontWeight: '700', color: '#334155' }}>
										Meta Title <span style={{ color: '#dc2626' }}>*</span>
									</label>
									<span style={{
										fontSize: '12px',
										fontWeight: '700',
										color: titleLength >= 50 && titleLength <= 60 ? '#16a34a' : titleLength > 60 ? '#d97706' : '#64748b'
									}}>
										{titleLength}/60 chars {titleLength >= 50 && titleLength <= 60 ? '(Ideal)' : ''}
									</span>
								</div>
								<input
									type="text"
									name="metaTitle"
									value={formData.metaTitle}
									onChange={handleChange}
									required
									placeholder="e.g. Golden Travels | Luxury Tours, Honeymoons & Custom Holidays"
									style={{
										width: '100%',
										padding: '12px 14px',
										borderRadius: '10px',
										border: '1.5px solid #cbd5e1',
										fontSize: '14.5px',
										outline: 'none',
										fontFamily: 'inherit'
									}}
								/>
								<p style={{ margin: '6px 0 0', fontSize: '12px', color: '#64748b' }}>
									The main headline that appears in Google search results and browser tab.
								</p>
							</div>

							{/* 2. Meta Description */}
							<div style={{ marginBottom: '22px' }}>
								<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
									<label style={{ fontSize: '13.5px', fontWeight: '700', color: '#334155' }}>
										Meta Description <span style={{ color: '#dc2626' }}>*</span>
									</label>
									<span style={{
										fontSize: '12px',
										fontWeight: '700',
										color: descLength >= 140 && descLength <= 160 ? '#16a34a' : descLength > 160 ? '#d97706' : '#64748b'
									}}>
										{descLength}/160 chars {descLength >= 140 && descLength <= 160 ? '(Ideal)' : ''}
									</span>
								</div>
								<textarea
									name="metaDescription"
									rows={3}
									value={formData.metaDescription}
									onChange={handleChange}
									required
									placeholder="e.g. Discover handcrafted international and domestic tour packages with Golden Travels. 25+ years experience, luxury stays, visa assistance, and 24/7 support."
									style={{
										width: '100%',
										padding: '12px 14px',
										borderRadius: '10px',
										border: '1.5px solid #cbd5e1',
										fontSize: '14px',
										outline: 'none',
										fontFamily: 'inherit',
										resize: 'vertical'
									}}
								/>
								<p style={{ margin: '6px 0 0', fontSize: '12px', color: '#64748b' }}>
									Short summary for search results. Recommended: 140–160 characters.
								</p>
							</div>

							{/* 3. Meta Keywords */}
							<div style={{ marginBottom: '22px' }}>
								<label style={{ display: 'block', fontSize: '13.5px', fontWeight: '700', color: '#334155', marginBottom: '8px' }}>
									Meta Keywords (Comma separated)
								</label>
								<input
									type="text"
									name="metaKeywords"
									value={formData.metaKeywords}
									onChange={handleChange}
									placeholder="e.g. golden travels, tour packages, honeymoon trips, holiday packages coimbatore"
									style={{
										width: '100%',
										padding: '12px 14px',
										borderRadius: '10px',
										border: '1.5px solid #cbd5e1',
										fontSize: '14px',
										outline: 'none',
										fontFamily: 'inherit'
									}}
								/>
								<p style={{ margin: '6px 0 0', fontSize: '12px', color: '#64748b' }}>
									Key phrases related to this page for crawler indexing.
								</p>
							</div>

							{/* 4. Canonical URL */}
							<div style={{ marginBottom: '22px' }}>
								<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
									<label style={{ fontSize: '13.5px', fontWeight: '700', color: '#334155', margin: 0 }}>
										Canonical Link (Canonical URL)
									</label>
									<button
										type="button"
										onClick={() => {
											const link = resolvePageCanonicalUrl('', currentPageConfig?.defaultRoute || '/')
											setFormData(prev => ({ ...prev, canonicalUrl: link }))
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
										<span>Auto-sync with Route</span>
									</button>
								</div>
								<input
									type="url"
									name="canonicalUrl"
									value={resolvePageCanonicalUrl(formData.canonicalUrl, currentPageConfig?.defaultRoute || '/')}
									onChange={handleChange}
									placeholder={`${getSiteBaseUrl()}${currentPageConfig?.defaultRoute || '/'}`}
									style={{
										width: '100%',
										padding: '12px 14px',
										borderRadius: '10px',
										border: '1.5px solid #cbd5e1',
										fontSize: '14px',
										outline: 'none',
										fontFamily: 'inherit'
									}}
								/>
								<p style={{ margin: '6px 0 0', fontSize: '12px', color: '#64748b' }}>
									Primary master link of this page recognized by Google and search engines (rel="canonical"). Automatically adapts to current environment URL.
								</p>
							</div>

							{/* 5. Social Share Image (Drag & Drop) */}
							<div style={{ marginBottom: '28px' }}>
								<ImageUploader
									label="Social Share Image (OG Image)"
									resolution="1200 × 630 px recommended"
									value={formData.ogImage}
									onChange={url => setFormData(prev => ({ ...prev, ogImage: url }))}
									placeholder="Drag and drop image here or click to browse"
								/>
								<p style={{ margin: '6px 0 0', fontSize: '12px', color: '#64748b' }}>
									Banner displayed when sharing this page link on WhatsApp, Facebook, LinkedIn, or Twitter.
								</p>
							</div>

							{/* Save Button */}
							<div>
								<button
									type="submit"
									disabled={saving}
									style={{
										padding: '12px 32px',
										backgroundColor: '#16a34a',
										color: '#ffffff',
										border: 'none',
										borderRadius: '10px',
										fontSize: '15px',
										fontWeight: '800',
										cursor: saving ? 'not-allowed' : 'pointer',
										opacity: saving ? 0.7 : 1,
										boxShadow: '0 4px 14px rgba(22, 163, 74, 0.25)',
										transition: 'all 0.2s',
										display: 'inline-flex',
										alignItems: 'center',
										gap: '8px'
									}}
								>
									<IconSave size={18} />
									<span>{saving ? 'Saving...' : 'Save Changes'}</span>
								</button>
							</div>
						</form>
					</div>
				)}
			</div>
		</AdminLayout>
	)
}
