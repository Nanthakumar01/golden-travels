import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Layout from "@/components/layout/Layout"
import { submitInquiry } from "@/services/api"
import { validateInquiryFields, parseDaysNights } from "@/components/elements/InquiryModal"
import SEO from "@/components/elements/SEO"
import { IconLocation, IconPhone, IconMail, IconCheck, IconSparkles } from "@/components/common/Icons"

export default function ContactUs() {
	const location = useLocation()
	const [formData, setFormData] = useState({
		name: '',
		phone: '',
		email: '',
		destination: '',
		packageName: '',
		days: '',
		nights: '',
		duration: '',
		travelDate: '',
		travelers: '2',
		message: ''
	})
	const [errors, setErrors] = useState({})
	const [submitting, setSubmitting] = useState(false)

	useEffect(() => {
		const params = new URLSearchParams(location.search)
		const dest = params.get('destination')
		const pkg = params.get('package')
		const dur = params.get('duration')
		if (dest || pkg) {
			const clickedName = (pkg || dest || '').trim()
			const { days: initDays, nights: initNights } = parseDaysNights(dur)
			setFormData(prev => ({
				...prev,
				destination: clickedName,
				packageName: clickedName,
				days: initDays || '',
				nights: initNights || '',
				duration: initDays ? `${initDays} Days | ${initNights || 0} Nights` : '',
				message: `Hello Golden Travels, I am interested in a customized holiday package to ${clickedName}. Please share itinerary details, accommodation options, and pricing quote.`
			}))
		}
	}, [location.search])

	const [isSubmitted, setIsSubmitted] = useState(false)

	const handleChange = (e) => {
		const { name, value } = e.target
		const finalValue = name === 'phone'
			? value.replace(/[^0-9+\-\s]/g, '').slice(0, 16)
			: value

		setFormData({
			...formData,
			[name]: finalValue
		})
		if (errors[name]) {
			setErrors({ ...errors, [name]: '' })
		}
	}

	const handleSubmit = async (e) => {
		e.preventDefault()

		const validationErrors = validateInquiryFields({
			name: formData.name,
			email: formData.email,
			phone: formData.phone,
			packageName: formData.packageName,
			message: formData.message
		})

		if (Object.keys(validationErrors).length > 0) {
			setErrors({
				...validationErrors,
				message: validationErrors.notes
			})
			return
		}

		setErrors({})
		setSubmitting(true)

		try {
			const cleanPkg = (formData.packageName || 'Customized Holiday Package').trim()
			const finalDuration = (formData.days || formData.nights)
				? `${formData.days || 1} Days | ${formData.nights || 0} Nights`
				: 'Customized Duration'
			// Save to MySQL database (triggers Admin Dashboard + Email Notification)
			await submitInquiry({
				name: formData.name.trim(),
				phone: formData.phone.trim(),
				email: formData.email.trim(),
				destination: cleanPkg,
				packageName: cleanPkg,
				duration: finalDuration,
				travelDate: finalDuration,
				travelers: formData.travelers,
				message: formData.message.trim(),
				source: 'Contact Page Enquiry'
			})
		} catch (err) {
			console.log('Contact enquiry API:', err.message)
		} finally {
			setSubmitting(false)
			setIsSubmitted(true)
			setFormData({
				name: '',
				phone: '',
				email: '',
				destination: '',
				packageName: '',
				days: '',
				nights: '',
				duration: '',
				travelDate: '',
				travelers: '2',
				message: ''
			})
		}
	}

	return (
		<Layout
			headerStyle={3}
			footerStyle={1}
			pageKey="contact"
			breadcrumbTitle="Contact Golden Travels"
			breadcrumbSubtitle="We are here to help you plan your dream holiday"
		>
			<SEO pageKey="contact" />
			{/* 1. Contact Info Cards */}
			<section style={{ padding: '60px 0 40px', backgroundColor: '#f8fafc' }}>
				<div className="tf-container">
					<div className="row" style={{ textAlign: 'center', marginBottom: '40px' }}>
						<div className="col-lg-12">
							<span style={{ color: '#16a34a', fontSize: '13px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.12em', display: 'inline-block', marginBottom: '8px' }}>
								Get in Touch
							</span>
							<h2 style={{ fontSize: '36px', fontWeight: '900', color: '#0f172a', margin: '0 0 12px 0' }}>
								Visit Our Coimbatore Office or Connect 24/7
							</h2>
							<p style={{ color: '#64748b', fontSize: '16px', maxWidth: '650px', margin: '0 auto' }}>
								Have questions about international visas, bespoke luxury packages, or group bookings? Our holiday curators are here to help.
							</p>
						</div>
					</div>

					<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
						{/* Card 1: Office Address */}
						<div
							style={{
								backgroundColor: '#ffffff',
								padding: '30px 24px',
								borderRadius: '20px',
								boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
								border: '1px solid #e2e8f0',
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'flex-start',
								transition: 'transform 0.3s ease'
							}}
						>
							<div
								style={{
									width: '52px',
									height: '52px',
									borderRadius: '14px',
									backgroundColor: '#ecfdf5',
									color: '#16a34a',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									fontSize: '24px',
									marginBottom: '18px'
								}}
							>
								<IconLocation size={24} color="#16a34a" />
							</div>
							<h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: '0 0 8px 0' }}>Office Address</h3>
							<p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6, margin: '0 0 16px 0' }}>
								<a
									href="https://www.google.com/maps/search/?api=1&query=Harmony+Arcade+428+D+B+Road+R+S+Puram+Coimbatore+641002"
									target="_blank"
									rel="noopener noreferrer"
									style={{ color: 'inherit', textDecoration: 'none' }}
									title="Click to view on Google Maps"
								>
									Harmony arcade, 428, D B Road, R S Puram, Coimbatore – 641002
								</a>
							</p>
							<a
								href="https://www.google.com/maps/search/?api=1&query=Harmony+Arcade+428+D+B+Road+R+S+Puram+Coimbatore+641002"
								target="_blank"
								rel="noopener noreferrer"
								style={{
									color: '#16a34a',
									fontSize: '13px',
									fontWeight: '700',
									textDecoration: 'none',
									marginTop: 'auto'
								}}
							>
								Open in Google Maps ↗
							</a>
						</div>

						{/* Card 2: Phone Numbers */}
						<div
							style={{
								backgroundColor: '#ffffff',
								padding: '30px 24px',
								borderRadius: '20px',
								boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
								border: '1px solid #e2e8f0',
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'flex-start',
								transition: 'transform 0.3s ease'
							}}
						>
							<div
								style={{
									width: '52px',
									height: '52px',
									borderRadius: '14px',
									backgroundColor: '#fef3c7',
									color: '#d97706',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									marginBottom: '18px'
								}}
							>
								<IconPhone size={24} color="#d97706" />
							</div>
							<h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: '0 0 8px 0' }}>Phone &amp; Mobile</h3>
							<p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6, margin: '0 0 4px 0' }}>
								<strong>Mobile / WhatsApp:</strong> <a href="tel:+919003546546" style={{ color: '#0f172a', textDecoration: 'none' }}>+91 90035 46546</a>
							</p>
							<p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6, margin: '0 0 16px 0' }}>
								<strong>Landline:</strong> <a href="tel:04222477090" style={{ color: '#0f172a', textDecoration: 'none' }}>0422 2477090</a>
							</p>
							<a
								href="https://wa.me/919003546546"
								target="_blank"
								rel="noopener noreferrer"
								style={{
									color: '#16a34a',
									fontSize: '13px',
									fontWeight: '700',
									textDecoration: 'none',
									marginTop: 'auto'
								}}
							>
								Instant WhatsApp Chat ↗
							</a>
						</div>

						{/* Card 3: Email & Social */}
						<div
							style={{
								backgroundColor: '#ffffff',
								padding: '30px 24px',
								borderRadius: '20px',
								boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
								border: '1px solid #e2e8f0',
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'flex-start',
								transition: 'transform 0.3s ease'
							}}
						>
							<div
								style={{
									width: '52px',
									height: '52px',
									borderRadius: '14px',
									backgroundColor: '#eff6ff',
									color: '#2563eb',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									marginBottom: '18px'
								}}
							>
								<IconMail size={24} color="#2563eb" />
							</div>
							<h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: '0 0 8px 0' }}>Official Email</h3>
							<p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6, margin: '0 0 16px 0' }}>
								<a
									href="mailto:goldentravelscbe@gmail.com"
									onClick={() => { window.location.href = 'mailto:goldentravelscbe@gmail.com' }}
									style={{ color: '#0f172a', textDecoration: 'none', fontWeight: '700' }}
									title="Click to write an email"
								>
									goldentravelscbe@gmail.com
								</a>
							</p>
							<div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: 'auto' }}>
								
								<a
									href="https://www.instagram.com/goldentravelscbe/?hl=en#"
									target="_blank"
									rel="noopener noreferrer"
									style={{
										background: '#f1f5f9',
										color: '#0f172a',
										padding: '6px 12px',
										borderRadius: '8px',
										fontSize: '12px',
										fontWeight: '700',
										textDecoration: 'none'
									}}
								>
									Instagram ↗
								</a>
								<a
									href="https://www.facebook.com/photo/?fbid=482086857261193&set=a.482086827261196"
									target="_blank"
									rel="noopener noreferrer"
									style={{
										background: '#f1f5f9',
										color: '#0f172a',
										padding: '6px 12px',
										borderRadius: '8px',
										fontSize: '12px',
										fontWeight: '700',
										textDecoration: 'none'
									}}
								>
									Facebook ↗
								</a>
							</div>
						</div>

						{/* Card 4: Working Hours */}
						<div
							style={{
								backgroundColor: '#ffffff',
								padding: '30px 24px',
								borderRadius: '20px',
								boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
								border: '1px solid #e2e8f0',
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'flex-start',
								transition: 'transform 0.3s ease'
							}}
						>
							<div
								style={{
									width: '52px',
									height: '52px',
									borderRadius: '14px',
									backgroundColor: '#f5f3ff',
									color: '#7c3aed',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									fontSize: '24px',
									marginBottom: '18px'
								}}
							>
								⏰
							</div>
							<h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: '0 0 8px 0' }}>Working Hours</h3>
							<p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6, margin: '0 0 4px 0' }}>
								<strong>Monday – Saturday:</strong><br />10:00 AM – 07:00 PM
							</p>
							<p style={{ fontSize: '13px', color: '#16a34a', fontWeight: '600', margin: '8px 0 0 0', marginTop: 'auto' }}>
								✓ 24/7 On-Trip Emergency Support
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* 2. Official Brand Divisions: Golden Travels & Golden Leisure */}
			<section className="about-divisions-section" style={{ padding: '60px 0 55px', backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
				<div className="tf-container">
					<div className="about-divisions-header" style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 40px' }}>
						<span style={{ color: '#16a34a', fontSize: '13px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.12em', display: 'inline-block', marginBottom: '8px' }}>
							Two Divisions • One Trusted Legacy
						</span>
						<h2 style={{ fontSize: '32px', fontWeight: '900', color: '#0f172a', margin: '0 0 12px 0' }}>
							The Story of Golden Travels &amp; Golden Leisure
						</h2>
						<p style={{ color: '#64748b', fontSize: '15px', lineHeight: '1.6', margin: 0 }}>
							Operating proudly from R S Puram, Coimbatore for over 25 years, our brand architecture provides end-to-end travel excellence — from global corporate flights and visas to bespoke experiential leisure holiday packages.
						</p>
					</div>

					<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px', maxWidth: '1080px', margin: '0 auto' }}>
						{/* Division 1: Golden Travels */}
						<div style={{ background: '#f8fafc', borderRadius: '24px', padding: '36px 30px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
							<div style={{ width: '130px', height: '110px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', background: '#ffffff', borderRadius: '18px', padding: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 14px rgba(0,0,0,0.06)' }}>
								<img src="/assets/images/logo/golden-travels-official-logo.jpg" alt="Golden Travels Logo" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
							</div>
							<span style={{ fontSize: '11.5px', fontWeight: '800', color: '#16a34a', background: '#ecfdf5', padding: '4px 14px', borderRadius: '20px', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
								Parent Brand (Est. 2001)
							</span>
							<h3 style={{ fontSize: '22px', fontWeight: '900', color: '#0f172a', margin: '0 0 10px' }}>
								Golden Travels Coimbatore
							</h3>
							<p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.65', margin: '0 0 20px' }}>
								The foundation of our 25-year travel heritage. Dedicated to domestic &amp; international airline ticketing, express visa concierge, corporate business delegations, and trusted group travel logistics.
							</p>
							<ul style={{ listStyle: 'none', padding: 0, margin: 'auto 0 0', display: 'flex', flexDirection: 'column', gap: '9px', fontSize: '13px', color: '#334155', fontWeight: '600', textAlign: 'left', width: '100%' }}>
								<li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><IconCheck size={14} color="#16a34a" /> 25+ Years of Industry Trust &amp; Accreditation</li>
								<li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><IconCheck size={14} color="#16a34a" /> Worldwide Airline Bookings &amp; Visa Documentation</li>
								<li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><IconCheck size={14} color="#16a34a" /> Corporate, MICE &amp; Group Travel Coordination</li>
							</ul>
						</div>

						{/* Division 2: Golden Leisure */}
						<div style={{ background: '#fdfbf7', borderRadius: '24px', padding: '36px 30px', border: '1.5px solid #fde68a', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', boxShadow: '0 8px 24px rgba(224, 162, 27, 0.08)' }}>
							<div style={{ width: '220px', height: '110px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', background: '#ffffff', borderRadius: '18px', padding: '16px 20px', border: '1px solid #fde68a', boxShadow: '0 4px 14px rgba(224, 162, 27, 0.12)' }}>
								<img src="/assets/images/logo/golden-leisure-logo.png" alt="Golden Leisure Logo" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
							</div>
							<span style={{ fontSize: '11.5px', fontWeight: '800', color: '#d97706', background: '#fef3c7', padding: '4px 14px', borderRadius: '20px', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
								Specialized Holiday Wing
							</span>
							<h3 style={{ fontSize: '22px', fontWeight: '900', color: '#0f172a', margin: '0 0 10px' }}>
								Golden Leisure
							</h3>
							<p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.65', margin: '0 0 20px' }}>
								A specialized leisure division of Golden Travels curated exclusively for bespoke vacation experiences, exotic honeymoon escapes, luxury family holidays, and handpicked resort stays worldwide.
							</p>
							<ul style={{ listStyle: 'none', padding: 0, margin: 'auto 0 0', display: 'flex', flexDirection: 'column', gap: '9px', fontSize: '13px', color: '#334155', fontWeight: '600', textAlign: 'left', width: '100%' }}>
								<li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><IconSparkles size={14} color="#d97706" /> 100% Tailor-Made Itineraries &amp; Luxury Stays</li>
								<li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><IconSparkles size={14} color="#d97706" /> Curated Honeymoon &amp; Exotic Family Getaways</li>
								<li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><IconSparkles size={14} color="#d97706" /> 24/7 Dedicated On-Trip WhatsApp Concierge Manager</li>
							</ul>
						</div>
					</div>
				</div>
			</section>

			{/* 3. Interactive Inquiry Form & Google Map */}
			<section style={{ padding: '60px 0', backgroundColor: '#f8fafc' }}>
				<style>{`
					.contact-form-box {
						background-color: #ffffff;
						padding: 36px;
						border-radius: 24px;
						box-shadow: 0 10px 40px rgba(0,0,0,0.08);
						border: 1px solid #e2e8f0;
						height: 100%;
					}
					.contact-grid-row {
						display: grid;
						grid-template-columns: 1fr 1fr;
						gap: 16px;
					}
					@media (max-width: 640px) {
						.contact-form-box {
							padding: 22px 18px !important;
							border-radius: 18px !important;
						}
						.contact-grid-row {
							grid-template-columns: 1fr !important;
							gap: 12px !important;
						}
					}
				`}</style>
				<div className="tf-container">
					<div className="row" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'stretch', gap: '30px' }}>
						
						{/* Left Column: Form */}
						<div className="col-lg-6 col-md-12" style={{ flex: '1 1 320px', maxWidth: '100%' }}>
							<div className="contact-form-box">
								<span style={{ color: '#16a34a', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
									Plan With Experts
								</span>
								<h2 style={{ fontSize: '28px', fontWeight: '900', color: '#0f172a', margin: '6px 0 20px 0' }}>
									Send Us a Message
								</h2>

								{isSubmitted && (
									<div style={{ padding: '12px 16px', backgroundColor: '#ecfdf5', color: '#16a34a', borderRadius: '12px', marginBottom: '20px', fontWeight: '600', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
										<IconCheck size={18} color="#16a34a" />
										<span>Thank you! Your enquiry has been sent to our team via Email &amp; Admin Dashboard.</span>
									</div>
								)}

								<form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
									<div className="contact-grid-row">
										<div>
											<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
												<label style={{ fontSize: '13px', fontWeight: '700', color: '#334155', margin: 0 }}>Name *</label>
												<span style={{ fontSize: '11px', color: (formData.name || '').length >= 30 ? '#dc2626' : '#94a3b8', fontWeight: '600' }}>
													{(formData.name || '').length}/30
												</span>
											</div>
											<input
												type="text"
												name="name"
												maxLength={30}
												placeholder="Enter your name"
												value={formData.name}
												onChange={handleChange}
												style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: `1.5px solid ${errors.name ? '#ef4444' : '#cbd5e1'}`, backgroundColor: errors.name ? '#fef2f2' : '#ffffff', fontSize: '14px', outline: 'none' }}
											/>
											{errors.name && <span style={{ color: '#dc2626', fontSize: '11.5px', fontWeight: '600', marginTop: '4px', display: 'block' }}>{errors.name}</span>}
										</div>
										<div>
											<label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>Email *</label>
											<input
												type="email"
												name="email"
												maxLength={60}
												placeholder="Enter your email"
												value={formData.email}
												onChange={handleChange}
												style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: `1.5px solid ${errors.email ? '#ef4444' : '#cbd5e1'}`, backgroundColor: errors.email ? '#fef2f2' : '#ffffff', fontSize: '14px', outline: 'none' }}
											/>
											{errors.email && <span style={{ color: '#dc2626', fontSize: '11.5px', fontWeight: '600', marginTop: '4px', display: 'block' }}>{errors.email}</span>}
										</div>
									</div>

									<div className="contact-grid-row">
										<div>
											<label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>WhatsApp Number *</label>
											<input
												type="tel"
												inputMode="numeric"
												maxLength={16}
												name="phone"
												placeholder="Enter WhatsApp number"
												value={formData.phone}
												onChange={handleChange}
												style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: `1.5px solid ${errors.phone ? '#ef4444' : '#cbd5e1'}`, backgroundColor: errors.phone ? '#fef2f2' : '#ffffff', fontSize: '14px', outline: 'none' }}
											/>
											{errors.phone && <span style={{ color: '#dc2626', fontSize: '11.5px', fontWeight: '600', marginTop: '4px', display: 'block' }}>{errors.phone}</span>}
										</div>
										<div>
											<label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>Days &amp; Nights</label>
											<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
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
														style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1.5px solid #cbd5e1', backgroundColor: '#ffffff', color: '#0f172a', fontWeight: '500', fontSize: '14px', outline: 'none', textAlign: 'center' }}
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
														style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1.5px solid #cbd5e1', backgroundColor: '#ffffff', color: '#0f172a', fontWeight: '500', fontSize: '14px', outline: 'none', textAlign: 'center' }}
													/>
												</div>
											</div>
										</div>
									</div>

									<div>
										<label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>Package Name *</label>
										<input
											type="text"
											name="packageName"
											placeholder="Enter package name"
											value={formData.packageName}
											onChange={handleChange}
											style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: `1.5px solid ${errors.packageName ? '#ef4444' : '#cbd5e1'}`, backgroundColor: errors.packageName ? '#fef2f2' : '#ffffff', fontWeight: '500', fontSize: '14px', outline: 'none' }}
										/>
										{errors.packageName && <span style={{ color: '#dc2626', fontSize: '11.5px', fontWeight: '600', marginTop: '4px', display: 'block' }}>{errors.packageName}</span>}
									</div>

									<div>
										<label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>Write a Message *</label>
										<textarea
											name="message"
											rows="3"
											maxLength={500}
											placeholder="Write your message..."
											value={formData.message}
											onChange={handleChange}
											style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: `1.5px solid ${errors.message ? '#ef4444' : '#cbd5e1'}`, backgroundColor: errors.message ? '#fef2f2' : '#ffffff', fontSize: '14px', outline: 'none', resize: 'vertical' }}
										/>
										{errors.message && <span style={{ color: '#dc2626', fontSize: '11.5px', fontWeight: '600', marginTop: '4px', display: 'block' }}>{errors.message}</span>}
									</div>

									<button
										type="submit"
										disabled={submitting}
										style={{
											display: 'inline-flex',
											alignItems: 'center',
											justifyContent: 'center',
											gap: '10px',
											backgroundColor: '#16a34a',
											color: '#ffffff',
											padding: '14px 28px',
											borderRadius: '12px',
											fontWeight: '800',
											fontSize: '15px',
											border: 'none',
											cursor: submitting ? 'not-allowed' : 'pointer',
											opacity: submitting ? 0.75 : 1,
											boxShadow: '0 6px 20px rgba(22, 163, 74, 0.35)',
											marginTop: '8px'
										}}
									>
										<span>{submitting ? 'Sending Enquiry...' : 'Submit Enquiry'}</span>
										<span>➔</span>
									</button>
								</form>
							</div>
						</div>

						{/* Right Column: Google Maps Embed */}
						<div className="col-lg-6 col-md-12" style={{ flex: '1 1 450px' }}>
							<div
								style={{
									borderRadius: '24px',
									overflow: 'hidden',
									boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
									border: '1px solid #e2e8f0',
									height: '100%',
									minHeight: '400px'
								}}
							>
								<iframe
									title="Golden Travels Office Location"
									src="https://maps.google.com/maps?q=Harmony+arcade+428+D+B+Road+R+S+Puram+Coimbatore+641002&t=&z=16&ie=UTF8&iwloc=&output=embed"
									width="100%"
									height="100%"
									style={{ border: 0, minHeight: '400px' }}
									allowFullScreen=""
									loading="lazy"
									referrerPolicy="no-referrer-when-downgrade"
								/>
							</div>
						</div>

					</div>
				</div>
			</section>
		</Layout>
	)
}
