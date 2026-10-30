import React, { useEffect, useState } from 'react'
import AdminLayout from './AdminLayout'
import { fetchInquiries, fetchPackages, updateInquiryStatus, deleteInquiry } from '@/services/api'
import { useToast } from '@/context/ToastContext'
import {
	IconPackages,
	IconInquiries,
	IconEye,
	IconWhatsApp,
	IconTrash,
	IconClose
} from '@/components/Icons'

const isContactSource = (source = '') => {
	const s = (source || '').toLowerCase()
	return s.includes('contact') || s.includes('plan my trip') || s.includes('plan-my-trip') || s.includes('general inquiry')
}

const isDateString = (val = '') => /^\d{4}-\d{2}-\d{2}$/.test(String(val || '').trim())

const findMatchingPackage = (inq, packages = []) => {
	if (!inq || !Array.isArray(packages) || packages.length === 0) return null
	const candidates = [inq.packageName, inq.destination]
		.filter(Boolean)
		.map(s => String(s).trim().toLowerCase())

	for (const query of candidates) {
		if (!query) continue
		const exact = packages.find(p =>
			(p.title || '').trim().toLowerCase() === query ||
			(p.shortTitle || '').trim().toLowerCase() === query ||
			(p.destination || '').trim().toLowerCase() === query ||
			(p.slug || '').trim().toLowerCase() === query
		)
		if (exact) return exact

		const partial = packages.find(p => {
			const title = (p.title || '').trim().toLowerCase()
			const shortTitle = (p.shortTitle || '').trim().toLowerCase()
			const dest = (p.destination || '').trim().toLowerCase()
			const prefix = title.split(/[–—\-:]/)[0].replace(/\bprogram\b/g, '').trim()
			return (
				(title && (query.includes(title) || title.includes(query))) ||
				(shortTitle && (query.includes(shortTitle) || shortTitle.includes(query))) ||
				(dest && (query.includes(dest) || dest.includes(query))) ||
				(prefix && prefix.length >= 3 && query.includes(prefix))
			)
		})
		if (partial) return partial
	}
	return null
}

const isDestinationOnlyInquiry = (inq, matchedPkg) => {
	if (!inq) return false
	const src = (inq.source || '').toLowerCase()
	if (src.includes('destination')) return true
	if (!inq.packageName && inq.destination && !matchedPkg) return true
	return false
}

const resolveInquiryDuration = (inq, matchedPkg) => {
	if (!inq) return 'Customizable'
	if (matchedPkg?.duration) {
		return matchedPkg.duration
	}
	const rawDur = String(inq.duration || '').trim()
	if (rawDur && !isDateString(rawDur)) {
		return rawDur
	}
	const rawTravelDate = String(inq.travelDate || '').trim()
	if (rawTravelDate && !isDateString(rawTravelDate)) {
		return rawTravelDate
	}
	return 'Customizable'
}

