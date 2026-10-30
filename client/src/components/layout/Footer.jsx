import React from 'react'
import Link from '@/components/elements/Link'
import Logo from '@/components/elements/Logo'

export default function Footer() {
	const scrollToTop = () => {
		try {
			window.scrollTo({
				top: 0,
				left: 0,
				behavior: 'smooth'
			})
		} catch {
			window.scrollTo(0, 0)
		}
	}

	return (
		<footer className="footer footer-style1" style={{ paddingTop: '30px', paddingBottom: '15px', backgroundColor: '#071812', color: '#ffffff' }}>
			<style>{`
				.footer-grid {
					display: grid;
					grid-template-columns: 1.35fr 0.85fr 1.05fr 1.25fr;
					gap: 30px;
					padding-bottom: 25px;
					border-bottom: 1px solid rgba(255,255,255,0.08);
				}
				@media (max-width: 1199px) and (min-width: 641px) {
					.footer-grid {
						grid-template-columns: repeat(2, 1fr) !important;
						gap: 36px 36px !important;
					}
					.footer-col-brand {
						padding-right: 20px !important;
					}
				}
				@media (max-width: 640px) {
					.footer-grid {
						grid-template-columns: 1fr !important;
						gap: 28px !important;
					}
					.footer-col-brand {
						padding-right: 0 !important;
					}
				}
			`}</style>
			<div className="tf-container">
				<div className="footer-grid">
					{/* Column 1: Brand Info */}
					<div className="footer-col-brand" style={{ paddingRight: '25px' }}>
						<div onClick={scrollToTop} style={{ marginBottom: '12px', display: 'inline-block', transition: 'transform 0.3s ease', cursor: 'pointer' }} className="footer-logo-wrap">
							<Logo isWhite={true} size="default" />
						</div>
						<p style={{ color: '#9ca3af', fontSize: '13px', lineHeight: '1.6', marginBottom: '18px' , textAlign: 'justify'}}>
							Golden Travels Coimbatore is your premier luxury tour operator crafting 100% customized holidays, curated group departures, visa assistance, and 24/7 on-trip concierge assistance across 150+ worldwide destinations.
						</p>
						<ul className="social-ft flex-three" style={{ gap: '10px', listStyle: 'none', padding: 0, margin: 0 }}>
							<li>
								<a href="https://www.facebook.com/photo/?fbid=482086857261193&set=a.482086827261196" target="_blank" rel="noopener noreferrer" className="footer-social-btn fb" title="Facebook" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', background: '#1877F2', color: '#ffffff' }}>
									<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
								</a>
							</li>
							<li>
								<a href="https://www.instagram.com/goldentravelscbe/?hl=en#" target="_blank" rel="noopener noreferrer" className="footer-social-btn insta" title="Instagram" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', color: '#ffffff' }}>
									<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
								</a>
							</li>
							<li>
								<a href="https://wa.me/919003546546" target="_blank" rel="noopener noreferrer" className="footer-social-btn wa" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#25D366', color: '#ffffff' }} title="WhatsApp">
									<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
								</a>
							</li>
							<li>
								<a href="https://www.google.com/maps/search/?api=1&query=Harmony+Arcade+428+D+B+Road+R+S+Puram+Coimbatore+641002" target="_blank" rel="noopener noreferrer" className="footer-social-btn yt" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#ea4335', color: '#ffffff' }} title="Google Maps Location">
									<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
								</a>
							</li>
						</ul>
					</div>

					{/* Column 2: Quick Links (with Home) */}
					<div>
						<h5 style={{ color: '#ffffff', fontSize: '16px', fontWeight: '700', marginBottom: '16px', letterSpacing: '-0.01em' }}>
							Quick Links
						</h5>
						<ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
							<li>
								<Link href="/" onClick={scrollToTop} className="footer-link-item">
									<span className="link-arrow">→</span>Home
								</Link>
							</li>
							<li>
								<Link href="/tour" onClick={scrollToTop} className="footer-link-item">
									<span className="link-arrow">→</span>Tour Packages
								</Link>
							</li>
							<li>
								<Link href="/blog" onClick={scrollToTop} className="footer-link-item">
									<span className="link-arrow">→</span>Travel Blog
								</Link>
							</li>
							<li>
								<Link href="/contact-us" onClick={scrollToTop} className="footer-link-item">
									<span className="link-arrow">→</span>Contact Us
								</Link>
							</li>
						</ul>
					</div>

					{/* Column 3: Top Destinations */}
					<div>
						<h5 style={{ color: '#ffffff', fontSize: '16px', fontWeight: '700', marginBottom: '16px', letterSpacing: '-0.01em' }}>
							Top Domestic Tours
						</h5>
						<ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
							<li>
								<Link href="/tour/rann-utsav-kutch" onClick={scrollToTop} className="footer-link-item">
									<span className="link-arrow">→</span>Rann Utsav (White Desert)
								</Link>
							</li>
							<li>
								<Link href="/tour/rajasthan-royal-heritage" onClick={scrollToTop} className="footer-link-item">
									<span className="link-arrow">→</span>Rajasthan Royal Heritage
								</Link>
							</li>
							<li>
								<Link href="/tour/puri-bhubaneswar-heritage" onClick={scrollToTop} className="footer-link-item">
									<span className="link-arrow">→</span>Puri &amp; Bhubaneswar
								</Link>
							</li>
							<li>
								<Link href="/tour/andaman-islands-escape" onClick={scrollToTop} className="footer-link-item">
									<span className="link-arrow">→</span>Andaman Islands Escapade
								</Link>
							</li>
							<li>
								<Link href="/tour/north-east-program" onClick={scrollToTop} className="footer-link-item">
									<span className="link-arrow">→</span>North East &amp; Meghalaya
								</Link>
							</li>
						</ul>
					</div>

					{/* Column 4: Contact & Office */}
					<div>
						<h5 style={{ color: '#ffffff', fontSize: '16px', fontWeight: '700', marginBottom: '16px', letterSpacing: '-0.01em' }}>
							Contact Office
						</h5>
						<ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
							<li className="footer-contact-item">
								<a
									href="mailto:goldentravelscbe@gmail.com"
									onClick={() => { window.location.href = 'mailto:goldentravelscbe@gmail.com' }}
									style={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}
									title="Click to send an email"
								>
									<i className="icon-noun-mail-5780740-1" style={{ color: '#16a34a', fontSize: '16px', flexShrink: 0 }} />
									<span>goldentravelscbe@gmail.com</span>
								</a>
							</li>
							<li className="footer-contact-item">
								<i className="icon-Group-9" style={{ color: '#16a34a', fontSize: '16px' }} />
								<div>
									<a href="tel:+919003546546" style={{ color: 'inherit', textDecoration: 'none', display: 'block' }}>
										+91 90035 46546 (Mobile / WhatsApp)
									</a>
									<a href="tel:04222477090" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '12px' }}>
										0422 2477090 (Landline)
									</a>
								</div>
							</li>
							<li className="footer-contact-item" style={{ alignItems: 'flex-start' }}>
								<a
									href="https://www.google.com/maps/search/?api=1&query=Harmony+Arcade+428+D+B+Road+R+S+Puram+Coimbatore+641002"
									target="_blank"
									rel="noopener noreferrer"
									style={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'flex-start', gap: '8px' }}
									title="Click to view office on Google Maps"
								>
									<i className="icon-Layer-19" style={{ color: '#16a34a', fontSize: '16px', marginTop: '3px', flexShrink: 0 }} />
									<span>Harmony arcade, 428, D B Road, R S Puram, Coimbatore – 641002</span>
								</a>
							</li>
							<li className="footer-contact-item">
								<i className="icon-day" style={{ color: '#16a34a', fontSize: '16px' }} />
								<span>Mon - Sat: 10:00 AM – 07:00 PM</span>
							</li>
						</ul>
					</div>
				</div>

				{/* Footer Bottom Bar */}
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', flexWrap: 'wrap', gap: '12px' }}>
					<p style={{ color: '#6b7280', fontSize: '13px', margin: 0 }}>
						© 2026 Golden Travels. All rights reserved.
					</p>
					<p style={{ color: '#6b7280', fontSize: '13px', margin: 0 }}>
						Developed by <a href="https://saitechnosolutions.com/" target="_blank" rel="noopener noreferrer" style={{ color: '#E5A91E', textDecoration: 'none', fontWeight: '700' }}>Sai Techno Solutions Pvt Ltd</a>
					</p>
				</div>
			</div>
		</footer>
	)
}
