import React, { useEffect, useState } from 'react'
import AdminLayout from './AdminLayout'
import { fetchPersonas, updatePersona, createPersona, deletePersona, fetchPackages } from '@/services/api'
import { useToast } from '@/context/ToastContext'
import {
	IconPersonas,
	IconEdit,
	IconTrash,
	IconPlus,
	IconSave,
	IconClose
} from '@/components/Icons'
import ImageUploader from '@/components/ImageUploader'

export default function AdminPersonas() {
	const { showToast, confirmAction } = useToast()
	const [personas, setPersonas] = useState([])
	const [packages, setPackages] = useState([])
	const [loading, setLoading] = useState(true)
	const [editingPersona, setEditingPersona] = useState(null)
	const [saving, setSaving] = useState(false)

	const loadData = async () => {
		try {
			setLoading(true)
			const [resPersonas, resPkgs] = await Promise.all([fetchPersonas(), fetchPackages()])
			if (resPersonas.success) setPersonas(resPersonas.data)
			if (resPkgs.success) setPackages(resPkgs.data || [])
		} catch (err) {
			console.error(err)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		loadData()
	}, [])

	const handleSavePersona = async (e) => {
		e.preventDefault()
		if (!editingPersona.title?.trim()) {
			showToast('Please enter a Persona Title!', 'error')
			return
		}
		if (!editingPersona.image?.trim()) {
			showToast('Please upload or select a Photo for this persona!', 'error')
			return
		}

		// Ensure clean link and slug
		const payload = { ...editingPersona }
		if (payload.slug && !payload.link) {
			payload.link = payload.slug.startsWith('/') ? payload.slug : `/tour/${payload.slug}`
		} else if (!payload.link) {
			payload.link = '/tour'
		}

		setSaving(true)
		try {
			if (editingPersona.id) {
				const res = await updatePersona(editingPersona.id, payload)
				if (res.success) {
					setPersonas(personas.map(p => p.id === editingPersona.id ? res.data : p))
					showToast(`Persona "${editingPersona.title}" updated successfully!`, 'success')
				}
			} else {
				const res = await createPersona(payload)
				if (res.success) {
					setPersonas([...personas, res.data])
					showToast(`New persona "${editingPersona.title}" added successfully!`, 'success')
				}
			}
			setEditingPersona(null)
		} catch (err) {
			showToast('Failed to save persona: ' + err.message, 'error')
		} finally {
			setSaving(false)
		}
	}

	const handleDeletePersona = (id, title) => {
		confirmAction({
			title: 'Delete Persona Profile?',
			message: `Are you sure you want to delete "${title || 'this persona profile'}"? This action cannot be undone.`,
			confirmText: 'Yes, Delete',
			onConfirm: async () => {
				try {
					const res = await deletePersona(id)
					if (res.success) {
						await loadData()
						showToast(`Persona "${title}" deleted successfully!`, 'success')
					}
				} catch (err) {
					showToast('Failed to delete persona: ' + err.message, 'error')
				}
			}
		})
	}

	return (
		<AdminLayout title="Personalized Experience">
			{/* Top Bar with Add Button */}
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', flexWrap: 'wrap', gap: '12px' }}>
				<div>
					<h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
						<IconPersonas size={20} color="#16a34a" />
						<span>Persona Profiles ({personas.length})</span>
					</h3>
					<p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
						Manage customer holiday personas shown on the website, including photos and click-redirect tour package slugs.
					</p>
				</div>
				<button
					type="button"
					onClick={() => setEditingPersona({ id: '', title: '', subtitle: '', image: '', slug: '', link: '/tour' })}
					style={{
						background: '#16a34a',
						color: '#fff',
						border: 'none',
						padding: '10px 18px',
						borderRadius: '10px',
						fontWeight: '700',
						fontSize: '13px',
						cursor: 'pointer',
						display: 'inline-flex',
						alignItems: 'center',
						gap: '6px',
						boxShadow: '0 2px 8px rgba(22,163,74,0.25)'
					}}
				>
					<IconPlus size={15} />
					<span>Add New Persona</span>
				</button>
			</div>

			{loading ? (
				<div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading personas...</div>
			) : (
				<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
					{personas.map(p => {
						const targetHref = p.slug ? (p.slug.startsWith('/') ? p.slug : `/tour/${p.slug}`) : (p.link || '/tour')
						return (
							<div key={p.id} style={{ background: '#ffffff', borderRadius: '18px', border: '1px solid #e2e8f0', padding: '22px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column' }}>
								<div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
									<img
										src={p.image}
										alt={p.title}
										style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2.5px solid #16a34a', flexShrink: 0, background: '#f1f5f9' }}
										onError={e => { e.target.src = '/assets/images/slide/slide2.jpg' }}
									/>
									<div style={{ minWidth: 0, flex: 1 }}>
										<h4 style={{ margin: '0 0 2px', fontSize: '17px', fontWeight: '800', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
											{p.title}
										</h4>
										<span style={{ fontSize: '12.5px', color: '#16a34a', fontWeight: '700', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
											{p.subtitle || 'Custom Persona'}
										</span>
									</div>
								</div>

								{/* Redirect Slug / Target Info */}
								<div style={{ marginBottom: '16px', padding: '8px 12px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
									<span style={{ fontWeight: '800', color: '#16a34a', flexShrink: 0, fontSize: '11px', textTransform: 'uppercase' }}>Redirects To:</span>
									<span style={{ color: '#0f172a', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'monospace' }} title={targetHref}>
										{targetHref}
									</span>
								</div>

								<div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
									<button
										type="button"
										onClick={() => setEditingPersona({ ...p })}
										style={{ flex: 1, background: '#16a34a', color: '#fff', border: 'none', padding: '9px 12px', borderRadius: '8px', fontWeight: '700', fontSize: '12.5px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}
									>
										<IconEdit size={13} color="#ffffff" />
										<span>Edit</span>
									</button>
									<button
										type="button"
										onClick={() => handleDeletePersona(p.id, p.title)}
										style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '9px 12px', borderRadius: '8px', fontWeight: '700', fontSize: '12.5px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
										title="Delete Persona"
									>
										<IconTrash size={13} color="#dc2626" />
									</button>
								</div>
							</div>
						)
					})}
				</div>
			)}

			{/* ADD / EDIT PERSONA MODAL */}
			{editingPersona && (
				<div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
					<div style={{ background: '#ffffff', borderRadius: '20px', maxWidth: '520px', width: '100%', padding: '28px', boxShadow: '0 20px 50px rgba(0,0,0,0.15)', maxHeight: '90vh', overflowY: 'auto' }}>
						<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
							<h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
								{editingPersona.id ? `Edit Persona: ${editingPersona.title}` : 'Add New Persona'}
							</h3>
							<button onClick={() => setEditingPersona(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
								<IconClose size={20} />
							</button>
						</div>

						<form onSubmit={handleSavePersona} autoComplete="off" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
							<div>
								<label style={labelStyle}>Persona Title *</label>
								<input
									type="text"
									required
									autoComplete="off"
									placeholder="e.g. Couple, Family, Solo..."
									value={editingPersona.title || ''}
									onChange={e => setEditingPersona({ ...editingPersona, title: e.target.value })}
									style={inputStyle}
								/>
							</div>

							<div>
								<label style={labelStyle}>Subtitle</label>
								<input
									type="text"
									autoComplete="off"
									placeholder="e.g. Romantic & Honeymoon"
									value={editingPersona.subtitle || ''}
									onChange={e => setEditingPersona({ ...editingPersona, subtitle: e.target.value })}
									style={inputStyle}
								/>
							</div>

							<div>
								<ImageUploader
									label="Persona Photo"
									resolution="400 × 400 px · 1:1 Square"
									required={true}
									value={editingPersona.image || ''}
									onChange={url => setEditingPersona({ ...editingPersona, image: url })}
									placeholder="/assets/images/slide/slide2.jpg"
								/>
							</div>

							{/* REDIRECT SLUG / TOUR PACKAGE LINK */}
							<div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
								<label style={{ ...labelStyle, color: '#16a34a' }}>Redirect Tour Package / Slug *</label>
								
								{/* Quick dropdown from our packages */}
								<div style={{ marginBottom: '8px' }}>
									<select
										onChange={e => {
											const selectedSlug = e.target.value
											if (selectedSlug) {
												setEditingPersona({
													...editingPersona,
													slug: selectedSlug,
													link: `/tour/${selectedSlug}`
												})
											}
										}}
										style={{ ...inputStyle, background: '#ffffff', cursor: 'pointer' }}
										defaultValue=""
									>
										<option value="">-- Choose from Existing Tour Packages --</option>
										{packages.map(pkg => (
											<option key={pkg.id || pkg.slug} value={pkg.slug}>
												{pkg.title} ({pkg.slug})
											</option>
										))}
									</select>
								</div>

								{/* Or manually input slug or URL */}
								<div>
									<input
										type="text"
										autoComplete="off"
										placeholder="e.g. vietnam-beauty-of-vietnam or /tour/vietnam-beauty-of-vietnam"
										value={editingPersona.slug || editingPersona.link || ''}
										onChange={e => {
											const val = e.target.value
											const isPath = val.startsWith('/')
											setEditingPersona({
												...editingPersona,
												slug: isPath ? val.replace(/^\/tour\//, '') : val,
												link: isPath ? val : (val ? `/tour/${val}` : '/tour')
											})
										}}
										style={inputStyle}
									/>
									
								</div>
							</div>

							<div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
								<button type="button" onClick={() => setEditingPersona(null)} style={{ padding: '8px 16px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: '700', color: '#475569', cursor: 'pointer' }}>Cancel</button>
								<button type="submit" disabled={saving} style={{ padding: '8px 20px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '800', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
									<IconSave size={14} />
									<span>{saving ? 'Saving...' : (editingPersona.id ? 'Save Persona' : 'Add Persona')}</span>
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
	outline: 'none',
	boxSizing: 'border-box'
}
