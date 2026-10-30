import React, { useEffect, useState } from 'react'
import AdminLayout from './AdminLayout'
import { fetchTestimonials, updateTestimonial, createTestimonial, deleteTestimonial } from '@/services/api'
import { useToast } from '@/context/ToastContext'
import {
	IconSave,
	IconTestimonials,
	IconPlus,
	IconEdit,
	IconTrash,
	IconClose,
	IconStar
} from '@/components/Icons'

export default function AdminTestimonials() {
	const { showToast, confirmAction } = useToast()
	const [testimonials, setTestimonials] = useState([])
	const [loading, setLoading] = useState(true)
	const [editingItem, setEditingItem] = useState(null)
	const [saving, setSaving] = useState(false)

	const loadData = async () => {
		try {
			setLoading(true)
			const resTestis = await fetchTestimonials()
			if (resTestis.success) setTestimonials(resTestis.data || [])
		} catch (err) {
			console.error(err)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		loadData()
	}, [])

	const handleSaveItem = async (e) => {
		e.preventDefault()
		setSaving(true)
		try {
			if (editingItem.id) {
				const res = await updateTestimonial(editingItem.id, editingItem)
				const updated = res.data || editingItem
				setTestimonials(testimonials.map(t => t.id === editingItem.id ? updated : t))
				showToast('Client review updated successfully!', 'success')
			} else {
				const res = await createTestimonial(editingItem)
				if (res.success) setTestimonials([...testimonials, res.data])
				showToast('New client review added successfully!', 'success')
			}
			setEditingItem(null)
		} catch (err) {
			showToast('Failed to save review: ' + err.message, 'error')
		} finally {
			setSaving(false)
		}
	}

	const handleDelete = (id, name) => {
		confirmAction({
			title: 'Delete Client Review?',
			message: `Are you sure you want to delete the review from "${name || 'this traveler'}"? This action cannot be undone.`,
			confirmText: 'Yes, Delete',
			onConfirm: async () => {
				try {
					await deleteTestimonial(id)
					setTestimonials(prev => prev.filter(t => t.id !== id))
					showToast('Client review deleted successfully', 'success')
				} catch (err) {
					showToast('Delete failed: ' + err.message, 'error')
				}
			}
		})
	}

	return (
		<AdminLayout title="Client Stories (Reviews &amp; Testimonials)">
			{/* Reviews List & Add Button */}
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
				<div>
					<h3 style={{ fontSize: '17px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
						<IconTestimonials size={18} color="#16a34a" />
						<span>Customer Reviews ({testimonials.length})</span>
					</h3>
				</div>
				<button
					onClick={() => setEditingItem({
						name: '',
						role: '',
						text: '',
						rating: 5,
						order: testimonials.length + 1
					})}
					style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '9px 18px', borderRadius: '10px', fontWeight: '800', fontSize: '13px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
				>
					<IconPlus size={15} />
					<span>Add New Client Story</span>
				</button>
			</div>

			{loading ? (
				<div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading client reviews...</div>
			) : (
				<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
					{testimonials.map(item => (
						<div key={item.id} style={{ background: '#ffffff', borderRadius: '18px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
							<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
								<div>
									<h4 style={{ margin: 0, fontSize: '16.5px', fontWeight: '800', color: '#0f172a' }}>{item.name}</h4>
									{item.role && (
										<span style={{ fontSize: '12px', color: '#d97706', fontWeight: '700' }}>{item.role}</span>
									)}
								</div>
								<div style={{ display: 'flex', gap: '2px' }}>
									{[...Array(item.rating || 5)].map((_, i) => (
										<IconStar key={i} size={14} color="#E0A21B" filled />
									))}
								</div>
							</div>

							<p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6, fontStyle: 'italic', margin: '0 0 16px', background: '#f8fafc', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
								{item.text}
							</p>

							<div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
								<button onClick={() => setEditingItem({ ...item })} style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', fontWeight: '700', fontSize: '12px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
									<IconEdit size={12} color="#ffffff" />
									<span>Edit</span>
								</button>
								<button onClick={() => handleDelete(item.id, item.name)} style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '6px 10px', borderRadius: '6px', fontWeight: '700', fontSize: '12px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}>
									<IconTrash size={12} color="#dc2626" />
								</button>
							</div>
						</div>
					))}
				</div>
			)}

			{/* EDIT MODAL */}
			{editingItem && (
				<div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
					<div style={{ background: '#ffffff', borderRadius: '20px', maxWidth: '520px', width: '100%', padding: '28px', boxShadow: '0 20px 50px rgba(0,0,0,0.15)' }}>
						<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
							<h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
								{editingItem.id ? 'Edit Client Story' : 'Add Client Story'}
							</h3>
							<button onClick={() => setEditingItem(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
								<IconClose size={20} />
							</button>
						</div>

						<form onSubmit={handleSaveItem} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
							<div>
								<label style={labelStyle}>Customer Name *</label>
								<input type="text" required value={editingItem.name} onChange={e => setEditingItem({ ...editingItem, name: e.target.value })} style={inputStyle} placeholder="e.g. Priya &amp; Rajesh Sharma" />
							</div>

							<div>
								<label style={labelStyle}>Holiday Journey / Role (Optional)</label>
								<input type="text" value={editingItem.role || ''} onChange={e => setEditingItem({ ...editingItem, role: e.target.value })} style={inputStyle} placeholder="e.g. Honeymoon in Switzerland &amp; Paris" />
							</div>

							<div>
								<label style={labelStyle}>Star Rating (1 to 5)</label>
								<select value={editingItem.rating} onChange={e => setEditingItem({ ...editingItem, rating: parseInt(e.target.value) })} style={inputStyle}>
									<option value={5}>5 Stars</option>
									<option value={4}>4 Stars</option>
									<option value={3}>3 Stars</option>
									<option value={2}>2 Stars</option>
									<option value={1}>1 Star</option>
								</select>
							</div>

							<div>
								<label style={labelStyle}>Customer Review Quote *</label>
								<textarea rows="4" required value={editingItem.text} onChange={e => setEditingItem({ ...editingItem, text: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Write their testimonial feedback..." />
							</div>

							<div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
								<button type="button" onClick={() => setEditingItem(null)} style={{ padding: '8px 16px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: '700', color: '#475569', cursor: 'pointer' }}>Cancel</button>
								<button type="submit" disabled={saving} style={{ padding: '8px 20px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '800', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
									<IconSave size={14} />
									<span>{saving ? 'Saving...' : 'Save Review'}</span>
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
