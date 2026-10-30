import Link from '@/components/elements/Link'
import Logo from '@/components/elements/Logo'

export default function OffcanvasModal({ isOffcanvas, handleOffcanvas }) {
	return (
		<>
			<div className={`offcanvas offcanvas-end ${isOffcanvas ? 'show' : ''}`} tabIndex={-1} id="offcanvasRight" style={{ visibility: isOffcanvas ? 'visible' : 'hidden' }}>
				<div className="offcanvas-header" onClick={handleOffcanvas}>
					<button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close" />
				</div>
				<div className="offcanvas-body">
					<div className="logo-canvas" style={{ marginBottom: '18px' }}>
						<Logo />
					</div>
					<p className="des">
						Golden Travels Coimbatore is your trusted travel curator offering 100% personalized itineraries, 24/7 on-trip concierge, visa support, and transparent all-inclusive holiday packages.
					</p>
					<ul className="canvas-info">
						<li className="flex-three">
							<i className="icon-noun-mail-5780740-1" />
							<a href="mailto:goldentravelscbe@gmail.com" onClick={() => { window.location.href = 'mailto:goldentravelscbe@gmail.com' }} style={{ color: 'inherit', textDecoration: 'none' }}>goldentravelscbe@gmail.com</a>
						</li>
						<li className="flex-three">
							<i className="icon-Group-9" />
							<a href="tel:+919003546546" style={{ color: 'inherit', textDecoration: 'none' }}>+91 90035 46546 / 0422 2477090</a>
						</li>
						<li className="flex-three">
							<i className="icon-Layer-19" />
							<a href="https://www.google.com/maps/search/?api=1&query=Harmony+Arcade+428+D+B+Road+R+S+Puram+Coimbatore+641002" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>Harmony arcade, 428, D B Road, R S Puram, Coimbatore – 641002</a>
						</li>
					</ul>
					<ul className="social flex-three" style={{ gap: '10px' }}>
						<li>
							<a href="https://www.facebook.com/photo/?fbid=482086857261193&set=a.482086827261196" target="_blank" rel="noopener noreferrer" title="Facebook">
								<i className="icon-icon-2" />
							</a>
						</li>
						<li>
							<a href="https://www.instagram.com/goldentravelscbe/?hl=en#" target="_blank" rel="noopener noreferrer" title="Instagram">
								<i className="icon-icon_03" />
							</a>
						</li>
						<li>
							<a href="https://wa.me/919003546546" target="_blank" rel="noopener noreferrer" title="WhatsApp">
								<i className="icon-icon" />
							</a>
						</li>
					</ul>
				</div>
			</div>

		</>
	)
}