export default function AdminInquiries() {
	const { showToast, confirmAction } = useToast()
	const [inquiries, setInquiries] = useState([])
	const [packages, setPackages] = useState([])
	const [loading, setLoading] = useState(true)
	const [activeTab, setActiveTab] = useState('package') // 'package' | 'contact'
	const [filterStatus, setFilterStatus] = useState('all')
	const [selectedInquiry, setSelectedInquiry] = useState(null)

	const loadInquiries = async () => {
		try {
			setLoading(true)
			const [inqRes, pkgRes] = await Promise.all([
				fetchInquiries(''),
				fetchPackages({ activeOnly: 'false' }).catch(() => ({ success: false, data: [] }))
			])
			if (inqRes.success && inqRes.data) {
				setInquiries(inqRes.data)
			}
			if (pkgRes.success && Array.isArray(pkgRes.data)) {
				setPackages(pkgRes.data)
			}
		} catch (err) {
			console.error('Error fetching inquiries:', err)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		loadInquiries()
	}, [])

	const handleStatusChange = async (id, newStatus) => {
		try {
			await updateInquiryStatus(id, newStatus)
			setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, status: newStatus } : inq))
			showToast(`Status updated to "${newStatus}"`, 'success')
		} catch (err) {
			showToast('Failed to update status: ' + err.message, 'error')
		}
	}

	const handleDelete = (id, name) => {
		confirmAction({
			title: 'Delete Customer Enquiry?',
			message: `Are you sure you want to delete the enquiry from "${name || 'this customer'}"? This action cannot be undone.`,
			confirmText: 'Yes, Delete',
			onConfirm: async () => {
				try {
					await deleteInquiry(id)
					setInquiries(prev => prev.filter(inq => inq.id !== id))
					if (selectedInquiry?.id === id) setSelectedInquiry(null)
					showToast(`Enquiry from "${name}" deleted successfully`, 'success')
				} catch (err) {
					showToast(err.message || 'Failed to delete enquiry', 'error')
				}
			}
		})
	}

	const packageInquiriesAll = inquiries.filter(inq => !isContactSource(inq.source))
	const contactInquiriesAll = inquiries.filter(inq => isContactSource(inq.source))

	const currentTabList = activeTab === 'contact' ? contactInquiriesAll : packageInquiriesAll
	const filteredInquiries = filterStatus === 'all'
		? currentTabList
		: currentTabList.filter(inq => inq.status === filterStatus)

	const statusOptions = [
		{ value: 'all', label: 'All' },
		{ value: 'new', label: 'New' },
		{ value: 'contacted', label: 'Contacted' },
		{ value: 'in-progress', label: 'In Progress' },
		{ value: 'converted', label: 'Converted' },
		{ value: 'closed', label: 'Closed' }
	]

	const statusColors = {
		new: { bg: '#fef2f2', text: '#dc2626', border: '#fecaca' },
		contacted: { bg: '#fefce8', text: '#ca8a04', border: '#fef08a' },
		'in-progress': { bg: '#eff6ff', text: '#2563eb', border: '#bfdbfe' },
		converted: { bg: '#f0fdf4', text: '#16a34a', border: '#bbf7d0' },
		closed: { bg: '#f1f5f9', text: '#64748b', border: '#e2e8f0' }
	}

	const selectedMatchedPkg = selectedInquiry ? findMatchingPackage(selectedInquiry, packages) : null
	const selectedIsDest = selectedInquiry ? isDestinationOnlyInquiry(selectedInquiry, selectedMatchedPkg) : false
	const selectedResolvedDuration = selectedInquiry ? resolveInquiryDuration(selectedInquiry, selectedMatchedPkg) : ''
	const selectedPrimaryLabel = selectedIsDest ? 'Destination' : 'Package Name'
	const selectedPrimaryValue = selectedInquiry
		? (selectedIsDest
			? (selectedInquiry.destination || selectedInquiry.packageName || 'Custom Destination')
			: (selectedInquiry.packageName || selectedMatchedPkg?.title || selectedInquiry.destination || 'Custom Holiday Package'))
		: ''

	return (
		<AdminLayout title="Customer Enquiries &amp; Leads">
			{/* Top 2 Main Category Tabs: Package Enquiries vs Contact Enquiries */}
			<div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
				<button
					type="button"
					onClick={() => setActiveTab('package')}
					style={{
						padding: '11px 22px',
						borderRadius: '12px',
						border: activeTab === 'package' ? 'none' : '1px solid #cbd5e1',
						background: activeTab === 'package' ? '#16a34a' : '#ffffff',
						color: activeTab === 'package' ? '#ffffff' : '#475569',
						fontWeight: '800',
						fontSize: '13.5px',
						cursor: 'pointer',
						display: 'inline-flex',
						alignItems: 'center',
						gap: '8px',
						boxShadow: activeTab === 'package' ? '0 4px 14px rgba(22,163,74,0.25)' : '0 2px 6px rgba(0,0,0,0.02)',
						transition: 'all 0.2s ease'
					}}
				>
					<IconPackages size={17} />
					<span>Package &amp; Tour Enquiries ({packageInquiriesAll.length})</span>
				</button>

				<button
					type="button"
					onClick={() => setActiveTab('contact')}
					style={{
						padding: '11px 22px',
						borderRadius: '12px',
						border: activeTab === 'contact' ? 'none' : '1px solid #cbd5e1',
						background: activeTab === 'contact' ? '#16a34a' : '#ffffff',
						color: activeTab === 'contact' ? '#ffffff' : '#475569',
						fontWeight: '800',
						fontSize: '13.5px',
						cursor: 'pointer',
						display: 'inline-flex',
						alignItems: 'center',
						gap: '8px',
						boxShadow: activeTab === 'contact' ? '0 4px 14px rgba(22,163,74,0.25)' : '0 2px 6px rgba(0,0,0,0.02)',
						transition: 'all 0.2s ease'
					}}
				>
					<IconInquiries size={17} />
					<span>Contact Page Enquiries ({contactInquiriesAll.length})</span>
				</button>
			</div>

			{/* Status Filter Bar */}
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
				<div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
					{statusOptions.map(opt => {
						const countForStatus = opt.value === 'all'
							? currentTabList.length
							: currentTabList.filter(i => i.status === opt.value).length
						return (
							<button
								key={opt.value}
								type="button"
								onClick={() => setFilterStatus(opt.value)}
								style={{
									padding: '7px 14px',
									borderRadius: '10px',
									border: filterStatus === opt.value ? 'none' : '1px solid #cbd5e1',
									background: filterStatus === opt.value ? '#0f172a' : '#ffffff',
									color: filterStatus === opt.value ? '#fde047' : '#64748b',
									fontWeight: '700',
									fontSize: '12.5px',
									cursor: 'pointer',
									transition: 'all 0.2s ease'
								}}
							>
								{opt.label} ({countForStatus})
							</button>
						)
					})}
				</div>

				<span style={{ fontSize: '12.5px', color: '#64748b', fontWeight: '600' }}>
					{activeTab === 'contact'
						? 'Showing enquiries submitted via the Contact Us page'
						: 'Showing enquiries from Tour Packages, Destinations & Enquiry Modals'}
				</span>
			</div>

			{/* Enquiries Table Card */}
			<div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
				{loading ? (
					<div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>Loading customer enquiries...</div>
				) : filteredInquiries.length === 0 ? (
					<div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>
						No {activeTab === 'contact' ? 'Contact Page' : 'Package'} enquiries found in this category.
					</div>
				) : (
					<div style={{ overflowX: 'auto' }}>
						<table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
							<thead>
								<tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
									<th style={{ padding: '12px 14px', fontWeight: '700' }}>CUSTOMER</th>
									<th style={{ padding: '12px 14px', fontWeight: '700' }}>WHATSAPP NO</th>
									<th style={{ padding: '12px 14px', fontWeight: '700' }}>
										{activeTab === 'contact' ? 'ENQUIRY TOPIC / PACKAGE' : 'PACKAGE & DESTINATION'}
									</th>
									<th style={{ padding: '12px 14px', fontWeight: '700' }}>STATUS</th>
									<th style={{ padding: '12px 14px', fontWeight: '700', textAlign: 'right' }}>ACTIONS</th>
								</tr>
							</thead>
							<tbody>
								{filteredInquiries.map((inq) => {
									const st = statusColors[inq.status] || statusColors.new
									const matchedPkg = findMatchingPackage(inq, packages)
									const isDest = isDestinationOnlyInquiry(inq, matchedPkg)
									const displayTitle = isDest
										? (inq.destination || inq.packageName || 'General Inquiry')
										: (inq.packageName || matchedPkg?.title || inq.destination || 'General Inquiry')
									const resolvedDur = resolveInquiryDuration(inq, matchedPkg)
									const waPhone = (inq.phone || '').replace(/[^0-9]/g, '')
									const waLink = `https://wa.me/${waPhone.length === 10 ? '91' + waPhone : waPhone}?text=${encodeURIComponent(`Hi ${inq.name}, greetings from Golden Travels Coimbatore! Regarding your enquiry for ${displayTitle}${resolvedDur && resolvedDur !== 'Customizable' ? ` (${resolvedDur})` : ''}:`)}`

									return (
										<tr key={inq.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
											<td style={{ padding: '14px', fontWeight: '700', color: '#0f172a' }}>
												{inq.name}
												{inq.email && <span style={{ display: 'block', fontSize: '11.5px', color: '#64748b', fontWeight: '500' }}>{inq.email}</span>}
											</td>
											<td style={{ padding: '14px', color: '#475569', fontWeight: '600' }}>
												{inq.phone}
											</td>
											<td style={{ padding: '14px' }}>
												<div style={{ color: '#0f172a', fontWeight: '800', fontSize: '13.5px', lineHeight: '1.35' }}>
													{displayTitle}
												</div>
											</td>
											<td style={{ padding: '14px' }}>
												<select
													value={inq.status}
													onChange={(e) => handleStatusChange(inq.id, e.target.value)}
													style={{
														padding: '6px 10px',
														borderRadius: '8px',
														fontSize: '11.5px',
														fontWeight: '800',
														textTransform: 'uppercase',
														background: st.bg,
														color: st.text,
														border: `1px solid ${st.border}`,
														cursor: 'pointer',
														outline: 'none'
													}}
												>
													<option value="new" style={{ background: '#ffffff', color: '#0f172a' }}>New</option>
													<option value="contacted" style={{ background: '#ffffff', color: '#0f172a' }}>Contacted</option>
													<option value="in-progress" style={{ background: '#ffffff', color: '#0f172a' }}>In Progress</option>
													<option value="converted" style={{ background: '#ffffff', color: '#0f172a' }}>Converted</option>
													<option value="closed" style={{ background: '#ffffff', color: '#0f172a' }}>Closed</option>
												</select>
											</td>
											<td style={{ padding: '14px', textAlign: 'right' }}>
												<div style={{ display: 'inline-flex', gap: '8px', alignItems: 'center' }}>
													<button
														type="button"
														onClick={() => setSelectedInquiry(inq)}
														title="View Enquiry Details"
														style={{
															background: '#f1f5f9',
															color: '#475569',
															border: '1px solid #e2e8f0',
															width: '34px',
															height: '34px',
															borderRadius: '8px',
															cursor: 'pointer',
															display: 'inline-flex',
															alignItems: 'center',
															justifyContent: 'center'
														}}
													>
														<IconEye size={15} color="#475569" />
													</button>
													<a
														href={waLink}
														target="_blank"
														rel="noopener noreferrer"
														title="Chat on WhatsApp"
														style={{
															background: '#25D366',
															color: '#fff',
															width: '34px',
															height: '34px',
															borderRadius: '8px',
															textDecoration: 'none',
															display: 'inline-flex',
															alignItems: 'center',
															justifyContent: 'center',
															boxShadow: '0 2px 6px rgba(37,211,102,0.25)'
														}}
													>
														<IconWhatsApp size={17} color="#ffffff" />
													</a>
													<button
														type="button"
														onClick={() => handleDelete(inq.id, inq.name)}
														title="Delete Enquiry"
														style={{
															background: '#fef2f2',
															border: '1px solid #fecaca',
															color: '#dc2626',
															width: '34px',
															height: '34px',
															borderRadius: '8px',
															cursor: 'pointer',
															display: 'inline-flex',
															alignItems: 'center',
															justifyContent: 'center'
														}}
													>
														<IconTrash size={15} color="#dc2626" />
													</button>
												</div>
											</td>
										</tr>
									)
								})}
							</tbody>
						</table>
					</div>
				)}
			</div>

			{/* Modal Details View */}
			{selectedInquiry && (
				<div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
					<div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', maxWidth: '540px', width: '100%', padding: '28px', color: '#0f172a', boxShadow: '0 25px 60px rgba(0,0,0,0.15)', maxHeight: '90vh', overflowY: 'auto' }}>
						<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '14px' }}>
							<div>
								<span style={{ fontSize: '11px', color: '#d97706', fontWeight: '800', textTransform: 'uppercase' }}>Enquiry #{selectedInquiry.id} Details</span>
								<h3 style={{ margin: '2px 0 0', fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>{selectedInquiry.name}</h3>
							</div>
							<button onClick={() => setSelectedInquiry(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
								<IconClose size={20} />
							</button>
						</div>

						<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
							<div>
								<span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>WhatsApp Number</span>
								<p style={{ margin: '4px 0 0', fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>{selectedInquiry.phone}</p>
							</div>
							<div>
								<span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Email</span>
								<p style={{ margin: '4px 0 0', fontSize: '14px', color: '#475569' }}>{selectedInquiry.email || 'N/A'}</p>
							</div>
							<div>
								<span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>{selectedPrimaryLabel}</span>
								<p style={{ margin: '4px 0 0', fontSize: '14px', color: selectedIsDest ? '#d97706' : '#16a34a', fontWeight: '800' }}>
									{selectedPrimaryValue}
								</p>
							</div>
							<div>
								<span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Days / Nights</span>
								<p style={{ margin: '4px 0 0', fontSize: '14px', color: '#0f172a', fontWeight: '700' }}>{selectedResolvedDuration}</p>
							</div>
						</div>

						{selectedInquiry.message && (
							<div style={{ marginBottom: '20px', background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
								<span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Customer Message</span>
								<p style={{ margin: '6px 0 0', fontSize: '13.5px', color: '#334155', lineHeight: '1.5' }}>{selectedInquiry.message}</p>
							</div>
						)}

						<div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
							<button onClick={() => setSelectedInquiry(null)} style={{ padding: '9px 22px', background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#475569', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' }}>
								Close
							</button>
						</div>
					</div>
				</div>
			)}
		</AdminLayout>
	)
}
