import React, { useEffect, useState } from 'react'
import AdminLayout from './AdminLayout'
import {
	fetchFeatures,
	createFeature,
	updateFeature,
	deleteFeature,
	fetchTrustStats,
	createTrustStat,
	updateTrustStat,
	deleteTrustStat
} from '@/services/api'
import { useToast } from '@/context/ToastContext'
import {
	IconFeatures,
	IconStar,
	IconPlus,
	IconSave,
	IconEdit,
	IconTrash,
	IconClose,
	renderFeatureIcon,
	renderTrustStatIcon
} from '@/components/Icons'
import EmojiKeyboardPicker from '@/components/EmojiKeyboardPicker'

export default function AdminFeatures() {
	const { showToast, confirmAction } = useToast()
	const [features, setFeatures] = useState([])
	const [trustStats, setTrustStats] = useState([])
	const [loading, setLoading] = useState(true)
	const [editingFeature, setEditingFeature] = useState(null)
	const [editingStat, setEditingStat] = useState(null)
	const [saving, setSaving] = useState(false)
	const [savingStat, setSavingStat] = useState(false)

	const loadData = async () => {
		try {
			setLoading(true)
			const [resFeatures, resStats] = await Promise.all([
				fetchFeatures(),
				fetchTrustStats()
			])
			if (resFeatures && resFeatures.success) setFeatures(resFeatures.data || [])
			if (resStats && resStats.success) setTrustStats(resStats.data || [])
		} catch (err) {
			console.error(err)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		loadData()
	}, [])

	// ================= TRUST PILLARS & USPs CRUD =================
	const handleSaveFeature = async (e) => {
		e.preventDefault()
		setSaving(true)
		try {
			if (editingFeature.id) {
				const res = await updateFeature(editingFeature.id, editingFeature)
				const updated = res.data || editingFeature
				setFeatures(features.map(f => f.id === editingFeature.id ? updated : f))
				showToast('Trust pillar updated successfully!', 'success')
			} else {
				const res = await createFeature(editingFeature)
				if (res.success && res.data) {
					setFeatures([...features, res.data])
					showToast('New trust pillar added successfully!', 'success')
				} else {
					throw new Error(res.message || 'Failed to create pillar')
				}
			}
			setEditingFeature(null)
		} catch (err) {
			showToast('Failed to save feature: ' + err.message, 'error')
		} finally {
			setSaving(false)
		}
	}

	const handleDeleteFeature = (id, title) => {
		confirmAction({
			title: 'Delete Trust Pillar?',
			message: `Are you sure you want to delete "${title || 'this pillar'}"? This action cannot be undone.`,
			confirmText: 'Yes, Delete',
			onConfirm: async () => {
				try {
					await deleteFeature(id)
					setFeatures(prev => prev.filter(f => f.id !== id))
					showToast('Trust pillar deleted successfully', 'success')
				} catch (err) {
					showToast('Delete failed: ' + err.message, 'error')
				}
			}
		})
	}

	// ================= TRUST & AUTHORITY STATS CRUD =================
	const handleSaveStat = async (e) => {
		e.preventDefault()
		setSavingStat(true)
		try {
			if (editingStat.id) {
				const res = await updateTrustStat(editingStat.id, editingStat)
				const updated = res.data || editingStat
				setTrustStats(trustStats.map(s => s.id === editingStat.id ? updated : s))
				showToast('Trust stat updated successfully!', 'success')
			} else {
				const res = await createTrustStat(editingStat)
				if (res.success && res.data) {
					setTrustStats([...trustStats, res.data])
					showToast('New trust stat added successfully!', 'success')
				} else {
					throw new Error(res.message || 'Failed to create stat')
				}
			}
			setEditingStat(null)
		} catch (err) {
			showToast('Failed to save stat: ' + err.message, 'error')
		} finally {
			setSavingStat(false)
		}
	}

	const handleDeleteStat = (id, label) => {
		confirmAction({
			title: 'Delete Trust Stat?',
			message: `Are you sure you want to delete "${label || 'this stat'}"? This action cannot be undone.`,
			confirmText: 'Yes, Delete',
			onConfirm: async () => {
				try {
					await deleteTrustStat(id)
					setTrustStats(prev => prev.filter(s => s.id !== id))
					showToast('Trust stat deleted successfully', 'success')
				} catch (err) {
					showToast('Delete failed: ' + err.message, 'error')
				}
			}
		})
	}

	return (
		<AdminLayout title="Why Choose Us (Pillars &amp; Trust)">
			{/* ================= 1. TRUST PILLARS & USPs ================= */}
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '18px' }}>
				<div>
					<h3 style={{ fontSize: '17px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
						<IconFeatures size={18} color="#16a34a" />
						<span>Trust Pillars &amp; USPs ({features.length})</span>
					</h3>
					<p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
						Manage the key value propositions explaining why travelers trust Golden Travels.
					</p>
				</div>
				<button
					type="button"
					onClick={() => setEditingFeature({
						icon: 'target',
						title: '',
						description: '',
						order: features.length + 1
					})}
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
						boxShadow: '0 4px 12px rgba(22,163,74,0.2)'
					}}
				>
					<IconPlus size={15} />
					<span>Add Trust Pillar</span>
				</button>
			</div>

			{loading ? (
				<div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading trust pillars &amp; stats...</div>
			) : (
				<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '40px' }}>
					{features.map(f => (
						<div key={f.id} style={{ background: '#ffffff', borderRadius: '18px', border: '1px solid #e2e8f0', padding: '22px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column' }}>
							<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
								<div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f0fdf4', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
									{renderFeatureIcon(f.icon, f.title, 24)}
								</div>
								<span style={{ fontSize: '11.5px', color: '#94a3b8', fontWeight: '600' }}>Order #{f.order || 1}</span>
							</div>
							<h4 style={{ margin: '0 0 8px', fontSize: '17px', fontWeight: '800', color: '#0f172a' }}>{f.title}</h4>
							<p style={{ margin: '0 0 18px', fontSize: '13px', color: '#64748b', lineHeight: 1.5, flex: 1 }}>{f.description}</p>
							<div style={{ display: 'flex', gap: '8px' }}>
								<button
									type="button"
									onClick={() => setEditingFeature({ ...f })}
									style={{ flex: 1, background: '#16a34a', color: '#fff', border: 'none', padding: '9px', borderRadius: '8px', fontWeight: '700', fontSize: '12.5px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
								>
									<IconEdit size={13} color="#ffffff" />
									<span>Edit Feature</span>
								</button>
								<button
									type="button"
									onClick={() => handleDeleteFeature(f.id, f.title)}
									style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '9px 12px', borderRadius: '8px', fontWeight: '700', fontSize: '12px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
									title="Delete Trust Pillar"
								>
									<IconTrash size={14} color="#dc2626" />
								</button>
							</div>
						</div>
					))}
				</div>
			)}

			{/* ================= 2. TRUST & AUTHORITY STATS (25+ Years, 50,000+ Travelers, etc.) ================= */}
			<div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '32px' }}>
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '18px' }}>
					<div>
						<h3 style={{ fontSize: '17px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
							<IconStar size={18} color="#16a34a" filled />
							<span>Trust &amp; Authority Stats ({trustStats.length})</span>
						</h3>
						<p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
							Manage the highlight milestone counters (Years of Excellence, Happy Travelers, Global Destinations, Google Rating).
						</p>
					</div>
					<button
						type="button"
						onClick={() => setEditingStat({
							icon: 'trophy',
							number: '',
							label: '',
							desc: '',
							order: trustStats.length + 1
						})}
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
							boxShadow: '0 4px 12px rgba(22,163,74,0.2)'
						}}
					>
						<IconPlus size={15} />
						<span>Add Stat Counter</span>
					</button>
				</div>

				{!loading && (
					<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
						{trustStats.map(stat => (
							<div
								key={stat.id}
								style={{
									background: '#071812',
									borderRadius: '18px',
									border: '1px solid rgba(74, 222, 128, 0.2)',
									padding: '22px',
									boxShadow: '0 8px 24px rgba(7, 24, 18, 0.12)',
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									textAlign: 'center',
									color: '#ffffff'
								}}
							>
								<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '32px', marginBottom: '8px' }}>
									{renderTrustStatIcon(stat.icon, stat.label, 26)}
								</div>
								<div style={{ fontSize: '28px', fontWeight: '800', color: '#4ade80', letterSpacing: '-0.02em', marginBottom: '4px' }}>
									{stat.number}
								</div>
								<div style={{ fontSize: '15px', fontWeight: '700', color: '#ffffff', marginBottom: '4px' }}>
									{stat.label}
								</div>
								<div style={{ fontSize: '12.5px', color: '#9ca3af', marginBottom: '18px', flex: 1 }}>
									{stat.desc}
								</div>
								<div style={{ display: 'flex', gap: '8px', width: '100%' }}>
									<button
										type="button"
										onClick={() => setEditingStat({ ...stat })}
										style={{ flex: 1, background: '#16a34a', color: '#fff', border: 'none', padding: '9px', borderRadius: '8px', fontWeight: '700', fontSize: '12.5px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
									>
										<IconEdit size={13} color="#ffffff" />
										<span>Edit Stat</span>
									</button>
									<button
										type="button"
										onClick={() => handleDeleteStat(stat.id, stat.label)}
										style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.35)', color: '#f87171', padding: '9px 12px', borderRadius: '8px', fontWeight: '700', fontSize: '12px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
										title="Delete Stat"
									>
										<IconTrash size={14} color="#f87171" />
									</button>
								</div>
							</div>
						))}
					</div>
				)}
			</div>

			{/* ================= CREATE / EDIT TRUST PILLAR MODAL ================= */}
			{editingFeature && (
				<div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
					<div style={{ background: '#ffffff', borderRadius: '20px', maxWidth: '580px', width: '100%', padding: '26px', boxShadow: '0 20px 50px rgba(0,0,0,0.15)', maxHeight: '90vh', overflowY: 'auto' }}>
						<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
							<h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
								{editingFeature.id ? `Edit Pillar: ${editingFeature.title}` : 'Add New Trust Pillar / USP'}
							</h3>
							<button onClick={() => setEditingFeature(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
								<IconClose size={20} />
							</button>
						</div>

						<form onSubmit={handleSaveFeature} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
							<div>
								<label style={labelStyle}>Pillar Emoji / Icon *</label>
								<div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
									<div
										title="Live Icon Preview"
										style={{
											width: '42px',
											height: '42px',
											borderRadius: '10px',
											background: '#f0fdf4',
											border: '1px solid #bbf7d0',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											flexShrink: 0
										}}
									>
										{renderFeatureIcon(editingFeature.icon, editingFeature.title, 24)}
									</div>
									<div style={{ flex: 1, minWidth: 0 }}>
										<EmojiKeyboardPicker
											value={editingFeature.icon || '🎯'}
											onChange={(char) => setEditingFeature({ ...editingFeature, icon: char })}
										/>
									</div>
								</div>
							</div>

							<div style={{ display: 'grid', gridTemplateColumns: '1fr 90px', gap: '12px' }}>
								<div>
									<label style={labelStyle}>Feature Title *</label>
									<input type="text" required value={editingFeature.title} onChange={e => setEditingFeature({ ...editingFeature, title: e.target.value })} style={inputStyle} placeholder="e.g. 100% Customized Trips" />
								</div>
								<div>
									<label style={labelStyle}>Order</label>
									<input type="number" value={editingFeature.order ?? 1} onChange={e => setEditingFeature({ ...editingFeature, order: parseInt(e.target.value) || 0 })} style={inputStyle} />
								</div>
							</div>

							<div>
								<label style={labelStyle}>Feature Description *</label>
								<textarea rows="3" required value={editingFeature.description} onChange={e => setEditingFeature({ ...editingFeature, description: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Describe this value pillar..." />
							</div>

							<div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
								<button type="button" onClick={() => setEditingFeature(null)} style={{ padding: '8px 16px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: '700', color: '#475569', cursor: 'pointer' }}>Cancel</button>
								<button type="submit" disabled={saving} style={{ padding: '8px 20px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '800', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
									<IconSave size={14} />
									<span>{saving ? 'Saving...' : 'Save Pillar'}</span>
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{/* ================= CREATE / EDIT TRUST STAT MODAL ================= */}
			{editingStat && (
				<div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
					<div style={{ background: '#ffffff', borderRadius: '20px', maxWidth: '580px', width: '100%', padding: '26px', boxShadow: '0 20px 50px rgba(0,0,0,0.15)', maxHeight: '90vh', overflowY: 'auto' }}>
						<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
							<h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
								{editingStat.id ? `Edit Stat: ${editingStat.label}` : 'Add New Trust Stat Counter'}
							</h3>
							<button onClick={() => setEditingStat(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
								<IconClose size={20} />
							</button>
						</div>

						<form onSubmit={handleSaveStat} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
							<div>
								<label style={labelStyle}>Stat Emoji / Icon *</label>
								<div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
									<div
										title="Live Icon Preview"
										style={{
											width: '42px',
											height: '42px',
											borderRadius: '10px',
											background: '#f0fdf4',
											border: '1px solid #bbf7d0',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											flexShrink: 0
										}}
									>
										{renderTrustStatIcon(editingStat.icon, editingStat.label, 24)}
									</div>
									<div style={{ flex: 1, minWidth: 0 }}>
										<EmojiKeyboardPicker
											value={editingStat.icon || '🏆'}
											onChange={(char) => setEditingStat({ ...editingStat, icon: char })}
										/>
									</div>
								</div>
							</div>

							<div style={{ display: 'grid', gridTemplateColumns: '1fr 90px', gap: '12px' }}>
								<div>
									<label style={labelStyle}>Number / Metric *</label>
									<input type="text" required value={editingStat.number} onChange={e => setEditingStat({ ...editingStat, number: e.target.value })} style={inputStyle} placeholder="e.g. 25+ or 50,000+" />
								</div>
								<div>
									<label style={labelStyle}>Order</label>
									<input type="number" value={editingStat.order ?? 1} onChange={e => setEditingStat({ ...editingStat, order: parseInt(e.target.value) || 0 })} style={inputStyle} />
								</div>
							</div>

							<div>
								<label style={labelStyle}>Stat Label / Title *</label>
								<input type="text" required value={editingStat.label} onChange={e => setEditingStat({ ...editingStat, label: e.target.value })} style={inputStyle} placeholder="e.g. Years of Excellence" />
							</div>

							<div>
								<label style={labelStyle}>Subtitle / Description *</label>
								<input type="text" required value={editingStat.desc} onChange={e => setEditingStat({ ...editingStat, desc: e.target.value })} style={inputStyle} placeholder="e.g. Serving travelers since 1999" />
							</div>

							<div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
								<button type="button" onClick={() => setEditingStat(null)} style={{ padding: '8px 16px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: '700', color: '#475569', cursor: 'pointer' }}>Cancel</button>
								<button type="submit" disabled={saving || savingStat} style={{ padding: '8px 20px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '800', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
									<IconSave size={14} />
									<span>{(saving || savingStat) ? 'Saving...' : 'Save Stat'}</span>
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
