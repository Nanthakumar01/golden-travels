import React, { useEffect, useState } from 'react'
import AdminLayout from './AdminLayout'
import {
	fetchDestinationRegions,
	createDestinationRegion,
	updateDestinationRegion,
	deleteDestinationRegion,
	addCountryToRegion,
	deleteCountryFromRegion,
	fetchPackages
} from '@/services/api'
import { useToast } from '@/context/ToastContext'
import {
	IconDestinations,
	IconEdit,
	IconTrash,
	IconPlus,
	IconSave,
	IconClose,
	IconGlobe,
	IconFlag,
	IconPackages
} from '@/components/Icons'

export default function AdminDestinations() {
	const { showToast, confirmAction } = useToast()
	const [regions, setRegions] = useState([])
	const [packages, setPackages] = useState([])
	const [loading, setLoading] = useState(true)
	const [activeGroup, setActiveGroup] = useState('International') // 'International' or 'India'
	const [selectedRegionId, setSelectedRegionId] = useState(null)
	const [countrySearch, setCountrySearch] = useState('')

	// Quick add country input state
	const [newCountryInput, setNewCountryInput] = useState('')
	const [newCountrySlug, setNewCountrySlug] = useState('')
	const [addingCountry, setAddingCountry] = useState(false)

	// Modal states
	const [regionModal, setRegionModal] = useState(null) // null | { id?, group, name, countriesText, order }
	const [savingRegion, setSavingRegion] = useState(false)
	const [editingCountry, setEditingCountry] = useState(null) // null | { oldItem, newName, newSlug }

	const getCountryName = (c) => typeof c === 'object' && c ? (c.name || '') : String(c || '')
	const getCountrySlug = (c) => typeof c === 'object' && c ? (c.slug || '') : ''

	const loadData = async (preferredSelectedId = null) => {
		try {
			setLoading(true)
			const [res, pkgRes] = await Promise.all([
				fetchDestinationRegions(),
				fetchPackages({ activeOnly: 'false' }).catch(() => ({ success: false, data: [] }))
			])
			if (res.success && res.data) {
				setRegions(res.data)
				// Set default selected region
				if (preferredSelectedId) {
					setSelectedRegionId(preferredSelectedId)
				} else if (res.data.length > 0) {
					const firstInGroup = res.data.find(r => r.group === activeGroup) || res.data[0]
					setSelectedRegionId(firstInGroup ? firstInGroup.id : res.data[0].id)
				}
			}
			if (pkgRes && pkgRes.success && Array.isArray(pkgRes.data)) {
				setPackages(pkgRes.data)
			}
		} catch (err) {
			console.error(err)
			showToast('Failed to load destination regions: ' + err.message, 'error')
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		loadData()
	}, [])

	// When active group tab changes, switch selected region if current one is not in group
	const handleGroupChange = (grp) => {
		setActiveGroup(grp)
		const firstInGroup = regions.find(r => r.group === grp)
		if (firstInGroup) {
			setSelectedRegionId(firstInGroup.id)
		}
	}

	const currentGroupRegions = regions.filter(r => r.group === activeGroup)
	const selectedRegion = regions.find(r => r.id === selectedRegionId) || currentGroupRegions[0] || null

	// Countries of the selected region
	const selectedCountries = selectedRegion ? (Array.isArray(selectedRegion.countries) ? selectedRegion.countries : []) : []

	const filteredCountries = selectedCountries.filter(c => {
		const name = getCountryName(c)
		const slug = getCountrySlug(c)
		if (!countrySearch.trim()) return true
		const q = countrySearch.trim().toLowerCase()
		return name.toLowerCase().includes(q) || slug.toLowerCase().includes(q)
	})

	// Total statistics
	const intlRegions = regions.filter(r => r.group === 'International')
	const indiaRegions = regions.filter(r => r.group === 'India')
	const totalIntlCountries = intlRegions.reduce((sum, r) => sum + (Array.isArray(r.countries) ? r.countries.length : 0), 0)
	const totalIndiaCountries = indiaRegions.reduce((sum, r) => sum + (Array.isArray(r.countries) ? r.countries.length : 0), 0)

	// Quick Add Country
	const handleAddCountry = async (e) => {
		e.preventDefault()
		if (!newCountryInput.trim() || !selectedRegion) return

		setAddingCountry(true)
		try {
			const res = await addCountryToRegion(selectedRegion.id, {
				country: newCountryInput.trim(),
				slug: newCountrySlug.trim() || null
			})
			if (res.success && res.data) {
				setRegions(prev => prev.map(r => r.id === selectedRegion.id ? res.data : r))
				setNewCountryInput('')
				setNewCountrySlug('')
				showToast(`Added destination(s) to ${selectedRegion.name}!`, 'success')
			}
		} catch (err) {
			showToast('Error adding destination: ' + err.message, 'error')
		} finally {
			setAddingCountry(false)
		}
	}

	// Delete Country from Region
	const handleDeleteCountry = (countryItem) => {
		if (!selectedRegion) return
		const cName = getCountryName(countryItem)
		confirmAction({
			title: 'Remove Destination?',
			message: `Are you sure you want to remove "${cName}" from ${selectedRegion.name}?`,
			confirmText: 'Remove',
			onConfirm: async () => {
				try {
					const res = await deleteCountryFromRegion(selectedRegion.id, cName)
					if (res.success && res.data) {
						setRegions(prev => prev.map(r => r.id === selectedRegion.id ? res.data : r))
						showToast(`Removed "${cName}" successfully!`, 'success')
					}
				} catch (err) {
					showToast('Error removing destination: ' + err.message, 'error')
				}
			}
		})
	}

	// Save Edited Country Name & Package Link
	const handleSaveEditCountry = async (e) => {
		e.preventDefault()
		if (!editingCountry || !editingCountry.newName.trim() || !selectedRegion) return

		const targetOldName = getCountryName(editingCountry.oldItem).toLowerCase()
		const updatedList = selectedCountries.map(c => {
			const cName = getCountryName(c)
			if (cName.toLowerCase() === targetOldName) {
				return {
					name: editingCountry.newName.trim(),
					slug: editingCountry.newSlug.trim() || null
				}
			}
			return c
		})
		try {
			const res = await updateDestinationRegion(selectedRegion.id, { countries: updatedList })
			if (res.success && res.data) {
				setRegions(prev => prev.map(r => r.id === selectedRegion.id ? res.data : r))
				showToast(`Updated "${editingCountry.newName.trim()}"!`, 'success')
				setEditingCountry(null)
			}
		} catch (err) {
			showToast('Error updating country: ' + err.message, 'error')
		}
	}

	// Save Region (Create or Update)
	const handleSaveRegionModal = async (e) => {
		e.preventDefault()
		if (!regionModal.name.trim()) {
			showToast('Please enter a Region Name!', 'error')
			return
		}

		setSavingRegion(true)
		try {
			if (regionModal.id) {
				// Update Region
				const res = await updateDestinationRegion(regionModal.id, {
					name: regionModal.name.trim(),
					group: regionModal.group
				})
				if (res.success && res.data) {
					setRegions(prev => prev.map(r => r.id === regionModal.id ? res.data : r))
					showToast(`Region "${regionModal.name}" updated!`, 'success')
				}
			} else {
				// Create Region
				const countriesList = regionModal.countriesText
					? regionModal.countriesText.split(',').map(s => s.trim()).filter(Boolean)
					: []
				const res = await createDestinationRegion({
					name: regionModal.name.trim(),
					group: regionModal.group,
					countries: countriesList
				})
				if (res.success && res.data) {
					setRegions(prev => [...prev, res.data])
					setSelectedRegionId(res.data.id)
					setActiveGroup(res.data.group)
					showToast(`Region "${regionModal.name}" created!`, 'success')
				}
			}
			setRegionModal(null)
		} catch (err) {
			showToast('Failed to save region: ' + err.message, 'error')
		} finally {
			setSavingRegion(false)
		}
	}

	// Delete Region
	const handleDeleteRegion = (region) => {
		confirmAction({
			title: 'Delete Region?',
			message: `Are you sure you want to delete the region "${region.name}" and all its (${region.countries?.length || 0}) countries? This action cannot be undone.`,
			confirmText: 'Yes, Delete Region',
			onConfirm: async () => {
				try {
					const res = await deleteDestinationRegion(region.id)
					if (res.success) {
						setRegions(prev => prev.filter(r => r.id !== region.id))
						showToast(`Region "${region.name}" deleted!`, 'success')
						const remaining = regions.filter(r => r.id !== region.id && r.group === activeGroup)
						if (remaining.length > 0) setSelectedRegionId(remaining[0].id)
					}
				} catch (err) {
					showToast('Error deleting region: ' + err.message, 'error')
				}
			}
		})
	}

	return (
		<AdminLayout title="Destinations Hierarchy Manager">
			{/* Top Bar */}
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', flexWrap: 'wrap', gap: '14px' }}>
				<div>
					<h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
						<IconDestinations size={20} color="#16a34a" />
						<span>Destinations </span>
					</h3>
					
				</div>

				<button
					type="button"
					onClick={() => setRegionModal({ group: activeGroup, name: '', countriesText: '' })}
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
					<span>Add New Region</span>
				</button>
			</div>

			{/* Group Switcher Tabs: International vs Domestic */}
			<div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
				<button
					type="button"
					onClick={() => handleGroupChange('International')}
					style={{
						padding: '10px 22px',
						borderRadius: '12px',
						border: activeGroup === 'International' ? '2px solid #2563eb' : '1px solid #cbd5e1',
						background: activeGroup === 'International' ? '#2563eb' : '#ffffff',
						color: activeGroup === 'International' ? '#ffffff' : '#334155',
						fontWeight: '800',
						fontSize: '13.5px',
						cursor: 'pointer',
						display: 'inline-flex',
						alignItems: 'center',
						gap: '8px',
						boxShadow: activeGroup === 'International' ? '0 4px 12px rgba(37,99,235,0.2)' : 'none',
						transition: 'all 0.15s ease'
					}}
				>
					<span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
						<IconGlobe size={15} />
						<span>International</span>
					</span>
					<span style={{
						background: activeGroup === 'International' ? 'rgba(255,255,255,0.25)' : '#e2e8f0',
						color: activeGroup === 'International' ? '#ffffff' : '#475569',
						fontSize: '11px',
						padding: '2px 7px',
						borderRadius: '8px',
						fontWeight: '800'
					}}>
						{intlRegions.length} Regions · {totalIntlCountries} Destinations
					</span>
				</button>

				<button
					type="button"
					onClick={() => handleGroupChange('India')}
					style={{
						padding: '10px 22px',
						borderRadius: '12px',
						border: activeGroup === 'India' ? '2px solid #16a34a' : '1px solid #cbd5e1',
						background: activeGroup === 'India' ? '#16a34a' : '#ffffff',
						color: activeGroup === 'India' ? '#ffffff' : '#334155',
						fontWeight: '800',
						fontSize: '13.5px',
						cursor: 'pointer',
						display: 'inline-flex',
						alignItems: 'center',
						gap: '8px',
						boxShadow: activeGroup === 'India' ? '0 4px 12px rgba(22,163,74,0.2)' : 'none',
						transition: 'all 0.15s ease'
					}}
				>
					<span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
						<IconFlag size={15} />
						<span>Domestic (India)</span>
					</span>
					<span style={{
						background: activeGroup === 'India' ? 'rgba(255,255,255,0.25)' : '#e2e8f0',
						color: activeGroup === 'India' ? '#ffffff' : '#475569',
						fontSize: '11px',
						padding: '2px 7px',
						borderRadius: '8px',
						fontWeight: '800'
					}}>
						{indiaRegions.length} Regions · {totalIndiaCountries} Destinations
					</span>
				</button>
			</div>

			{/* Main Split Layout: Regions Sidebar + Countries Editor */}
			{loading ? (
				<div style={{ padding: '60px', textAlign: 'center', color: '#64748b', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
					Loading destinations hierarchy...
				</div>
			) : (
				<div style={{ display: 'grid', gridTemplateColumns: 'minmax(260px, 310px) minmax(0, 1fr)', gap: '22px', alignItems: 'start' }}>
					
					{/* LEFT PANE: Regions List */}
					<div style={{ background: '#ffffff', borderRadius: '18px', border: '1px solid #e2e8f0', padding: '16px', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
						<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', paddingBottom: '10px', borderBottom: '1px solid #f1f5f9' }}>
							<span style={{ fontSize: '12px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
								{activeGroup === 'International' ? 'Continents / Regions' : 'India Zones / Regions'}
							</span>
							<span style={{ fontSize: '11px', fontWeight: '800', background: '#f1f5f9', color: '#475569', padding: '2px 6px', borderRadius: '6px' }}>
								{currentGroupRegions.length}
							</span>
						</div>

						<div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
							{currentGroupRegions.map((region) => {
								const isSelected = selectedRegion && selectedRegion.id === region.id
								const cCount = Array.isArray(region.countries) ? region.countries.length : 0

								return (
									<div
										key={region.id}
										onClick={() => setSelectedRegionId(region.id)}
										style={{
											display: 'flex',
											justifyContent: 'space-between',
											alignItems: 'center',
											padding: '11px 14px',
											borderRadius: '12px',
											border: isSelected
												? (activeGroup === 'International' ? '2px solid #2563eb' : '2px solid #16a34a')
												: '1px solid #f1f5f9',
											background: isSelected
												? (activeGroup === 'International' ? '#eff6ff' : '#f0fdf4')
												: '#ffffff',
											cursor: 'pointer',
											transition: 'all 0.15s ease'
										}}
									>
										<div style={{ minWidth: 0, flex: 1, paddingRight: '8px' }}>
											<span style={{
												display: 'block',
												fontSize: '13.5px',
												fontWeight: isSelected ? '800' : '700',
												color: isSelected ? '#0f172a' : '#334155',
												whiteSpace: 'nowrap',
												overflow: 'hidden',
												textOverflow: 'ellipsis'
											}}>
												{region.name}
											</span>
										</div>

										<span style={{
											fontSize: '11.5px',
											fontWeight: '800',
											padding: '2px 8px',
											borderRadius: '10px',
											background: isSelected
												? (activeGroup === 'International' ? '#2563eb' : '#16a34a')
												: '#f1f5f9',
											color: isSelected ? '#ffffff' : '#64748b',
											flexShrink: 0
										}}>
											{cCount}
										</span>
									</div>
								)
							})}

							{currentGroupRegions.length === 0 && (
								<div style={{ padding: '24px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
									No regions created under {activeGroup} yet. Click "Add New Region" below.
								</div>
							)}
						</div>

						<button
							type="button"
							onClick={() => setRegionModal({ group: activeGroup, name: '', countriesText: '' })}
							style={{
								marginTop: '16px',
								width: '100%',
								background: '#f8fafc',
								border: '1px dashed #cbd5e1',
								padding: '10px',
								borderRadius: '12px',
								fontSize: '13px',
								fontWeight: '700',
								color: '#475569',
								cursor: 'pointer',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								gap: '6px'
							}}
						>
							<IconPlus size={14} />
							<span> Add {activeGroup} Region</span>
						</button>
					</div>

					{/* RIGHT PANE: Countries & Cities Workspace */}
					{selectedRegion ? (
						<div style={{ background: '#ffffff', borderRadius: '18px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
							
							{/* Region Header Bar */}
							<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px', paddingBottom: '18px', borderBottom: '1px solid #f1f5f9', marginBottom: '20px' }}>
								<div>
									<div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
										<span style={{
											display: 'inline-flex',
											alignItems: 'center',
											gap: '5px',
											fontSize: '11px',
											fontWeight: '800',
											textTransform: 'uppercase',
											padding: '2px 8px',
											borderRadius: '6px',
											background: selectedRegion.group === 'International' ? '#eff6ff' : '#f0fdf4',
											color: selectedRegion.group === 'International' ? '#2563eb' : '#16a34a',
											border: selectedRegion.group === 'International' ? '1px solid #bfdbfe' : '1px solid #bbf7d0'
										}}>
											{selectedRegion.group === 'International' ? (
												<>
													<IconGlobe size={12} />
													<span>INTERNATIONAL REGION</span>
												</>
											) : (
												<>
													<IconFlag size={12} />
													<span>DOMESTIC (INDIA) REGION</span>
												</>
											)}
										</span>
									</div>
									<h2 style={{ margin: '0 0 4px', fontSize: '22px', fontWeight: '900', color: '#0f172a' }}>
										{selectedRegion.name}
									</h2>
									<span style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>
										{selectedCountries.length} Destinations / Countries listed 
									</span>
								</div>

								<div style={{ display: 'flex', gap: '8px' }}>
									<button
										type="button"
										onClick={() => setRegionModal({ id: selectedRegion.id, group: selectedRegion.group, name: selectedRegion.name })}
										style={{
											background: '#f1f5f9',
											border: '1px solid #cbd5e1',
											color: '#334155',
											padding: '8px 14px',
											borderRadius: '8px',
											fontWeight: '700',
											fontSize: '12.5px',
											cursor: 'pointer',
											display: 'inline-flex',
											alignItems: 'center',
											gap: '6px'
										}}
									>
										<IconEdit size={13} />
										<span>Edit Region Name</span>
									</button>
									<button
										type="button"
										onClick={() => handleDeleteRegion(selectedRegion)}
										style={{
											background: '#fef2f2',
											border: '1px solid #fecaca',
											color: '#dc2626',
											padding: '8px 14px',
											borderRadius: '8px',
											fontWeight: '700',
											fontSize: '12.5px',
											cursor: 'pointer',
											display: 'inline-flex',
											alignItems: 'center',
											gap: '6px'
										}}
									>
										<IconTrash size={13} color="#dc2626" />
										<span>Delete Region</span>
									</button>
								</div>
							</div>

							{/* Fast Add Country / Destination Toolbar */}
							<form onSubmit={handleAddCountry} style={{ background: '#f8fafc', padding: '16px', borderRadius: '14px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
								<label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: '#334155', marginBottom: '8px', textTransform: 'uppercase' }}>
									+ Add Destination / Country / City to {selectedRegion.name}
								</label>
								<div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1.4fr) minmax(200px, 1fr) auto', gap: '10px' }}>
									<input
										type="text"
										required
										autoComplete="off"
										placeholder="e.g. Maldives or Vietnam..."
										value={newCountryInput}
										onChange={e => setNewCountryInput(e.target.value)}
										style={{
											padding: '10px 14px',
											background: '#ffffff',
											border: '1px solid #cbd5e1',
											borderRadius: '10px',
											fontSize: '13.5px',
											outline: 'none',
											color: '#0f172a'
										}}
									/>

									<select
										value={newCountrySlug}
										onChange={e => setNewCountrySlug(e.target.value)}
										style={{
											padding: '10px 14px',
											background: '#ffffff',
											border: '1px solid #cbd5e1',
											borderRadius: '10px',
											fontSize: '13px',
											outline: 'none',
											color: '#0f172a'
										}}
									>
										<option value="">-- No Linked Package (Inquiry) --</option>
										{packages.map(pkg => (
											<option key={pkg.id || pkg.slug} value={pkg.slug}>
												{pkg.title} ({pkg.slug})
											</option>
										))}
									</select>

									<button
										type="submit"
										disabled={addingCountry}
										style={{
											background: '#16a34a',
											color: '#ffffff',
											border: 'none',
											padding: '10px 20px',
											borderRadius: '10px',
											fontWeight: '800',
											fontSize: '13px',
											cursor: 'pointer',
											display: 'inline-flex',
											alignItems: 'center',
											gap: '6px',
											boxShadow: '0 2px 8px rgba(22,163,74,0.25)',
											whiteSpace: 'nowrap'
										}}
									>
										<IconPlus size={14} />
										<span>{addingCountry ? 'Adding...' : 'Add Destination'}</span>
									</button>
								</div>
							</form>

							{/* Search & Counter Bar */}
							<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
								<div style={{ fontSize: '13px', fontWeight: '700', color: '#475569' }}>
									Showing {filteredCountries.length} of {selectedCountries.length} Destinations
								</div>
								<div style={{ width: '240px' }}>
									<input
										type="text"
										placeholder="Filter in this region..."
										value={countrySearch}
										onChange={e => setCountrySearch(e.target.value)}
										style={{
											width: '100%',
											padding: '7px 12px',
											background: '#f8fafc',
											border: '1px solid #cbd5e1',
											borderRadius: '8px',
											fontSize: '12.5px',
											outline: 'none',
											color: '#0f172a',
											boxSizing: 'border-box'
										}}
									/>
								</div>
							</div>

							{/* Countries Grid */}
							<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '10px', maxHeight: '520px', overflowY: 'auto', paddingRight: '4px' }}>
								{filteredCountries.map((country, idx) => {
									const cName = getCountryName(country)
									const cSlug = getCountrySlug(country)
									const linkedPkg = packages.find(p => p.slug === cSlug)

									return (
										<div
											key={idx}
											style={{
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'space-between',
												padding: '9px 12px',
												background: '#ffffff',
												border: cSlug ? '1px solid #bbf7d0' : '1px solid #e2e8f0',
												borderRadius: '10px',
												boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
												transition: 'all 0.15s ease'
											}}
										>
											<div style={{ minWidth: 0, flex: 1, marginRight: '8px' }}>
												<span style={{
													display: 'block',
													fontSize: '13px',
													fontWeight: '700',
													color: '#0f172a',
													whiteSpace: 'nowrap',
													overflow: 'hidden',
													textOverflow: 'ellipsis'
												}} title={cName}>
													{cName}
												</span>
												{cSlug && (
													<span style={{
														display: 'inline-flex',
														alignItems: 'center',
														gap: '4px',
														fontSize: '10px',
														fontWeight: '800',
														color: '#15803d',
														background: '#dcfce7',
														padding: '1px 6px',
														borderRadius: '4px',
														marginTop: '2px',
														maxWidth: '100%',
														overflow: 'hidden',
														textOverflow: 'ellipsis',
														whiteSpace: 'nowrap'
													}} title={`Links to /tour/${cSlug}`}>
														<IconPackages size={11} style={{ flexShrink: 0 }} />
														<span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{linkedPkg ? linkedPkg.title : cSlug}</span>
													</span>
												)}
											</div>

											<div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
												<button
													type="button"
													onClick={() => setEditingCountry({ oldItem: country, newName: cName, newSlug: cSlug })}
													title="Edit Destination & Package"
													style={{
														background: '#f1f5f9',
														border: 'none',
														color: '#475569',
														width: '26px',
														height: '26px',
														borderRadius: '6px',
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center',
														cursor: 'pointer'
													}}
												>
													<IconEdit size={11} />
												</button>
												<button
													type="button"
													onClick={() => handleDeleteCountry(country)}
													title="Delete Destination"
													style={{
														background: '#fef2f2',
														border: 'none',
														color: '#dc2626',
														width: '26px',
														height: '26px',
														borderRadius: '6px',
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center',
														cursor: 'pointer'
													}}
												>
													<IconTrash size={11} color="#dc2626" />
												</button>
											</div>
										</div>
									)
								})}

								{filteredCountries.length === 0 && (
									<div style={{ gridColumn: '1 / -1', padding: '36px', textAlign: 'center', color: '#94a3b8', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
										{countrySearch.trim() ? 'No destinations match your search.' : 'No destinations in this region yet. Add one above!'}
									</div>
								)}
							</div>

						</div>
					) : (
						<div style={{ padding: '60px', textAlign: 'center', color: '#64748b', background: '#ffffff', borderRadius: '18px', border: '1px solid #e2e8f0' }}>
							Please select or create a region on the left to manage destinations.
						</div>
					)}

				</div>
			)}

			{/* ADD / EDIT REGION MODAL */}
			{regionModal && (
				<div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
					<div style={{ background: '#ffffff', borderRadius: '20px', maxWidth: '480px', width: '100%', padding: '28px', boxShadow: '0 20px 50px rgba(0,0,0,0.15)' }}>
						<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
							<h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
								{regionModal.id ? `Edit Region: ${regionModal.name}` : `Add New ${regionModal.group} Region`}
							</h3>
							<button onClick={() => setRegionModal(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
								<IconClose size={20} />
							</button>
						</div>

						<form onSubmit={handleSaveRegionModal} autoComplete="off" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
							<div>
								<label style={labelStyle}>Category / Group *</label>
								<select
									value={regionModal.group}
									onChange={e => setRegionModal({ ...regionModal, group: e.target.value })}
									style={inputStyle}
								>
									<option value="International">International (Overseas)</option>
									<option value="India">Domestic (India)</option>
								</select>
							</div>

							<div>
								<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
									<label style={{ ...labelStyle, marginBottom: 0 }}>Region Name *</label>
									<span style={{ fontSize: '11px', color: (regionModal.name || '').length > 40 ? '#dc2626' : '#64748b', fontWeight: '700' }}>
										{(regionModal.name || '').length}/50 chars allowed
									</span>
								</div>
								<input
									type="text"
									required
									maxLength={50}
									autoComplete="off"
									placeholder="e.g. North America, Europe, South India..."
									value={regionModal.name || ''}
									onChange={e => setRegionModal({ ...regionModal, name: e.target.value })}
									style={inputStyle}
								/>
							</div>

							{!regionModal.id && (
								<div>
									<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
										<label style={{ ...labelStyle, marginBottom: 0 }}>Initial Destinations (Optional)</label>
										<span style={{ fontSize: '11px', color: '#64748b', fontWeight: '700' }}>
											{(regionModal.countriesText || '').length}/400 chars allowed
										</span>
									</div>
									<textarea
										rows={3}
										maxLength={400}
										placeholder="e.g. Canada, Mexico, United States, Cuba (separated by commas)"
										value={regionModal.countriesText || ''}
										onChange={e => setRegionModal({ ...regionModal, countriesText: e.target.value })}
										style={{ ...inputStyle, resize: 'vertical' }}
									/>
									
								</div>
							)}

							<div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
								<button type="button" onClick={() => setRegionModal(null)} style={{ padding: '8px 16px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: '700', color: '#475569', cursor: 'pointer' }}>Cancel</button>
								<button type="submit" disabled={savingRegion} style={{ padding: '8px 20px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '800', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
									<IconSave size={14} />
									<span>{savingRegion ? 'Saving...' : (regionModal.id ? 'Save Changes' : 'Create Region')}</span>
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{/* RENAME / EDIT DESTINATION MODAL */}
			{editingCountry && (
				<div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
					<div style={{ background: '#ffffff', borderRadius: '18px', maxWidth: '460px', width: '100%', padding: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.15)' }}>
						<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
							<h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>
								Edit Destination &amp; Package
							</h3>
							<button onClick={() => setEditingCountry(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
								<IconClose size={18} />
							</button>
						</div>

						<form onSubmit={handleSaveEditCountry} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
							<div>
								<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
									<label style={{ ...labelStyle, marginBottom: 0 }}>Destination Name *</label>
									<span style={{ fontSize: '11px', color: (editingCountry.newName || '').length > 50 ? '#dc2626' : '#64748b', fontWeight: '700' }}>
										{(editingCountry.newName || '').length}/60 chars allowed
									</span>
								</div>
								<input
									type="text"
									required
									maxLength={60}
									autoFocus
									value={editingCountry.newName}
									onChange={e => setEditingCountry({ ...editingCountry, newName: e.target.value })}
									style={inputStyle}
								/>
							</div>

							<div>
								<label style={labelStyle}>Linked Tour Package (Optional)</label>
								<select
									value={editingCountry.newSlug || ''}
									onChange={e => setEditingCountry({ ...editingCountry, newSlug: e.target.value })}
									style={inputStyle}
								>
									<option value="">-- No Package Linked (Inquiry Only) --</option>
									{packages.map(pkg => (
										<option key={pkg.id || pkg.slug} value={pkg.slug}>
											{pkg.title} ({pkg.slug})
										</option>
									))}
								</select>
								<span style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', display: 'block' }}>
									Selecting a package shows a "Package" badge on the website and opens the tour page on click.
								</span>
							</div>

							<div>
								<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
									<label style={{ ...labelStyle, marginBottom: 0 }}>Custom Package Slug (Optional)</label>
									<span style={{ fontSize: '11px', color: '#64748b', fontWeight: '700' }}>
										{(editingCountry.newSlug || '').length}/70 chars allowed
									</span>
								</div>
								<input
									type="text"
									maxLength={70}
									placeholder="e.g. vietnam-beauty-of-vietnam"
									value={editingCountry.newSlug || ''}
									onChange={e => setEditingCountry({ ...editingCountry, newSlug: e.target.value })}
									style={inputStyle}
								/>
							</div>

							<div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
								<button type="button" onClick={() => setEditingCountry(null)} style={{ padding: '8px 14px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: '700', color: '#475569', cursor: 'pointer', fontSize: '12.5px' }}>Cancel</button>
								<button type="submit" style={{ padding: '8px 18px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '800', cursor: 'pointer', fontSize: '12.5px' }}>
									Update Destination
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
