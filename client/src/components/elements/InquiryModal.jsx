import React, { useState, useEffect } from 'react'
import { submitInquiry, fetchPackages } from '@/services/api'
import { packagesData } from '@/data/packagesData'
import { IconLock, IconCheckCircle } from '@/components/common/Icons'

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

export const openInquiryModal = (payload = {}) => {
	if (typeof window !== 'undefined') {
		window.dispatchEvent(new CustomEvent('open-inquiry-modal', { detail: payload }))
	}
}

export const parseDaysNights = (durationStr = '') => {
	if (!durationStr || typeof durationStr !== 'string') {
		return { days: '', nights: '' }
	}
	const dMatch = durationStr.match(/(\d+)\s*Days?/i)
	const nMatch = durationStr.match(/(\d+)\s*Nights?/i)
	const d = dMatch ? parseInt(dMatch[1], 10) : ''
	const n = nMatch ? parseInt(nMatch[1], 10) : (d !== '' ? Math.max(0, d - 1) : '')
	return { days: d !== '' ? Math.max(1, d) : '', nights: n !== '' ? Math.max(0, n) : '' }
}

export const validateInquiryFields = ({ name, email, phone, packageName, destination, message }) => {
	const errors = {}

	const cleanName = (name || '').trim()
	if (!cleanName || cleanName.length < 2 || !/[a-zA-Z]/.test(cleanName)) {
		errors.name = 'Please enter a valid name (min 2 letters)'
	} else if (cleanName.length > 30) {
		errors.name = 'Name cannot exceed 30 characters'
	}

	const cleanEmail = (email || '').trim()
	if (!cleanEmail || !EMAIL_REGEX.test(cleanEmail)) {
		errors.email = 'Please enter a valid email (e.g. name@gmail.com)'
	} else if (cleanEmail.length > 60) {
		errors.email = 'Email cannot exceed 60 characters'
	}

	const cleanPhone = (phone || '').replace(/[\s\-()]/g, '')
	const digitsOnly = cleanPhone.replace(/\D/g, '')
	const isValidIndian = /^(\+?91|0)?[6-9]\d{9}$/.test(cleanPhone)
	const isValidIntl = /^\+\d{10,15}$/.test(cleanPhone)
	if (!cleanPhone || (!isValidIndian && !isValidIntl) || digitsOnly.length < 10 || digitsOnly.length > 15) {
		errors.phone = 'Enter a valid 10-digit WhatsApp number'
	}

	const cleanPkg = (packageName || destination || '').trim()
	if (!cleanPkg || cleanPkg.length < 2) {
		errors.packageName = 'Please enter a package name'
		errors.destination = 'Please enter a package name'
	}

	const cleanMsg = (message || '').trim()
	if (!cleanMsg || cleanMsg.length < 3) {
		errors.notes = 'Please write a short message'
		errors.message = 'Please write a short message'
	}

	return errors
}

const findMatchedPackage = (name = '', list = []) => {
	const q = String(name || '').trim().toLowerCase()
	if (!q) return null
	return (
		list.find(
			p =>
				(p.title || '').trim().toLowerCase() === q ||
				(p.shortTitle || '').trim().toLowerCase() === q ||
				(p.destination || '').trim().toLowerCase() === q ||
				(p.slug || '').trim().toLowerCase() === q
		) ||
		list.find(p => {
			const title = (p.title || '').trim().toLowerCase()
			const shortTitle = (p.shortTitle || '').trim().toLowerCase()
			const dest = (p.destination || '').trim().toLowerCase()
			const prefix = title.split(/[–—\-:]/)[0].replace(/\bprogram\b/g, '').trim()
			return (
				(title && (q.includes(title) || title.includes(q))) ||
				(shortTitle && (q.includes(shortTitle) || shortTitle.includes(q))) ||
				(dest && (q.includes(dest) || dest.includes(q))) ||
				(prefix && prefix.length >= 3 && q.includes(prefix))
			)
		}) ||
		null
	)
}

