import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from './AdminLayout'
import { fetchDashboardStats, fetchBlogs, fetchSlides, fetchBanners } from '@/services/api'
import {
	IconPlane,
	IconInquiries,
	IconBlog,
	IconSliders,
	IconPlus,
	IconPackages,
	IconWhatsApp
} from '@/components/Icons'

export default function AdminDashboard() {
	const [stats, setStats] = useState({
		packages: { total: 0, domestic: 0, international: 0, active: 0 },
		inquiries: { total: 0, new: 0, contacted: 0, converted: 0, today: 0 },
		blogs: { total: 0, active: 0 },
		sliders: { totalSlides: 0, totalBanners: 0, total: 0 },
		recentInquiries: []
	})
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const loadStats = async () => {
			try {
				const res = await fetchDashboardStats()
				let dashboardData = res.success && res.data ? res.data : {}

				// Seamless fallback if backend stats don't yet have blogs or sliders
				if (!dashboardData.blogs || !dashboardData.sliders) {
					try {
						const [blogsRes, slidesRes, bannersRes] = await Promise.allSettled([
							fetchBlogs(),
							fetchSlides(),
							fetchBanners()
						])

						const blogsList = blogsRes.status === 'fulfilled' && blogsRes.value?.data ? blogsRes.value.data : []
						const slidesList = slidesRes.status === 'fulfilled' && slidesRes.value?.data ? slidesRes.value.data : []
						const bannersList = bannersRes.status === 'fulfilled' && bannersRes.value?.data ? bannersRes.value.data : []

						if (!dashboardData.blogs) {
							dashboardData.blogs = {
								total: blogsList.length,
								active: blogsList.filter(b => b.isActive !== false).length
							}
						}
						if (!dashboardData.sliders) {
							dashboardData.sliders = {
								totalSlides: slidesList.length,
								activeSlides: slidesList.filter(s => s.isActive !== false).length,
								totalBanners: bannersList.length,
								total: slidesList.length + bannersList.length
							}
						}
					} catch (e) {
						// Ignore secondary fallback errors
					}
				}

				setStats(prev => ({
					...prev,
					...dashboardData
				}))
			} catch (err) {
				console.error('Failed to load stats:', err)
			} finally {
				setLoading(false)
			}
		}
		loadStats()
	}, [])

	const statusColors = {
		new: { bg: '#fef2f2', text: '#dc2626', border: '#fecaca' },
		contacted: { bg: '#fefce8', text: '#ca8a04', border: '#fef08a' },
		'in-progress': { bg: '#eff6ff', text: '#2563eb', border: '#bfdbfe' },
		converted: { bg: '#f0fdf4', text: '#16a34a', border: '#bbf7d0' },
		closed: { bg: '#f1f5f9', text: '#64748b', border: '#e2e8f0' }
	}

	return (
		<AdminLayout title="Dashboard Overview">
			{/* Metric Cards Row */}
			<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '20px', marginBottom: '28px' }}>
				
				{/* Card 1: Total Packages */}
				<Link to="/packages" style={{ textDecoration: 'none', color: 'inherit' }}>
					<div style={{ background: '#ffffff', padding: '24px', borderRadius: '18px', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.03)', height: '100%', boxSizing: 'border-box' }}>
						<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
							<span style={{ fontSize: '12px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Total Tour Packages</span>
							<span style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(22,163,74,0.1)', color: '#16a34a', display: 'grid', placeItems: 'center' }}>
								<IconPlane size={20} color="#16a34a" />
							</span>
						</div>
						<div style={{ fontSize: '32px', fontWeight: '900', color: '#0f172a', lineHeight: 1.1, marginBottom: '8px' }}>
							{loading ? '...' : (stats.packages?.total ?? 0)}
						</div>
						<div style={{ fontSize: '12.5px', color: '#64748b', display: 'flex', gap: '10px' }}>
							<span style={{ color: '#d97706', fontWeight: '600' }}>{(stats.packages?.international ?? 0)} Intl</span>
							<span>•</span>
							<span style={{ color: '#16a34a', fontWeight: '600' }}>{(stats.packages?.domestic ?? 0)} Domestic</span>
						</div>
					</div>
				</Link>

				{/* Card 2: Total Enquiries */}
				<Link to="/inquiries" style={{ textDecoration: 'none', color: 'inherit' }}>
					<div style={{ background: '#ffffff', padding: '24px', borderRadius: '18px', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.03)', height: '100%', boxSizing: 'border-box' }}>
						<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
							<span style={{ fontSize: '12px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Total Enquiries</span>
							<span style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(59,130,246,0.1)', color: '#2563eb', display: 'grid', placeItems: 'center' }}>
								<IconInquiries size={20} color="#2563eb" />
							</span>
						</div>
						<div style={{ fontSize: '32px', fontWeight: '900', color: '#0f172a', lineHeight: 1.1, marginBottom: '8px' }}>
							{loading ? '...' : (stats.inquiries?.total ?? 0)}
						</div>
						<div style={{ fontSize: '12.5px', color: '#64748b' }}>
							<span style={{ color: '#0284c7', fontWeight: '600' }}>{(stats.inquiries?.today ?? 0)} received today</span>
						</div>
					</div>
				</Link>

				{/* Card 3: Travel Blogs & Stories */}
				<Link to="/blogs" style={{ textDecoration: 'none', color: 'inherit' }}>
					<div style={{ background: '#ffffff', padding: '24px', borderRadius: '18px', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.03)', height: '100%', boxSizing: 'border-box' }}>
						<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
							<span style={{ fontSize: '12px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Travel Blogs</span>
							<span style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(147,51,234,0.1)', color: '#9333ea', display: 'grid', placeItems: 'center' }}>
								<IconBlog size={20} color="#9333ea" />
							</span>
						</div>
						<div style={{ fontSize: '32px', fontWeight: '900', color: '#0f172a', lineHeight: 1.1, marginBottom: '8px' }}>
							{loading ? '...' : (stats.blogs?.total ?? 0)}
						</div>
						<div style={{ fontSize: '12.5px', color: '#64748b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
							<span style={{ color: '#9333ea', fontWeight: '600' }}>{(stats.blogs?.active ?? stats.blogs?.total ?? 0)} Published</span>
							<span style={{ color: '#94a3b8', fontSize: '11.5px', fontWeight: '700' }}>Manage Blogs →</span>
						</div>
					</div>
				</Link>

				{/* Card 4: Sliders & Page Banners */}
				<Link to="/sliders-banners" style={{ textDecoration: 'none', color: 'inherit' }}>
					<div style={{ background: '#ffffff', padding: '24px', borderRadius: '18px', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.03)', height: '100%', boxSizing: 'border-box' }}>
						<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
							<span style={{ fontSize: '12px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Sliders &amp; Banners</span>
							<span style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(217,119,6,0.12)', color: '#d97706', display: 'grid', placeItems: 'center' }}>
								<IconSliders size={20} color="#d97706" />
							</span>
						</div>
						<div style={{ fontSize: '32px', fontWeight: '900', color: '#0f172a', lineHeight: 1.1, marginBottom: '8px' }}>
							{loading ? '...' : (stats.sliders?.total ?? ((stats.sliders?.totalSlides || 0) + (stats.sliders?.totalBanners || 0)))}
						</div>
						<div style={{ fontSize: '12.5px', color: '#64748b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
							<span style={{ color: '#d97706', fontWeight: '600' }}>
								{(stats.sliders?.totalSlides ?? 0)} Slides • {(stats.sliders?.totalBanners ?? 0)} Banners
							</span>
							<span style={{ color: '#94a3b8', fontSize: '11.5px', fontWeight: '700' }}>Edit Sliders →</span>
						</div>
					</div>
				</Link>

			</div>

			{/* Quick Action Buttons */}
			<div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '32px' }}>
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

				<Link
					to="/packages"
					style={{
						display: 'inline-flex',
						alignItems: 'center',
						gap: '8px',
						background: '#ffffff',
						color: '#0f172a',
						padding: '12px 20px',
						borderRadius: '12px',
						textDecoration: 'none',
						fontWeight: '700',
						fontSize: '14px',
						border: '1px solid #cbd5e1',
						boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
					}}
				>
					<IconPackages size={16} />
					<span>Manage Packages ({stats.packages.total})</span>
				</Link>

				<Link
					to="/inquiries"
					style={{
						display: 'inline-flex',
						alignItems: 'center',
						gap: '8px',
						background: '#ffffff',
						color: '#0f172a',
						padding: '12px 20px',
						borderRadius: '12px',
						textDecoration: 'none',
						fontWeight: '700',
						fontSize: '14px',
						border: '1px solid #cbd5e1',
						boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
					}}
				>
					<IconInquiries size={16} />
					<span>View Inquiries ({stats.inquiries?.total ?? 0})</span>
				</Link>

				<Link
					to="/blogs"
					style={{
						display: 'inline-flex',
						alignItems: 'center',
						gap: '8px',
						background: '#ffffff',
						color: '#0f172a',
						padding: '12px 20px',
						borderRadius: '12px',
						textDecoration: 'none',
						fontWeight: '700',
						fontSize: '14px',
						border: '1px solid #cbd5e1',
						boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
					}}
				>
					<IconBlog size={16} color="#9333ea" />
					<span>Manage Blogs ({stats.blogs?.total ?? 0})</span>
				</Link>

				<Link
					to="/sliders-banners"
					style={{
						display: 'inline-flex',
						alignItems: 'center',
						gap: '8px',
						background: '#ffffff',
						color: '#0f172a',
						padding: '12px 20px',
						borderRadius: '12px',
						textDecoration: 'none',
						fontWeight: '700',
						fontSize: '14px',
						border: '1px solid #cbd5e1',
						boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
					}}
				>
					<IconSliders size={16} color="#d97706" />
					<span>Sliders &amp; Banners</span>
				</Link>
			</div>

			{/* Recent Enquiries Table */}
			<div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
					<div>
						<h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0' }}>
							Recent Customer Enquiries &amp; Leads
						</h3>
						<p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
							Live submissions from Golden Travels website and enquiry modals
						</p>
					</div>
					<Link to="/inquiries" style={{ color: '#16a34a', fontSize: '13px', fontWeight: '700', textDecoration: 'none' }}>
						View All Leads →
					</Link>
				</div>

				{loading ? (
					<div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading recent enquiries...</div>
				) : stats.recentInquiries.length === 0 ? (
					<div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>No customer enquiries yet.</div>
				) : (
					<div style={{ overflowX: 'auto' }}>
						<table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
							<thead>
								<tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
									<th style={{ padding: '12px 14px', fontWeight: '700' }}>CUSTOMER</th>
									<th style={{ padding: '12px 14px', fontWeight: '700' }}>PHONE</th>
									<th style={{ padding: '12px 14px', fontWeight: '700' }}>DESTINATION</th>
									<th style={{ padding: '12px 14px', fontWeight: '700' }}>TRAVEL DATE</th>
									<th style={{ padding: '12px 14px', fontWeight: '700' }}>STATUS</th>
									<th style={{ padding: '12px 14px', fontWeight: '700', textAlign: 'right' }}>ACTION</th>
								</tr>
							</thead>
							<tbody>
								{stats.recentInquiries.map((inq) => {
									const st = statusColors[inq.status] || statusColors.new
									const waPhone = inq.phone.replace(/[^0-9]/g, '')
									const waLink = `https://wa.me/${waPhone.length === 10 ? '91' + waPhone : waPhone}?text=${encodeURIComponent(`Hi ${inq.name}, thank you for enquiring with Golden Travels regarding ${inq.destination || 'your holiday'}!`)}`
									return (
										<tr key={inq.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
											<td style={{ padding: '14px', fontWeight: '700', color: '#0f172a' }}>
												{inq.name}
												{inq.email && <span style={{ display: 'block', fontSize: '11.5px', color: '#64748b', fontWeight: '500' }}>{inq.email}</span>}
											</td>
											<td style={{ padding: '14px', color: '#475569', fontWeight: '500' }}>
												{inq.phone}
											</td>
											<td style={{ padding: '14px', color: '#d97706', fontWeight: '700' }}>
												{inq.destination || 'Custom Tour'}
											</td>
											<td style={{ padding: '14px', color: '#64748b' }}>
												{inq.travelDate || inq.month || 'Flexible'}
											</td>
											<td style={{ padding: '14px' }}>
												<span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', background: st.bg, color: st.text, border: `1px solid ${st.border}` }}>
													{inq.status}
												</span>
											</td>
											<td style={{ padding: '14px', textAlign: 'right' }}>
												<a
													href={waLink}
													target="_blank"
													rel="noopener noreferrer"
													style={{
														display: 'inline-flex',
														alignItems: 'center',
														gap: '6px',
														background: '#25D366',
														color: '#fff',
														padding: '6px 12px',
														borderRadius: '8px',
														textDecoration: 'none',
														fontWeight: '700',
														fontSize: '12px',
														boxShadow: '0 2px 6px rgba(37,211,102,0.2)'
													}}
												>
													<IconWhatsApp size={14} color="#ffffff" />
													<span>WhatsApp</span>
												</a>
											</td>
										</tr>
									)
								})}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</AdminLayout>
	)
}
