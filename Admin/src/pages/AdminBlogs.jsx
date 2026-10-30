import React, { useEffect, useState } from 'react'
import AdminLayout from './AdminLayout'
import { fetchBlogs, createBlog, updateBlog, deleteBlog } from '@/services/api'
import { useToast } from '@/context/ToastContext'
import ImageUploader, { isVideoUrl } from '@/components/ImageUploader'
import { slugifyText, computeUniqueSlug } from './AdminPackageForm'
import { getSiteBaseUrl, buildCanonicalUrl, isStandardCanonicalUrl, resolveCanonicalUrl } from '@/utils/siteUrl'
import {
	IconPlus,
	IconEdit,
	IconTrash,
	IconSave,
	IconClose,
	IconCalendar,
	IconUser,
	IconImage,
	IconVideo,
	IconFileText,
	IconPin,
	IconSearch,
	IconBolt
} from '@/components/Icons'
import SummernoteEditor from '@/components/SummernoteEditor'

const DEFAULT_CATEGORIES = [
	'All',
	'Europe',
	'Honeymoon',
	'Asia',
	'Luxury',
	'Visa Guide'
]

export default function AdminBlogs() {
	const { showToast, confirmAction } = useToast()
	const [blogs, setBlogs] = useState([])
	const [loading, setLoading] = useState(true)
	const [activeCategory, setActiveCategory] = useState('All')
	const [editingBlog, setEditingBlog] = useState(null)
	const [mediaType, setMediaType] = useState('image') // 'image' | 'video'
	const [saving, setSaving] = useState(false)
	const [isSlugCustomized, setIsSlugCustomized] = useState(false)

	const loadBlogs = async () => {
		try {
			setLoading(true)
			const res = await fetchBlogs()
			if (res && res.success) {
				setBlogs(res.data)
			}
		} catch (err) {
			console.error(err)
			showToast('Failed to load blog posts', 'error')
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		loadBlogs()
	}, [])

	const handleOpenNew = () => {
		setMediaType('image')
		setIsSlugCustomized(false)
		setEditingBlog({
			title: '',
			slug: '',
			category: activeCategory === 'All' ? 'Europe' : activeCategory,
			date: '',
			readTime: '',
			author: '',
			image: '',
			excerpt: '',
			heading: '',
			content: '',
			sections: [
				{ heading: '', content: '' }
			],
			order: blogs.length + 1,
			isActive: true,
			metaTitle: '',
			metaDescription: '',
			metaKeywords: '',
			canonicalUrl: ''
		})
	}

	const handleOpenEdit = (blog) => {
		setMediaType(isVideoUrl(blog.image) ? 'video' : 'image')
		setIsSlugCustomized(Boolean(blog.slug))
		let initialSections = []
		if (Array.isArray(blog.sections) && blog.sections.length > 0) {
			initialSections = blog.sections.map(s => ({
				heading: s.heading || '',
				content: s.content || ''
			}))
		} else {
			initialSections = [
				{ heading: blog.heading || '', content: blog.content || '' }
			]
		}
		setEditingBlog({
			...blog,
			sections: initialSections,
			heading: blog.heading || '',
			metaTitle: blog.metaTitle || '',
			metaDescription: blog.metaDescription || '',
			metaKeywords: blog.metaKeywords || '',
			canonicalUrl: blog.canonicalUrl || (blog.slug ? buildCanonicalUrl('blog', blog.slug) : '')
		})
	}

	const handleAddSection = () => {
		setEditingBlog(prev => ({
			...prev,
			sections: [...(prev?.sections || []), { heading: '', content: '' }]
		}))
	}

	const handleRemoveSection = (index) => {
		setEditingBlog(prev => {
			const newSections = (prev?.sections || []).filter((_, i) => i !== index)
			return {
				...prev,
				sections: newSections.length > 0 ? newSections : [{ heading: '', content: '' }]
			}
		})
	}

	const handleSectionChange = (index, field, value) => {
		setEditingBlog(prev => {
			const newSections = [...(prev?.sections || [])]
			newSections[index] = {
				...newSections[index],
				[field]: value
			}
			return {
				...prev,
				sections: newSections
			}
		})
	}

	const handleBlogTitleChange = (val) => {
		if (!editingBlog) return
		let nextSlug = editingBlog.slug
		let nextCanonical = editingBlog.canonicalUrl
		if (!isSlugCustomized || !editingBlog.slug) {
			nextSlug = computeUniqueSlug(val, blogs, editingBlog.id)
			if (!nextCanonical || isStandardCanonicalUrl(nextCanonical, 'blog')) {
				nextCanonical = nextSlug ? buildCanonicalUrl('blog', nextSlug) : ''
			}
		}
		setEditingBlog({
			...editingBlog,
			title: val,
			slug: nextSlug,
			canonicalUrl: nextCanonical
		})
	}

	const handleBlogSlugChange = (val) => {
		if (!editingBlog) return
		setIsSlugCustomized(true)
		const clean = val
			.toLowerCase()
			.replace(/&/g, '-and-')
			.replace(/[\s\W-]+/g, '-')
			.replace(/^-+/, '')
		setEditingBlog({
			...editingBlog,
			slug: clean,
			canonicalUrl: (!editingBlog.canonicalUrl || isStandardCanonicalUrl(editingBlog.canonicalUrl, 'blog'))
				? (clean ? buildCanonicalUrl('blog', clean.replace(/-+$/, '')) : '')
				: editingBlog.canonicalUrl
		})
	}

	const handleBlogSlugBlur = () => {
		if (!editingBlog || !editingBlog.slug) return
		const unique = computeUniqueSlug(editingBlog.slug, blogs, editingBlog.id)
		setEditingBlog({
			...editingBlog,
			slug: unique,
			canonicalUrl: (!editingBlog.canonicalUrl || isStandardCanonicalUrl(editingBlog.canonicalUrl, 'blog'))
				? (unique ? buildCanonicalUrl('blog', unique) : '')
				: editingBlog.canonicalUrl
		})
	}

	const handleRegenerateBlogSlug = () => {
		if (!editingBlog?.title?.trim()) {
			showToast('Please enter a blog title first!', 'error')
			return
		}
		const unique = computeUniqueSlug(editingBlog.title, blogs, editingBlog.id)
		setIsSlugCustomized(false)
		setEditingBlog({
			...editingBlog,
			slug: unique,
			canonicalUrl: unique ? buildCanonicalUrl('blog', unique) : ''
		})
		showToast(`Slug & Canonical URL auto-generated: ${unique}`, 'success')
	}

	const handleSwitchMediaType = (type) => {
		if (type === mediaType) return
		setMediaType(type)
		// Clear previous media if switching between image and video so only one is active
		if (editingBlog) {
			const currentIsVid = isVideoUrl(editingBlog.image)
			if ((type === 'video' && !currentIsVid) || (type === 'image' && currentIsVid)) {
				setEditingBlog({ ...editingBlog, image: '' })
			}
		}
	}

	const handleSaveBlog = async (e) => {
		e.preventDefault()
		if (!editingBlog.title || !editingBlog.excerpt || !editingBlog.image) {
			showToast('Please fill in Title, Media (Image or Video), and Summary', 'error')
			return
		}
		setSaving(true)
		try {
			const generatedSlug = (editingBlog.slug || computeUniqueSlug(editingBlog.title, blogs, editingBlog.id)).trim()
			
			const cleanedSections = (editingBlog.sections || []).map(s => ({
				heading: (s.heading || '').trim(),
				content: (s.content || '').trim()
			})).filter(s => s.heading || s.content)

			const finalSections = cleanedSections.length > 0
				? cleanedSections
				: [{ heading: (editingBlog.heading || '').trim(), content: (editingBlog.content || '').trim() }]

			const primaryHeading = finalSections[0]?.heading || ''
			const combinedContent = finalSections.map(s => {
				if (s.heading && s.content) return `### ${s.heading}\n\n${s.content}`
				return s.content || s.heading
			}).join('\n\n')

			const payload = {
				...editingBlog,
				slug: generatedSlug,
				canonicalUrl: editingBlog.canonicalUrl || (generatedSlug ? `https://goldentravels.in/blog/${generatedSlug}` : ''),
				sections: finalSections,
				heading: primaryHeading,
				content: combinedContent
			}

			if (editingBlog.id) {
				const res = await updateBlog(editingBlog.id, payload)
				if (res.success) {
					setBlogs(blogs.map(b => b.id === editingBlog.id ? res.data : b))
					showToast('Blog post updated successfully!', 'success')
					setEditingBlog(null)
				} else {
					showToast(res.message || 'Update failed', 'error')
				}
			} else {
				const res = await createBlog(payload)
				if (res.success) {
					setBlogs([...blogs, res.data])
					showToast('New blog post published!', 'success')
					setEditingBlog(null)
				} else {
					showToast(res.message || 'Creation failed', 'error')
				}
			}
		} catch (err) {
			showToast('Error saving blog: ' + err.message, 'error')
		} finally {
			setSaving(false)
		}
	}

	const handleDeleteBlog = (id, title) => {
		confirmAction({
			title: 'Delete Blog Post?',
			message: `Are you sure you want to delete "${title}"? This action cannot be undone.`,
			confirmText: 'Yes, Delete',
			onConfirm: async () => {
				try {
					const res = await deleteBlog(id)
					if (res.success) {
						setBlogs(blogs.filter(b => b.id !== id))
						showToast('Blog post deleted successfully', 'success')
					}
				} catch (err) {
					showToast('Delete failed: ' + err.message, 'error')
				}
			}
		})
	}

	// Build dynamic category tabs from existing blogs + default categories
	const categoryList = Array.from(
		new Set([...DEFAULT_CATEGORIES, ...blogs.map(b => b.category).filter(Boolean)])
	)

	const filteredBlogs = activeCategory === 'All'
		? blogs
		: blogs.filter(b => b.category === activeCategory)

	return (
		<AdminLayout title="Blogs & Travel Stories">
			<div style={{ maxWidth: '1250px' }}>
				{/* Top Summary & Action Bar */}
				<div style={{
					background: '#ffffff',
					borderRadius: '18px',
					border: '1px solid #e2e8f0',
					padding: '20px 24px',
					marginBottom: '22px',
					boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					flexWrap: 'wrap',
					gap: '16px'
				}}>
					<div>
						<div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
							<span style={{
								fontSize: '11px',
								fontWeight: '800',
								background: '#ecfdf5',
								color: '#15803d',
								border: '1px solid #bbf7d0',
								padding: '4px 10px',
								borderRadius: '6px',
								textTransform: 'uppercase'
							}}>
								Golden Travels Journal
							</span>
							<h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: '#0f172a' }}>
								Blog Articles &amp; Guides ({blogs.length})
							</h3>
						</div>
						<p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
							Manage blog articles, cover photos or videos, excerpts, and full story content shown on the website.
						</p>
					</div>

					<button
						onClick={handleOpenNew}
						style={{
							padding: '10px 20px',
							background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
							color: '#ffffff',
							border: 'none',
							borderRadius: '11px',
							fontWeight: '800',
							fontSize: '13.5px',
							cursor: 'pointer',
							display: 'inline-flex',
							alignItems: 'center',
							gap: '8px',
							boxShadow: '0 6px 18px rgba(22,163,74,0.22)'
						}}
					>
						<IconPlus size={16} />
						<span>Add Blog Post</span>
					</button>
				</div>

				{/* Category Filter Pills */}
				<div style={{ display: 'flex', gap: '8px', marginBottom: '22px', flexWrap: 'wrap' }}>
					{categoryList.map(cat => {
						const count = cat === 'All' ? blogs.length : blogs.filter(b => b.category === cat).length
						const isActive = activeCategory === cat
						return (
							<button
								key={cat}
								onClick={() => setActiveCategory(cat)}
								style={{
									padding: '8px 16px',
									borderRadius: '999px',
									border: isActive ? '1px solid #16a34a' : '1px solid #e2e8f0',
									background: isActive ? '#16a34a' : '#ffffff',
									color: isActive ? '#ffffff' : '#475569',
									fontWeight: '700',
									fontSize: '12.5px',
									cursor: 'pointer',
									transition: 'all 0.2s ease'
								}}
							>
								{cat} ({count})
							</button>
						)
					})}
				</div>

				{/* Blog Cards Grid */}
				{loading ? (
					<div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
						Loading blog articles...
					</div>
				) : (
					<div style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
						gap: '22px'
					}}>
						{filteredBlogs.map((blog) => {
							const isVid = isVideoUrl(blog.image)
							return (
								<div
									key={blog.id}
									style={{
										background: '#ffffff',
										borderRadius: '18px',
										border: '1px solid #e2e8f0',
										overflow: 'hidden',
										boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
										display: 'flex',
										flexDirection: 'column'
									}}
								>
									{/* Cover Media (Image or Video) */}
									<div style={{ position: 'relative', height: '200px', background: '#0f172a', overflow: 'hidden' }}>
										{isVid ? (
											<video
												src={blog.image}
												muted
												loop
												autoPlay
												playsInline
												style={{ width: '100%', height: '100%', objectFit: 'cover' }}
											/>
										) : (
											<img
												src={blog.image}
												alt={blog.title}
												style={{ width: '100%', height: '100%', objectFit: 'cover' }}
												onError={(e) => { e.target.src = '/assets/images/slide/slide3.jpg' }}
											/>
										)}
										<div style={{
											position: 'absolute',
											top: '12px',
											left: '12px',
											background: 'rgba(15, 23, 42, 0.85)',
											color: '#eab308',
											padding: '5px 12px',
											borderRadius: '999px',
											fontSize: '11px',
											fontWeight: '800',
											textTransform: 'uppercase',
											letterSpacing: '0.5px'
										}}>
											{blog.category} {isVid ? '· Video' : ''}
										</div>
										{blog.readTime && (
											<div style={{
												position: 'absolute',
												bottom: '10px',
												right: '12px',
												background: 'rgba(255,255,255,0.92)',
												color: '#0f172a',
												padding: '4px 10px',
												borderRadius: '8px',
												fontSize: '11px',
												fontWeight: '700'
											}}>
												{blog.readTime}
											</div>
										)}
									</div>

									{/* Card Body */}
									<div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
										<div style={{
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'space-between',
											fontSize: '12px',
											color: '#64748b',
											fontWeight: '600',
											marginBottom: '10px'
										}}>
											<span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
												<IconCalendar size={13} color="#16a34a" />
												{blog.date || '—'}
											</span>
											<span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
												<IconUser size={13} color="#64748b" />
												{blog.author || 'Golden Travels'}
											</span>
										</div>

										<h4 style={{
											margin: '0 0 10px 0',
											fontSize: '16px',
											fontWeight: '800',
											color: '#0f172a',
											lineHeight: '1.4'
										}}>
											{blog.title}
										</h4>

										<p style={{
											margin: '0 0 16px 0',
											fontSize: '13px',
											color: '#475569',
											lineHeight: '1.6',
											flex: 1,
											display: '-webkit-box',
											WebkitLineClamp: 3,
											WebkitBoxOrient: 'vertical',
											overflow: 'hidden'
										}}>
											{blog.excerpt}
										</p>

										{/* Actions Footer */}
										<div style={{
											borderTop: '1px solid #f1f5f9',
											paddingTop: '14px',
											display: 'flex',
											justifyContent: 'space-between',
											alignItems: 'center',
											gap: '10px'
										}}>
											<span style={{ fontSize: '11.5px', color: '#94a3b8', fontWeight: '600' }}>
												{blog.content ? `${blog.content.split(/\n\s*\n/).length} paragraphs` : 'Summary only'}
											</span>
											<div style={{ display: 'flex', gap: '8px' }}>
												<button
													onClick={() => handleOpenEdit(blog)}
													style={{
														padding: '7px 14px',
														background: '#f8fafc',
														border: '1px solid #cbd5e1',
														borderRadius: '8px',
														fontSize: '12.5px',
														fontWeight: '700',
														color: '#0f172a',
														cursor: 'pointer',
														display: 'inline-flex',
														alignItems: 'center',
														gap: '6px'
													}}
												>
													<IconEdit size={13} color="#2563eb" />
													<span>Edit</span>
												</button>
												<button
													onClick={() => handleDeleteBlog(blog.id, blog.title)}
													style={{
														padding: '7px 10px',
														background: '#fef2f2',
														border: '1px solid #fecaca',
														borderRadius: '8px',
														cursor: 'pointer',
														display: 'inline-flex',
														alignItems: 'center'
													}}
													title="Delete Blog"
												>
													<IconTrash size={14} color="#dc2626" />
												</button>
											</div>
										</div>
									</div>
								</div>
							)
						})}
					</div>
				)}

				{/* Create / Edit Blog Modal */}
				{editingBlog && (
					<div style={{
						position: 'fixed',
						inset: 0,
						background: 'rgba(15, 23, 42, 0.65)',
						backdropFilter: 'blur(4px)',
						zIndex: 9999,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						padding: '20px'
					}}>
						<div style={{
							background: '#ffffff',
							borderRadius: '20px',
							maxWidth: '720px',
							width: '100%',
							padding: '28px',
							boxShadow: '0 24px 60px rgba(0,0,0,0.2)',
							maxHeight: '92vh',
							overflowY: 'auto'
						}}>
							<div style={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
								marginBottom: '20px',
								paddingBottom: '14px',
								borderBottom: '1px solid #e2e8f0'
							}}>
								<div>
									<h3 style={{ margin: 0, fontSize: '19px', fontWeight: '800', color: '#0f172a' }}>
										{editingBlog.id ? 'Edit Blog Post' : 'Create New Blog Post'}
									</h3>
									<p style={{ margin: '3px 0 0 0', fontSize: '12.5px', color: '#64748b' }}>
										Upload either a Cover Photo OR a Video, along with title, excerpt, and article story
									</p>
								</div>
								<button
									type="button"
									onClick={() => setEditingBlog(null)}
									style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
								>
									<IconClose size={22} />
								</button>
							</div>

							<form onSubmit={handleSaveBlog} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
								<div>
									<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
										<label style={{ ...labelStyle, marginBottom: 0 }}>Blog Title *</label>
										<span style={{ fontSize: '11px', color: (editingBlog.title || '').length > 90 ? '#dc2626' : '#64748b', fontWeight: '700' }}>
											{(editingBlog.title || '').length}/100 chars allowed
										</span>
									</div>
									<input
										type="text"
										required
										maxLength={100}
										value={editingBlog.title}
										onChange={e => handleBlogTitleChange(e.target.value)}
										style={inputStyle}
										placeholder="e.g. The Ultimate Switzerland & Alps Itinerary for Indian Travelers"
									/>
								</div>

								<div>
									<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
										<label style={labelStyle}>URL Slug (Auto-Generated) *</label>
										<button
											type="button"
											onClick={handleRegenerateBlogSlug}
											title="Re-generate unique slug from blog title"
											style={{
												background: '#ecfdf5',
												color: '#16a34a',
												border: '1px solid #bbf7d0',
												padding: '3px 8px',
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
											<span>Auto-generate</span>
										</button>
									</div>
									<input
										type="text"
										required
										maxLength={80}
										value={editingBlog.slug || ''}
										onChange={e => handleBlogSlugChange(e.target.value)}
										onBlur={handleBlogSlugBlur}
										style={inputStyle}
										placeholder="e.g. ultimate-switzerland-alps-itinerary"
									/>
									<div style={{ margin: '4px 0 0', fontSize: '11px', color: '#64748b', display: 'flex', gap: '8px', alignItems: 'center' }}>
										<span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
											<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
												<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
												<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
											</svg>
											<span>Link: <strong style={{ color: '#16a34a' }}>/blog/{editingBlog.slug || '...'}</strong></span>
										</span>
										{editingBlog.slug && (
											<span style={{ background: '#f1f5f9', padding: '1px 6px', borderRadius: '4px', fontSize: '10.5px' }}>
												{isSlugCustomized ? 'Custom' : 'Auto-sync'}
											</span>
										)}
									</div>
								</div>

								<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
									<div>
										<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
											<label style={{ ...labelStyle, marginBottom: 0 }}>Category *</label>
											<span style={{ fontSize: '11px', color: '#64748b', fontWeight: '700' }}>
												{(editingBlog.category || '').length}/40
											</span>
										</div>
										<input
											type="text"
											required
											maxLength={40}
											list="blog-categories"
											value={editingBlog.category}
											onChange={e => setEditingBlog({ ...editingBlog, category: e.target.value })}
											style={inputStyle}
											placeholder="e.g. Europe, Honeymoon, Asia, Visa Guide"
										/>
										<datalist id="blog-categories">
											<option value="Europe" />
											<option value="Honeymoon" />
											<option value="Asia" />
											<option value="Luxury" />
											<option value="Visa Guide" />
										</datalist>
									</div>

									<div>
										<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
											<label style={{ ...labelStyle, marginBottom: 0 }}>Author Name</label>
											<span style={{ fontSize: '11px', color: '#64748b', fontWeight: '700' }}>
												{(editingBlog.author || '').length}/50
											</span>
										</div>
										<input
											type="text"
											maxLength={50}
											value={editingBlog.author || ''}
											onChange={e => setEditingBlog({ ...editingBlog, author: e.target.value })}
											style={inputStyle}
											placeholder="e.g. Europe Specialist"
										/>
									</div>
								</div>

								<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px', gap: '14px' }}>
									<div>
										<label style={labelStyle}>Publish Date</label>
										<input
											type="text"
											value={editingBlog.date || ''}
											onChange={e => setEditingBlog({ ...editingBlog, date: e.target.value })}
											style={inputStyle}
											placeholder="e.g. Oct 05, 2026"
										/>
									</div>

									<div>
										<label style={labelStyle}>Read Time</label>
										<input
											type="text"
											value={editingBlog.readTime || ''}
											onChange={e => setEditingBlog({ ...editingBlog, readTime: e.target.value })}
											style={inputStyle}
											placeholder="e.g. 6 min read"
										/>
									</div>

									<div>
										<label style={labelStyle}>Display Order</label>
										<input
											type="number"
											value={editingBlog.order || 1}
											onChange={e => setEditingBlog({ ...editingBlog, order: parseInt(e.target.value) || 1 })}
											style={inputStyle}
										/>
									</div>
								</div>

								{/* Media Type Switcher: Image OR Video (Only one allowed) */}
								<div style={{ background: '#f8fafc', padding: '14px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
									<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
										<label style={{ ...labelStyle, marginBottom: 0 }}>
											Blog Media Type (Choose Image OR Video) *
										</label>
										<div style={{ display: 'inline-flex', background: '#ffffff', padding: '3px', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
											<button
												type="button"
												onClick={() => handleSwitchMediaType('image')}
												style={{
													padding: '6px 14px',
													borderRadius: '7px',
													border: 'none',
													background: mediaType === 'image' ? '#16a34a' : 'transparent',
													color: mediaType === 'image' ? '#ffffff' : '#475569',
													fontWeight: '800',
													fontSize: '12px',
													cursor: 'pointer',
													display: 'inline-flex',
													alignItems: 'center',
													gap: '6px'
												}}
											>
												<IconImage size={13} />
												<span>Image Only</span>
											</button>
											<button
												type="button"
												onClick={() => handleSwitchMediaType('video')}
												style={{
													padding: '6px 14px',
													borderRadius: '7px',
													border: 'none',
													background: mediaType === 'video' ? '#16a34a' : 'transparent',
													color: mediaType === 'video' ? '#ffffff' : '#475569',
													fontWeight: '800',
													fontSize: '12px',
													cursor: 'pointer',
													display: 'inline-flex',
													alignItems: 'center',
													gap: '6px'
												}}
											>
												<IconVideo size={13} />
												<span>Video Only</span>
											</button>
										</div>
									</div>

									<ImageUploader
										label={mediaType === 'video' ? 'Upload Blog Video' : 'Upload Blog Image'}
										resolution={mediaType === 'video' ? 'MP4 / WebM / MOV · 16:9 Landscape' : '800 × 520 px · 16:10 Landscape'}
										required={true}
										accept={mediaType === 'video' ? 'video/*' : 'image/*'}
										value={editingBlog.image}
										onChange={url => setEditingBlog({ ...editingBlog, image: url })}
										placeholder={mediaType === 'video' ? 'Upload or paste video URL (.mp4, .webm)' : 'Upload or paste image URL (.jpg, .png)'}
									/>
								</div>

								{/* 1. SUMMARY BOX */}
								<div>
									<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
										<label style={{ ...labelStyle, marginBottom: 0 }}>1. Article Summary / Lead Intro (Summary) *</label>
										<span style={{ fontSize: '11px', color: (editingBlog.excerpt || '').length > 220 ? '#dc2626' : '#64748b', fontWeight: '700' }}>
											{(editingBlog.excerpt || '').length}/250 chars allowed
										</span>
									</div>
									<textarea
										rows={3}
										required
										maxLength={250}
										value={editingBlog.excerpt || ''}
										onChange={e => setEditingBlog({ ...editingBlog, excerpt: e.target.value })}
										style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.5' }}
										placeholder="Brief summary / lead paragraph displayed at the top of the article and on the blog card..."
									/>
								</div>

								{/* 2 & 3. DYNAMIC ARTICLE STORY SECTIONS (HEADING & CONTENT BLOCKS) */}
								<div style={{
									background: '#f8fafc',
									padding: '18px',
									borderRadius: '16px',
									border: '1.5px solid #e2e8f0',
									display: 'flex',
									flexDirection: 'column',
									gap: '16px'
								}}>
									{/* Top Header with title and "+ Add Section" button */}
									<div style={{
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'center',
										flexWrap: 'wrap',
										gap: '10px',
										borderBottom: '1px solid #e2e8f0',
										paddingBottom: '12px'
									}}>
										<div>
											<h4 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
												<span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
													<IconFileText size={16} /> Article Story Sections
												</span>
												<span style={{
													background: '#e0f2fe',
													color: '#0369a1',
													fontSize: '11px',
													padding: '2px 8px',
													borderRadius: '10px',
													fontWeight: '800'
												}}>
													{(editingBlog.sections || []).length} { (editingBlog.sections || []).length === 1 ? 'Section' : 'Sections' }
												</span>
											</h4>
											
										</div>

										<button
											type="button"
											onClick={handleAddSection}
											style={{
												display: 'inline-flex',
												alignItems: 'center',
												gap: '6px',
												background: '#16a34a',
												color: '#ffffff',
												border: 'none',
												padding: '8px 16px',
												borderRadius: '10px',
												fontSize: '12.5px',
												fontWeight: '800',
												cursor: 'pointer',
												boxShadow: '0 2px 8px rgba(22,163,74,0.25)',
												transition: 'all 0.2s ease'
											}}
										>
											<IconPlus size={15} />
											<span>Add Section</span>
										</button>
									</div>

									{/* Render each section */}
									<div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
										{(editingBlog.sections || []).map((sec, idx) => (
											<div
												key={idx}
												style={{
													background: '#ffffff',
													borderRadius: '14px',
													border: '1px solid #cbd5e1',
													padding: '16px',
													display: 'flex',
													flexDirection: 'column',
													gap: '12px',
													boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
												}}
											>
												{/* Section Header: Section # + Delete button if > 1 */}
												<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
													<span style={{
														display: 'inline-flex',
														alignItems: 'center',
														gap: '6px',
														fontWeight: '800',
														fontSize: '13px',
														color: '#1e293b',
														background: '#f1f5f9',
														padding: '4px 10px',
														borderRadius: '8px'
													}}>
														<IconPin size={13} /> Section {idx + 1}
													</span>

													{(editingBlog.sections || []).length > 1 && (
														<button
															type="button"
															onClick={() => handleRemoveSection(idx)}
															title={`Remove Section ${idx + 1}`}
															style={{
																background: '#fef2f2',
																color: '#dc2626',
																border: '1px solid #fecaca',
																padding: '4px 10px',
																borderRadius: '8px',
																fontSize: '11.5px',
																fontWeight: '700',
																cursor: 'pointer',
																display: 'inline-flex',
																alignItems: 'center',
																gap: '4px'
															}}
														>
															<IconTrash size={13} color="#dc2626" />
															<span>Remove Section</span>
														</button>
													)}
												</div>

												{/* Heading field */}
												<div>
													<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
														<label style={{ ...labelStyle, marginBottom: 0 }}>
															{idx + 1}. Section Heading / Subtitle (Heading)
														</label>
														<span style={{ fontSize: '11px', color: (sec.heading || '').length > 130 ? '#dc2626' : '#64748b', fontWeight: '700' }}>
															{(sec.heading || '').length}/150 chars allowed
														</span>
													</div>
													<input
														type="text"
														maxLength={150}
														value={sec.heading || ''}
														onChange={e => handleSectionChange(idx, 'heading', e.target.value)}
														style={inputStyle}
														placeholder={`e.g. ${idx + 1}. The Magic of Swiss Travel Pass & Alpine Peaks`}
													/>
												</div>

												{/* Content field: Summernote Rich Text Editor */}
												<div>
													<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
														<label style={{ ...labelStyle, marginBottom: 0 }}>
															Detailed Article Content (Content) {idx === 0 ? '*' : ''}
														</label>
														<span style={{ fontSize: '11px', color: '#16a34a', fontWeight: '800', background: '#ecfdf5', padding: '2px 8px', borderRadius: '6px', border: '1px solid #bbf7d0' }}>
															✨ Summernote Rich Editor (Links &amp; Formatting)
														</span>
													</div>
													<SummernoteEditor
														value={sec.content || ''}
														onChange={html => handleSectionChange(idx, 'content', html)}
														placeholder={`Write Section ${idx + 1} story content here. Select text & click 🔗 Link to insert hyperlinks...`}
														minHeight={160}
														maxLength={8000}
													/>
												</div>
											</div>
										))}
									</div>

								</div>

								{/* 4. SEO & META TAGS SECTION */}
								<div style={{
									marginTop: '10px',
									padding: '16px',
									backgroundColor: '#f8fafc',
									borderRadius: '12px',
									border: '1px solid #e2e8f0'
								}}>
									<div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
										<IconSearch size={16} color="#0f172a" />
										<h4 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#0f172a' }}>
											4. SEO &amp; Search Engine Optimization (Optional)
										</h4>
									</div>

									<div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
										<div>
											<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
												<label style={{ fontSize: '12px', fontWeight: '700', color: '#334155' }}>
													Custom Meta Title
												</label>
												<span style={{ fontSize: '11px', color: (editingBlog.metaTitle || '').length > 55 ? '#dc2626' : '#64748b', fontWeight: '700' }}>
													{(editingBlog.metaTitle || '').length}/60 chars allowed
												</span>
											</div>
											<input
												type="text"
												maxLength={60}
												value={editingBlog.metaTitle || ''}
												onChange={e => setEditingBlog({ ...editingBlog, metaTitle: e.target.value })}
												style={inputStyle}
												placeholder={editingBlog.title ? `${editingBlog.title} | Golden Travels` : 'e.g. Best Honeymoon Guide | Golden Travels'}
											/>
										</div>

										<div>
											<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
												<label style={{ fontSize: '12px', fontWeight: '700', color: '#334155' }}>
													Custom Meta Description
												</label>
												<span style={{ fontSize: '11px', color: (editingBlog.metaDescription || '').length > 150 ? '#dc2626' : '#64748b', fontWeight: '700' }}>
													{(editingBlog.metaDescription || '').length}/160 chars allowed
												</span>
											</div>
											<textarea
												rows={2}
												maxLength={160}
												value={editingBlog.metaDescription || ''}
												onChange={e => setEditingBlog({ ...editingBlog, metaDescription: e.target.value })}
												style={{ ...inputStyle, resize: 'vertical' }}
												placeholder={editingBlog.excerpt || 'Custom description for Google SERP snippet...'}
											/>
										</div>

										<div>
											<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
												<label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', margin: 0 }}>
													Meta Keywords (Comma separated)
												</label>
												<span style={{ fontSize: '11px', color: (editingBlog.metaKeywords || '').length > 230 ? '#dc2626' : '#64748b', fontWeight: '700' }}>
													{(editingBlog.metaKeywords || '').length}/250 chars allowed
												</span>
											</div>
											<input
												type="text"
												maxLength={250}
												value={editingBlog.metaKeywords || ''}
												onChange={e => setEditingBlog({ ...editingBlog, metaKeywords: e.target.value })}
												style={inputStyle}
												placeholder={`e.g. ${editingBlog.category || 'travel'}, ${editingBlog.title || 'guide'}, golden travels`}
											/>
										</div>

										<div>
											<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
												<label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', display: 'block', margin: 0 }}>
													Canonical Link (Canonical URL)
												</label>
												<button
													type="button"
													onClick={() => {
														const currentSlug = editingBlog.slug || computeUniqueSlug(editingBlog.title, blogs, editingBlog.id)
														const link = currentSlug ? buildCanonicalUrl('blog', currentSlug) : ''
														setEditingBlog(prev => ({ ...prev, canonicalUrl: link }))
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
													<IconBolt size={12} />
													<span>Auto-sync with Slug</span>
												</button>
											</div>
											<input
												type="url"
												value={editingBlog.canonicalUrl ? resolveCanonicalUrl(editingBlog.canonicalUrl, 'blog', editingBlog.slug) : (editingBlog.slug ? buildCanonicalUrl('blog', editingBlog.slug) : '')}
												onChange={e => setEditingBlog({ ...editingBlog, canonicalUrl: e.target.value })}
												style={inputStyle}
												placeholder={editingBlog.slug ? buildCanonicalUrl('blog', editingBlog.slug) : `${getSiteBaseUrl()}/blog/...`}
											/>
											
										</div>
									</div>
								</div>

								<div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
									<button
										type="button"
										onClick={() => setEditingBlog(null)}
										style={{
											padding: '10px 18px',
											background: '#f1f5f9',
											border: '1px solid #cbd5e1',
											borderRadius: '10px',
											fontWeight: '700',
											color: '#475569',
											cursor: 'pointer'
										}}
									>
										Cancel
									</button>
									<button
										type="submit"
										disabled={saving}
										style={{
											padding: '10px 24px',
											background: '#16a34a',
											color: '#ffffff',
											border: 'none',
											borderRadius: '10px',
											fontWeight: '800',
											cursor: 'pointer',
											display: 'inline-flex',
											alignItems: 'center',
											gap: '8px'
										}}
									>
										<IconSave size={15} />
										<span>{saving ? 'Saving...' : 'Save Blog Post'}</span>
									</button>
								</div>
							</form>
						</div>
					</div>
				)}
			</div>
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
	fontSize: '13.5px',
	outline: 'none'
}