export default function InquiryModal({ isOpen, onClose, packageName = "", packageData = null }) {
	const [allPackages, setAllPackages] = useState(packagesData)
	const [formData, setFormData] = useState({
		name: '',
		phone: '',
		email: '',
		packageName: '',
		days: '',
		nights: '',
		duration: '',
		travelers: '2',
		month: 'Next 30 Days',
		notes: ''
	})
	const [errors, setErrors] = useState({})
	const [submitted, setSubmitted] = useState(false)
	const [submitting, setSubmitting] = useState(false)

	useEffect(() => {
		fetchPackages({ activeOnly: 'true' })
			.then(res => {
				if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
					setAllPackages(res.data)
				}
			})
			.catch(() => {})
	}, [])

	useEffect(() => {
		if (isOpen) {
			let resolvedPkgName = ''
			let resolvedDuration = ''

			const isPlanMyTrip = (packageData?.isPlanMyTrip) || 
				(typeof packageName === 'string' && (packageName.toLowerCase().includes('general') || packageName.toLowerCase().includes('plan my trip'))) ||
				(packageData?.source && packageData.source.toLowerCase().includes('plan my trip'))

			if (packageData && typeof packageData === 'object') {
				resolvedPkgName = (packageData.packageName || packageData.destination || '').trim()
				const matchedPkg = findMatchedPackage(resolvedPkgName, allPackages)
				resolvedDuration = (matchedPkg?.duration || packageData.duration || '').trim()
			} else if (typeof packageName === 'string' && packageName && packageName !== 'General Inquiry') {
				const raw = packageName.replace(/^Customized Tour to\s+/i, '').trim()
				resolvedPkgName = raw
				const matchedPkg = findMatchedPackage(raw, allPackages)
				if (matchedPkg) {
					resolvedDuration = matchedPkg.duration || ''
				}
			}

			const { days: initDays, nights: initNights } = parseDaysNights(resolvedDuration)

			setFormData(prev => ({
				...prev,
				packageName: isPlanMyTrip ? (resolvedPkgName && resolvedPkgName !== 'General Inquiry' ? resolvedPkgName : '') : (resolvedPkgName || 'Customized Holiday Package'),
				days: initDays || '',
				nights: initNights || '',
				duration: initDays ? `${initDays} Days | ${initNights || 0} Nights` : ''
			}))
			setErrors({})
		}
	}, [isOpen, packageName, packageData, allPackages])

	if (!isOpen) return null

	const handlePhoneChange = (e) => {
		// Allow only numbers, +, spaces, and dashes (blocks letters like "sssss")
		const filtered = e.target.value.replace(/[^0-9+\-\s]/g, '').slice(0, 16)
		setFormData({ ...formData, phone: filtered })
		if (errors.phone) {
			setErrors({ ...errors, phone: '' })
		}
	}

	const handleFieldChange = (field, value) => {
		setFormData({ ...formData, [field]: value })
		if (errors[field]) {
			setErrors({ ...errors, [field]: '' })
		}
	}

	const handleSubmit = async (e) => {
		e.preventDefault()

		const validationErrors = validateInquiryFields({
			name: formData.name,
			email: formData.email,
			phone: formData.phone,
			packageName: formData.packageName,
			message: formData.notes
		})

		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors)
			return
		}

		setErrors({})
		setSubmitting(true)

		try {
			const cleanPkg = (formData.packageName || 'Customized Holiday Package').trim()
			const matchedPkg = findMatchedPackage(cleanPkg, allPackages)
			const finalDuration = (formData.days || formData.nights)
				? `${formData.days || 1} Days | ${formData.nights || 0} Nights`
				: 'Customized Duration'

			const isPlanMyTrip = (packageData?.isPlanMyTrip) || 
				(typeof packageName === 'string' && (packageName.toLowerCase().includes('general') || packageName.toLowerCase().includes('plan my trip'))) ||
				(packageData?.source && packageData.source.toLowerCase().includes('plan my trip'))

			const isDestInquiry = (packageData?.source || '').toLowerCase().includes('destination') && !matchedPkg

			const leadSource = packageData?.source
				? packageData.source
				: (isPlanMyTrip
					? 'Contact Page Enquiry - Plan My Trip'
					: (isDestInquiry ? 'Destination Enquiry' : 'Tour Package Enquiry'))

			// Sync lead to MySQL backend (triggers Admin Dashboard + SMTP Email Notification)
			await submitInquiry({
				name: formData.name.trim(),
				phone: formData.phone.trim(),
				email: formData.email.trim(),
				destination: isDestInquiry ? cleanPkg : (packageData?.destination || matchedPkg?.destination || cleanPkg),
				packageName: isDestInquiry ? '' : cleanPkg,
				duration: finalDuration,
				travelDate: finalDuration,
				travelers: formData.travelers,
				month: formData.month,
				message: formData.notes.trim(),
				source: leadSource
			})
		} catch (err) {
			console.log('Enquiry API:', err.message)
		} finally {
			setSubmitting(false)
			setSubmitted(true)
			setTimeout(() => {
				setSubmitted(false)
				setFormData(prev => ({
					...prev,
					name: '',
					phone: '',
					email: '',
					notes: ''
				}))
				setErrors({})
				onClose()
			}, 2500)
		}
	}

	const inputStyle = (hasError) => ({
		width: '100%',
		padding: '10px 14px',
		borderRadius: '11px',
		border: `1.5px solid ${hasError ? '#ef4444' : '#d1d5db'}`,
		backgroundColor: hasError ? '#fef2f2' : '#ffffff',
		fontSize: '13.5px',
		outline: 'none',
		boxSizing: 'border-box',
		transition: 'border-color 0.2s'
	})

	const errorTextStyle = {
		color: '#dc2626',
		fontSize: '11.5px',
		fontWeight: '600',
		marginTop: '3px',
		display: 'block'
	}

	const isModalPlanMyTrip = (packageData?.isPlanMyTrip) || 
		(typeof packageName === 'string' && (packageName.toLowerCase().includes('general') || packageName.toLowerCase().includes('plan my trip'))) ||
		(packageData?.source && packageData.source.toLowerCase().includes('plan my trip'))

	const isLocked = !isModalPlanMyTrip && !!packageData && !!packageData.packageName && packageData.packageName !== 'General Inquiry' && packageData.packageName !== 'Customized Holiday Package'

	return (
		<div
			style={{
				position: 'fixed',
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				backgroundColor: 'rgba(0, 0, 0, 0.75)',
				zIndex: 99999,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				padding: '14px',
				backdropFilter: 'blur(4px)'
			}}
			onClick={onClose}
		>
			<div
				style={{
					background: '#ffffff',
					borderRadius: '22px',
					maxWidth: '520px',
					width: '100%',
					padding: '24px 28px',
					position: 'relative',
					boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
					animation: 'fadeInUp 0.3s ease-out',
					boxSizing: 'border-box'
				}}
				onClick={(e) => e.stopPropagation()}
			>
				<button
					type="button"
					onClick={onClose}
					style={{
						position: 'absolute',
						top: '16px',
						right: '16px',
						border: 'none',
						background: '#f3f4f6',
						width: '32px',
						minWidth: '32px',
						height: '32px',
						padding: 0,
						borderRadius: '50%',
						cursor: 'pointer',
						fontSize: '15px',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						color: '#4b5563'
					}}
				>
					✕
				</button>

				{submitted ? (
					<div style={{ textAlign: 'center', padding: '28px 10px' }}>
						<div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
							<IconCheckCircle size={56} color="#16a34a" />
						</div>
						<h3 style={{ fontSize: '22px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
							Enquiry Sent Successfully!
						</h3>
						<p style={{ color: '#6b7280', fontSize: '14.5px', margin: 0 }}>
							Your enquiry has been sent to our team. Our destination specialist will contact you shortly.
						</p>
					</div>
				) : (
					<>
						<div style={{ marginBottom: '14px', paddingRight: '34px' }}>
							<span style={{ color: '#16a34a', fontSize: '11.5px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
								Golden Travels Exclusive
							</span>
							<h3 style={{ fontSize: '21px', fontWeight: '800', color: '#111827', margin: '2px 0 3px' }}>
								Plan Your Dream Holiday
							</h3>
						</div>

						<form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
							<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
								<div>
									<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
										<label style={{ fontSize: '12.5px', fontWeight: '700', color: '#374151', margin: 0 }}>
											Name *
										</label>
										<span style={{ fontSize: '10.5px', color: (formData.name || '').length >= 30 ? '#dc2626' : '#94a3b8', fontWeight: '600' }}>
											{(formData.name || '').length}/30
										</span>
									</div>
									<input
										type="text"
										maxLength={30}
										placeholder="Enter your name"
										value={formData.name}
										onChange={(e) => handleFieldChange('name', e.target.value.slice(0, 30))}
										style={inputStyle(!!errors.name)}
									/>
									{errors.name && <span style={errorTextStyle}>{errors.name}</span>}
								</div>
								<div>
									<label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#374151', marginBottom: '4px' }}>
										Email *
									</label>
									<input
										type="email"
										maxLength={60}
										placeholder="Enter your email"
										value={formData.email}
										onChange={(e) => handleFieldChange('email', e.target.value)}
										style={inputStyle(!!errors.email)}
									/>
									{errors.email && <span style={errorTextStyle}>{errors.email}</span>}
								</div>
							</div>

							<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
								<div>
									<label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#374151', marginBottom: '4px' }}>
										WhatsApp Number *
									</label>
									<input
										type="tel"
										inputMode="numeric"
										maxLength={16}
										placeholder="Enter WhatsApp number"
										value={formData.phone}
										onChange={handlePhoneChange}
										style={inputStyle(!!errors.phone)}
									/>
									{errors.phone && <span style={errorTextStyle}>{errors.phone}</span>}
								</div>
								<div>
									<label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#374151', marginBottom: '4px' }}>
										Days &amp; Nights
									</label>
									<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
										<div>
											<input
												type="number"
												min="1"
												max="99"
												placeholder="Days"
												value={formData.days}
												onChange={(e) => {
													const val = e.target.value
													const num = val === '' ? '' : Math.max(1, Math.min(99, parseInt(val, 10) || 1))
													setFormData(prev => ({
														...prev,
														days: num,
														nights: num !== '' && prev.nights === '' ? Math.max(0, num - 1) : prev.nights
													}))
												}}
												style={{
													...inputStyle(false),
													textAlign: 'center'
												}}
											/>
										</div>
										<div>
											<input
												type="number"
												min="0"
												max="99"
												placeholder="Nights"
												value={formData.nights}
												onChange={(e) => {
													const val = e.target.value
													const num = val === '' ? '' : Math.max(0, Math.min(99, parseInt(val, 10) || 0))
													setFormData(prev => ({
														...prev,
														nights: num
													}))
												}}
												style={{
													...inputStyle(false),
													textAlign: 'center'
												}}
											/>
										</div>
									</div>
								</div>
							</div>

							<div>
								<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
									<label style={{ fontSize: '12.5px', fontWeight: '700', color: '#374151', margin: 0 }}>
										Package Name *
									</label>
									{isLocked && (
										<span style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
											<IconLock size={12} color="#64748b" /> Pre-selected
										</span>
									)}
								</div>
								<input
									type="text"
									readOnly={isLocked}
									tabIndex={isLocked ? -1 : 0}
									placeholder="Enter package name"
									value={formData.packageName}
									onChange={(e) => handleFieldChange('packageName', e.target.value)}
									style={{
										...inputStyle(!!errors.packageName),
										...(isLocked ? {
											backgroundColor: '#f1f5f9',
											borderColor: '#e2e8f0',
											fontWeight: '700',
											color: '#1e293b',
											cursor: 'not-allowed',
											userSelect: 'none'
										} : {})
									}}
									title={isLocked ? "Package name is pre-selected and cannot be edited" : ""}
								/>
								{errors.packageName && <span style={errorTextStyle}>{errors.packageName}</span>}
							</div>

							<div>
								<label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#374151', marginBottom: '4px' }}>
									Write a Message *
								</label>
								<textarea
									rows="2"
									maxLength={500}
									placeholder="Write your message..."
									value={formData.notes}
									onChange={(e) => handleFieldChange('notes', e.target.value)}
									style={{
										...inputStyle(!!errors.notes),
										resize: 'none',
										fontFamily: 'inherit'
									}}
								/>
								{errors.notes && <span style={errorTextStyle}>{errors.notes}</span>}
							</div>

							<button
								type="submit"
								disabled={submitting}
								style={{
									backgroundColor: '#16a34a',
									color: '#ffffff',
									fontWeight: '700',
									fontSize: '15px',
									padding: '12px 20px',
									borderRadius: '12px',
									border: 'none',
									cursor: submitting ? 'not-allowed' : 'pointer',
									opacity: submitting ? 0.75 : 1,
									marginTop: '2px',
									boxShadow: '0 4px 12px rgba(22, 163, 74, 0.35)',
									transition: 'background 0.2s'
								}}
							>
								{submitting ? 'Sending Enquiry...' : 'Submit Enquiry ➔'}
							</button>
						</form>
					</>
				)}
			</div>
		</div>
	)
}
