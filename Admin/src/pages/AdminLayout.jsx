import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
	IconDashboard,
	IconPackages,
	IconSliders,
	IconPersonas,
	IconDestinations,
	IconFeatures,
	IconTestimonials,
	IconFaqs,
	IconInquiries,
	IconBlog,
	IconGlobe,
	IconMenu,
	IconClose
} from '@/components/Icons'

export default function AdminLayout({ children, title = "Admin Portal" }) {
	const navigate = useNavigate()
	const location = useLocation()
	const [admin, setAdmin] = useState(null)
	const [sidebarOpen, setSidebarOpen] = useState(false)

	useEffect(() => {
		const token = localStorage.getItem('gt_admin_token')
		const userStr = localStorage.getItem('gt_admin_user')
		if (!token) {
			navigate('/login')
		} else if (userStr) {
			try {
				setAdmin(JSON.parse(userStr))
			} catch (e) {
				setAdmin({ username: 'Admin' })
			}
		}
	}, [navigate])

	const handleLogout = () => {
		localStorage.removeItem('gt_admin_token')
		localStorage.removeItem('gt_admin_user')
		navigate('/login')
	}

	const navItems = [
		{ label: 'Dashboard', path: '/', icon: <IconDashboard size={18} /> },
		{ label: 'Tour Packages', path: '/packages', icon: <IconPackages size={18} /> },
		{ label: 'Sliders & Banners', path: '/sliders-banners', icon: <IconSliders size={18} /> },
		{ label: 'Personalized Experience', path: '/personas', icon: <IconPersonas size={18} /> },
		{ label: 'Destinations ', path: '/destinations', icon: <IconDestinations size={18} /> },
		{ label: 'Why Choose Us', path: '/features', icon: <IconFeatures size={18} /> },
		{ label: 'Client Stories', path: '/testimonials', icon: <IconTestimonials size={18} /> },
		{ label: 'FAQs ', path: '/faqs', icon: <IconFaqs size={18} /> },
		{ label: 'Blogs', path: '/blogs', icon: <IconBlog size={18} /> },
		{ label: 'SEO & Meta Tags', path: '/seo', icon: <IconGlobe size={18} /> },
		{ label: 'Customer Enquiries', path: '/inquiries', icon: <IconInquiries size={18} /> },
	]

	return (
		<div style={{ minHeight: '100vh', display: 'flex', backgroundColor: '#f8fafc', color: '#0f172a', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
			<style>{`
				.admin-sidebar {
					width: 270px;
					background: #ffffff;
					border-right: 1px solid #e2e8f0;
					display: flex;
					flex-direction: column;
					position: fixed;
					top: 0;
					bottom: 0;
					left: 0;
					z-index: 100;
					box-shadow: 2px 0 12px rgba(0,0,0,0.03);
					transition: transform 0.3s ease;
				}
				.admin-main {
					flex: 1;
					margin-left: 270px;
					min-height: 100vh;
					display: flex;
					flex-direction: column;
					background: #f8fafc;
				}
				.admin-nav-link {
					display: flex;
					align-items: center;
					gap: 12px;
					padding: 12px 16px;
					border-radius: 12px;
					color: #475569;
					text-decoration: none;
					font-weight: 700;
					font-size: 13.5px;
					transition: all 0.2s ease;
					margin-bottom: 4px;
				}
				.admin-nav-link:hover {
					background: #f1f5f9;
					color: #0f172a;
				}
				.admin-nav-link.active {
					background: #ecfdf5;
					color: #15803d;
					box-shadow: 0 2px 8px rgba(22,163,74,0.12);
					border-left: 3px solid #16a34a;
				}
				.admin-nav-link.active svg {
					stroke: #16a34a;
				}
				@media (max-width: 991px) {
					.admin-sidebar {
						transform: translateX(-100%);
					}
					.admin-sidebar.open {
						transform: translateX(0);
					}
					.admin-main {
						margin-left: 0;
					}
				}
			`}</style>

			{/* Sidebar */}
			<aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
				{/* Official Logo Header */}
				<div style={{ padding: '22px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
					<Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
						<div
							style={{
								width: '44px',
								height: '44px',
								borderRadius: '50%',
								border: '2px solid #E5A91E',
								background: '#ffffff',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								padding: '2px',
								boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
								flexShrink: 0
							}}
						>
							<img
								src="/assets/images/logo/golden-travels-emblem.png"
								alt="Golden Travels"
								style={{ width: '100%', height: '100%', objectFit: 'contain' }}
							/>
						</div>
						<div>
							<div style={{ display: 'flex', alignItems: 'center', gap: '4px', lineHeight: 1 }}>
								<span style={{ color: '#E5A91E', fontWeight: '900', fontSize: '15px', letterSpacing: '0.04em' }}>GOLDEN</span>
								<span style={{ color: '#3A5A20', fontWeight: '900', fontSize: '15px', letterSpacing: '0.04em' }}>TRAVELS</span>
							</div>
							<span style={{ display: 'block', fontSize: '10px', color: '#16a34a', fontWeight: '800', letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: '3px' }}>
								Admin Portal
							</span>
						</div>
					</Link>
					{sidebarOpen && (
						<button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
							<IconClose size={20} />
						</button>
					)}
				</div>

				{/* Nav Menu */}
				<div style={{ padding: '20px 14px', flex: 1, overflowY: 'auto' }}>
					<div style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px', paddingLeft: '8px' }}>
						Management
					</div>
					{navItems.map((item) => {
						const isActive = location.pathname === item.path
						return (
							<Link
								key={item.path}
								to={item.path}
								className={`admin-nav-link ${isActive ? 'active' : ''}`}
								onClick={() => setSidebarOpen(false)}
							>
								<span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.icon}</span>
								<span>{item.label}</span>
							</Link>
						)
					})}
				</div>

				{/* User Profile & Logout */}
				<div style={{ padding: '16px 18px', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fafafa' }}>
					<div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
						<div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #16a34a, #0f7a37)', display: 'grid', placeItems: 'center', fontWeight: '800', color: '#fff', fontSize: '14px', flexShrink: 0 }}>
							{admin?.username ? admin.username[0].toUpperCase() : 'A'}
						</div>
						<div style={{ minWidth: 0 }}>
							<p style={{ margin: 0, fontSize: '13.5px', fontWeight: '700', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
								{admin?.username || 'admin'}
							</p>
						</div>
					</div>
					<button
						onClick={handleLogout}
						title="Logout"
						style={{ background: '#fee2e2', border: '1px solid #fca5a5', color: '#dc2626', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '700' }}
					>
						Exit
					</button>
				</div>
			</aside>

			{/* Main Content Area */}
			<div className="admin-main">
				{/* Top Header */}
				<header style={{ height: '70px', background: '#ffffff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', position: 'sticky', top: 0, zIndex: 90 }}>
					<div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
						<button
							onClick={() => setSidebarOpen(!sidebarOpen)}
							style={{ display: 'none', background: 'none', border: 'none', color: '#0f172a', cursor: 'pointer', alignItems: 'center', justifyContent: 'center' }}
							className="d-lg-none"
							aria-label="Toggle menu"
						>
							<IconMenu size={22} />
						</button>
						<h1 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
							{title}
						</h1>
					</div>

					<div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
						{/* Clean header area */}
					</div>
				</header>

				{/* Body Content */}
				<main style={{ padding: '32px', flex: 1 }}>
					{children}
				</main>
			</div>
		</div>
	)
}
