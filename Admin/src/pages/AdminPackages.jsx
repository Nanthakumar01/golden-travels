import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from './AdminLayout'
import { fetchPackages, deletePackage, updatePackage } from '@/services/api'
import { useToast } from '@/context/ToastContext'
import {
	IconPackages,
	IconPlus,
	IconLocation,
	IconEye,
	IconEdit,
	IconTrash
} from '@/components/Icons'

export default function AdminPackages() {
	const { showToast, confirmAction } = useToast()
	const [packages, setPackages] = useState([])
	const [loading, setLoading] = useState(true)
	const [search, setSearch] = useState('')
	const [filterType, setFilterType] = useState('ALL')

	const loadPackages = async () => {
		try {
			setLoading(true)
			const res = await fetchPackages({ activeOnly: 'false' })
			if (res.success && res.data) {
				setPackages(res.data)
			}
		} catch (err) {
			console.error('Failed to load packages:', err)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		loadPackages()
	}, [])

	const handleDelete = (id, title) => {
		confirmAction({
			title: 'Delete Tour Package?',
			message: `Are you sure you want to delete "${title || 'this tour package'}"? This action cannot be undone.`,
			confirmText: 'Yes, Delete',
			onConfirm: async () => {
				try {
					await deletePackage(id)
					setPackages(prev => prev.filter(p => p.id !== id))
					showToast(`Package "${title}" deleted successfully`, 'success')
				} catch (err) {
					showToast(err.message || 'Failed to delete package', 'error')
				}
			}
		})
	}

	const handleToggleExplore = async (pkg) => {
		const currentVal = pkg.showInExplore !== false && pkg.showInExplore !== 0 && pkg.showInExplore !== '0'
		const newVal = !currentVal
		try {
			await updatePackage(pkg.id, { showInExplore: newVal })
			setPackages(prev => prev.map(p => p.id === pkg.id ? { ...p, showInExplore: newVal } : p))
			showToast(`"${pkg.title}" is now ${newVal ? 'shown' : 'hidden'} in Explore Slider`, 'success')
		} catch (err) {
			showToast(err.message || 'Failed to update visibility', 'error')
		}
	}

	const handleToggleExclusive = async (pkg) => {
		const currentVal = pkg.showInExclusive !== false && pkg.showInExclusive !== 0 && pkg.showInExclusive !== '0'
		const newVal = !currentVal
		try {
			await updatePackage(pkg.id, { showInExclusive: newVal })
			setPackages(prev => prev.map(p => p.id === pkg.id ? { ...p, showInExclusive: newVal } : p))
			showToast(`"${pkg.title}" is now ${newVal ? 'shown' : 'hidden'} in Exclusive Packages Carousel`, 'success')
		} catch (err) {
			showToast(err.message || 'Failed to update visibility', 'error')
		}
	}

	const filteredPackages = packages.filter(p => {
		const matchesSearch = (p.title && p.title.toLowerCase().includes(search.toLowerCase())) ||
			(p.destination && p.destination.toLowerCase().includes(search.toLowerCase())) ||
			(p.region && p.region.toLowerCase().includes(search.toLowerCase()))
		const matchesType = filterType === 'ALL' || p.type === filterType
		return matchesSearch && matchesType
	})

	return (
		<AdminLayout title="Tour Packages Management">
			{/* Top Bar: Search, Filter, Add New Button */}
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
						<div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', flex: 1, maxWidth: '600px' }}>
							{/* Search */}
							<input
								type="text"
								placeholder="Search by tour name, destination..."
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								style={{ flex: 1, minWidth: '240px', padding: '12px 16px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', color: '#0f172a', fontSize: '13.5px', outline: 'none', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}
							/>

							{/* Type Filter */}
							<div style={{ display: 'flex', background: '#ffffff', borderRadius: '12px', padding: '4px', border: '1px solid #cbd5e1', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
								{['ALL', 'INTERNATIONAL', 'DOMESTIC'].map((t) => (
									<button
										key={t}
										type="button"
										onClick={() => setFilterType(t)}
										style={{
											padding: '6px 14px',
											borderRadius: '8px',
											border: 'none',
											background: filterType === t ? '#16a34a' : 'transparent',
											color: filterType === t ? '#fff' : '#64748b',
											fontWeight: '700',
											fontSize: '12px',
											cursor: 'pointer',
											transition: 'all 0.2s ease'
										}}
									>
										{t === 'ALL' ? 'All Tours' : t === 'INTERNATIONAL' ? 'Intl' : 'Domestic'}
									</button>
								))}
							</div>
						</div>

						<Link
							to="/packages/new"
							style={{
								display: 'inline-flex',
								alignItems: 'center',
								gap: '8px',
								background: 'linear-gradient(135deg, #16a34a, #0f7a37)',
								color: '#fff',
								padding: '12px 22px',
								borderRadius: '12px',
								textDecoration: 'none',
								fontWeight: '800',
								fontSize: '14px',
								boxShadow: '0 4px 16px rgba(22,163,74,0.25)'
							}}
						>
							<IconPlus size={16} />
							<span>Add New Tour Package</span>
						</Link>
					</div>

					{/* Packages Table Card */}
					<div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
						{loading ? (
							<div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>Loading packages...</div>
						) : filteredPackages.length === 0 ? (
							<div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>No tour packages match your search filter.</div>
						) : (
							<div style={{ overflowX: 'auto' }}>
								<table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
									<thead>
										<tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
											<th style={{ padding: '12px 14px', fontWeight: '700', width: '70px' }}>THUMB</th>
											<th style={{ padding: '12px 14px', fontWeight: '700' }}>TITLE &amp; DESTINATION</th>
											<th style={{ padding: '12px 14px', fontWeight: '700' }}>TYPE</th>
											<th style={{ padding: '12px 14px', fontWeight: '700' }}>DURATION</th>
											<th style={{ padding: '12px 14px', fontWeight: '700' }}>EXPLORE SLIDER</th>
											<th style={{ padding: '12px 14px', fontWeight: '700' }}>EXCLUSIVE CAROUSEL</th>
											<th style={{ padding: '12px 14px', fontWeight: '700', textAlign: 'right' }}>ACTIONS</th>
										</tr>
									</thead>
									<tbody>
										{filteredPackages.map((pkg) => (
											<tr key={pkg.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
												<td style={{ padding: '14px' }}>
													<img
														src={pkg.image || "/assets/images/packages/vietnam.jpg"}
														alt=""
														loading="lazy"
														decoding="async"
														style={{ width: '56px', height: '42px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #e2e8f0' }}
														onError={e => { e.target.src = '/assets/images/packages/vietnam.jpg' }}
													/>
												</td>
												<td style={{ padding: '14px', maxWidth: '300px' }}>
													<Link to={`/packages/edit/${pkg.id}`} style={{ color: '#0f172a', fontWeight: '700', textDecoration: 'none', display: 'block', marginBottom: '2px' }}>
														{pkg.title}
													</Link>
													<span style={{ fontSize: '11.5px', color: '#64748b', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
														<IconLocation size={12} color="#64748b" />
														<span>{pkg.destination || pkg.region}</span>
													</span>
												</td>
												<td style={{ padding: '14px' }}>
													<span style={{
														display: 'inline-block',
														padding: '3px 8px',
														borderRadius: '8px',
														fontSize: '11px',
														fontWeight: '800',
														background: pkg.type === 'DOMESTIC' ? '#f0fdf4' : '#fefce8',
														color: pkg.type === 'DOMESTIC' ? '#16a34a' : '#b45309',
														border: `1px solid ${pkg.type === 'DOMESTIC' ? '#bbf7d0' : '#fef08a'}`
													}}>
														{pkg.type}
													</span>
												</td>
												<td style={{ padding: '14px', color: '#475569', fontWeight: '500' }}>
													{pkg.duration}
												</td>
												<td style={{ padding: '14px' }}>
													<button
														type="button"
														onClick={() => handleToggleExplore(pkg)}
														title="Click to toggle visibility in Explore Slider on Home page"
														style={{
															border: `1.5px solid ${(pkg.showInExplore !== false && pkg.showInExplore !== 0 && pkg.showInExplore !== '0') ? '#86efac' : '#cbd5e1'}`,
															background: (pkg.showInExplore !== false && pkg.showInExplore !== 0 && pkg.showInExplore !== '0') ? '#f0fdf4' : '#f8fafc',
															color: (pkg.showInExplore !== false && pkg.showInExplore !== 0 && pkg.showInExplore !== '0') ? '#16a34a' : '#64748b',
															borderRadius: '20px',
															padding: '4px 10px',
															fontSize: '11.5px',
															fontWeight: '700',
															cursor: 'pointer',
															display: 'inline-flex',
															alignItems: 'center',
															gap: '5px',
															transition: 'all 0.2s ease'
														}}
													>
														{(pkg.showInExplore !== false && pkg.showInExplore !== 0 && pkg.showInExplore !== '0') ? (
															<>
																<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
																<span>In Explore</span>
															</>
														) : (
															<>
																<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
																<span>Hidden</span>
															</>
														)}
													</button>
												</td>
												<td style={{ padding: '14px' }}>
													<button
														type="button"
														onClick={() => handleToggleExclusive(pkg)}
														title="Click to toggle visibility in Exclusive Packages Carousel on Home page"
														style={{
															border: `1.5px solid ${(pkg.showInExclusive !== false && pkg.showInExclusive !== 0 && pkg.showInExclusive !== '0') ? '#86efac' : '#cbd5e1'}`,
															background: (pkg.showInExclusive !== false && pkg.showInExclusive !== 0 && pkg.showInExclusive !== '0') ? '#f0fdf4' : '#f8fafc',
															color: (pkg.showInExclusive !== false && pkg.showInExclusive !== 0 && pkg.showInExclusive !== '0') ? '#16a34a' : '#64748b',
															borderRadius: '20px',
															padding: '4px 10px',
															fontSize: '11.5px',
															fontWeight: '700',
															cursor: 'pointer',
															display: 'inline-flex',
															alignItems: 'center',
															gap: '5px',
															transition: 'all 0.2s ease'
														}}
													>
														{(pkg.showInExclusive !== false && pkg.showInExclusive !== 0 && pkg.showInExclusive !== '0') ? (
															<>
																<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
																<span>In Exclusive</span>
															</>
														) : (
															<>
																<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
																<span>Hidden</span>
															</>
														)}
													</button>
												</td>
												<td style={{ padding: '14px', textAlign: 'right' }}>
													<div style={{ display: 'inline-flex', gap: '8px' }}>
														<Link
															to={`/packages/edit/${pkg.id}`}
															title="Edit tour"
															style={{ padding: '6px 12px', background: '#16a34a', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontWeight: '700', fontSize: '12px', boxShadow: '0 2px 6px rgba(22,163,74,0.2)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
														>
															<IconEdit size={13} color="#ffffff" />
															<span>Edit</span>
														</Link>
														<button
															type="button"
															onClick={() => handleDelete(pkg.id, pkg.title)}
															title="Delete tour"
															style={{ padding: '6px 10px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#dc2626', cursor: 'pointer', fontSize: '12px', fontWeight: '700', display: 'inline-flex', alignItems: 'center' }}
														>
															<IconTrash size={13} color="#dc2626" />
														</button>
													</div>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						)}
					</div>
		</AdminLayout>
	)
}
