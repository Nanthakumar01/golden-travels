import React, { useEffect, useState } from 'react'
import AdminLayout from './AdminLayout'
import { fetchFaqs, updateFaq, createFaq, deleteFaq, fetchSections, updateSection } from '@/services/api'
import { useToast } from '@/context/ToastContext'
import ImageUploader from '@/components/ImageUploader'
import {
	IconSave,
	IconFaqs,
	IconPlus,
	IconEdit,
	IconTrash,
	IconClose
} from '@/components/Icons'

export default function AdminFaqs() {
	const { showToast, confirmAction } = useToast()
	const [faqs, setFaqs] = useState([])
	const [sectionHeader, setSectionHeader] = useState({
		badge: 'Got Questions?',
		title: 'Frequently Asked Questions',
		bgImage: '/assets/images/tour/tour-details.jpg'
	})
	const [loading, setLoading] = useState(true)
	const [editingFaq, setEditingFaq] = useState(null)
	const [saving, setSaving] = useState(false)
	const [savingSection, setSavingSection] = useState(false)

	const loadData = async () => {
		try {
			setLoading(true)
			const [resFaqs, resSections] = await Promise.all([
				fetchFaqs(),
				fetchSections()
			])
			if (resFaqs.success) setFaqs(resFaqs.data || [])
			if (resSections && resSections.success && Array.isArray(resSections.data)) {
				const faqSec = resSections.data.find(s => s.sectionKey === 'faq' || s.sectionKey === 'faqs')
				if (faqSec) {
					setSectionHeader({
						badge: faqSec.badge || 'Got Questions?',
						title: faqSec.title || 'Frequently Asked Questions',
						bgImage: faqSec.bgImage || '/assets/images/tour/tour-details.jpg'
					})
				}
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

	const handleSaveSection = async (e) => {
		if (e) e.preventDefault()
		setSavingSection(true)
		try {
			await updateSection('faq', {
				badge: sectionHeader.badge,
				title: sectionHeader.title,
				bgImage: sectionHeader.bgImage
			})
			showToast('FAQ Section details & Image updated successfully!', 'success')
		} catch (err) {
			showToast('Failed to save section image: ' + err.message, 'error')
		} finally {
			setSavingSection(false)
		}
	}

	const handleSaveFaq = async (e) => {
		e.preventDefault()
		setSaving(true)
		try {
			if (editingFaq.id) {
				await updateFaq(editingFaq.id, editingFaq)
				setFaqs(faqs.map(f => f.id === editingFaq.id ? editingFaq : f))
				showToast('FAQ updated successfully!', 'success')
			} else {
				const res = await createFaq(editingFaq)
				if (res.success) setFaqs([...faqs, res.data])
				showToast('New FAQ created successfully!', 'success')
			}
			setEditingFaq(null)
		} catch (err) {
			showToast('Failed to save FAQ: ' + err.message, 'error')
		} finally {
			setSaving(false)
		}
	}

	const handleDelete = (id, question) => {
		confirmAction({
			title: 'Delete FAQ Question?',
			message: `Are you sure you want to delete "${question || 'this question'}"? This action cannot be undone.`,
			confirmText: 'Yes, Delete',
			onConfirm: async () => {
				try {
					await deleteFaq(id)
					setFaqs(prev => prev.filter(f => f.id !== id))
					showToast('FAQ deleted successfully', 'success')
				} catch (err) {
					showToast('Delete failed: ' + err.message, 'error')
				}
			}
		})
	}

	return (
		<AdminLayout title="Frequently Asked Questions (FAQ )">
			{/* Section Header & Side Image Card */}
			<div style={{ background: '#ffffff', borderRadius: '18px', border: '1px solid #e2e8f0', padding: '24px', marginBottom: '28px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '14px' }}>
					<div>
						<h3 style={{ fontSize: '16.5px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
							<span>FAQ Section Header &amp; Side Image</span>
						</h3>
						<p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
							Update the featured photo shown next to the FAQ accordion on the homepage.
						</p>
					</div>
					<button
						type="button"
						onClick={handleSaveSection}
						disabled={savingSection}
						style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '9px 20px', borderRadius: '10px', fontWeight: '800', fontSize: '13px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', boxShadow: '0 2px 8px rgba(22,163,74,0.25)' }}
					>
						<IconSave size={15} />
						<span>{savingSection ? 'Saving...' : 'Save Section Details'}</span>
					</button>
				</div>

				<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', alignItems: 'start' }}>
					<div>
						<div style={{ marginBottom: '14px' }}>
							<label style={labelStyle}>Section Badge / Subtitle</label>
							<input
								type="text"
								value={sectionHeader.badge}
								onChange={e => setSectionHeader({ ...sectionHeader, badge: e.target.value })}
								style={inputStyle}
								placeholder="e.g. Got Questions?"
							/>
						</div>
						<div>
							<label style={labelStyle}>Section Title</label>
							<input
								type="text"
								value={sectionHeader.title}
								onChange={e => setSectionHeader({ ...sectionHeader, title: e.target.value })}
								style={inputStyle}
								placeholder="e.g. Frequently Asked Questions"
							/>
						</div>
					</div>

					<div>
						<ImageUploader
							label="FAQ Featured Side Photo *"
							value={sectionHeader.bgImage}
							onChange={url => setSectionHeader({ ...sectionHeader, bgImage: url })}
							placeholder="Upload FAQ side image (e.g. /assets/images/tour/tour-details.jpg)"
							resolution="Recommended: 800 x 850 px or portrait travel photo"
							required={true}
						/>
					</div>
				</div>
			</div>

			{/* FAQ Questions List & Add Button */}
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
				<div>
					<h3 style={{ fontSize: '17px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
						<IconFaqs size={18} color="#16a34a" />
						<span>Questions &amp; Answers ({faqs.length})</span>
					</h3>
					<p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
						Accordion questions answered for customers on the homepage.
					</p>
				</div>
				<button
					onClick={() => setEditingFaq({
						question: '',
						answer: '',
						order: faqs.length + 1
					})}
					style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '9px 18px', borderRadius: '10px', fontWeight: '800', fontSize: '13px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
				>
					<IconPlus size={15} />
					<span>Add New FAQ</span>
				</button>
			</div>

			{loading ? (
				<div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading FAQs...</div>
			) : (
				<div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
					{faqs.map(faq => (
						<div key={faq.id} style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px 24px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
							<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '8px' }}>
								<h4 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#0f172a', flex: 1 }}>
									Q: {faq.question}
								</h4>
								<div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
									<button onClick={() => setEditingFaq({ ...faq })} style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '5px 12px', borderRadius: '6px', fontWeight: '700', fontSize: '12px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
										<IconEdit size={12} color="#ffffff" />
										<span>Edit</span>
									</button>
									<button onClick={() => handleDelete(faq.id, faq.question)} style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '5px 10px', borderRadius: '6px', fontWeight: '700', fontSize: '12px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}>
										<IconTrash size={12} color="#dc2626" />
									</button>
								</div>
							</div>
							<p style={{ margin: 0, fontSize: '13.5px', color: '#64748b', lineHeight: 1.6 }}>
								{faq.answer}
							</p>
						</div>
					))}
				</div>
			)}

			{/* EDIT MODAL */}
			{editingFaq && (
				<div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
					<div style={{ background: '#ffffff', borderRadius: '20px', maxWidth: '540px', width: '100%', padding: '28px', boxShadow: '0 20px 50px rgba(0,0,0,0.15)' }}>
						<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
							<h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
								{editingFaq.id ? 'Edit FAQ' : 'Add FAQ'}
							</h3>
							<button onClick={() => setEditingFaq(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
								<IconClose size={20} />
							</button>
						</div>

						<form onSubmit={handleSaveFaq} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
							<div>
								<label style={labelStyle}>Question *</label>
								<input type="text" required value={editingFaq.question} onChange={e => setEditingFaq({ ...editingFaq, question: e.target.value })} style={inputStyle} placeholder="e.g. Can I customize my tour package?" />
							</div>

							<div>
								<label style={labelStyle}>Answer *</label>
								<textarea rows="5" required value={editingFaq.answer} onChange={e => setEditingFaq({ ...editingFaq, answer: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Detailed, reassuring answer..." />
							</div>

							<div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
								<button type="button" onClick={() => setEditingFaq(null)} style={{ padding: '8px 16px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: '700', color: '#475569', cursor: 'pointer' }}>Cancel</button>
								<button type="submit" disabled={saving} style={{ padding: '8px 20px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '800', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
									<IconSave size={14} />
									<span>{saving ? 'Saving...' : 'Save FAQ'}</span>
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
