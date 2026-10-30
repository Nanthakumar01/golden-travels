import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Layout from "@/components/layout/Layout"
import Link from '@/components/elements/Link'
import { fetchBlogBySlug } from '@/services/api'
import { defaultArticles } from './Blog'
import SEO, { getBaseSiteUrl } from '@/components/elements/SEO'
import { IconCalendar, IconAuthor } from '@/components/common/Icons'

export default function BlogSingle() {
	const { slug } = useParams()
	const [blog, setBlog] = useState(null)

	useEffect(() => {
		if (!slug) {
			setBlog(defaultArticles[0])
			return
		}
		fetchBlogBySlug(slug).then(res => {
			if (res && res.success && res.data) {
				setBlog(res.data)
			} else {
				const found = defaultArticles.find(a => a.slug === slug) || defaultArticles[0]
				setBlog(found)
			}
		})
	}, [slug])

	const current = blog || defaultArticles[0]

	// Helper to render rich HTML or linkify any raw URLs in content
	const renderFormattedStoryContent = (raw) => {
		if (!raw) return null
		const str = String(raw).trim()
		if (!str) return null

		// Replace standalone URLs with clickable links if not already inside an <a> tag
		const linkify = (input) => {
			return input.replace(/(<a\s+[^>]*>[\s\S]*?<\/a>)|(https?:\/\/[^\s<>"']+)/gi, (match, existingLink, url) => {
				if (existingLink) return existingLink
				return `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: #16a34a; text-decoration: underline; font-weight: 700; word-break: break-all;">${url}</a>`
			})
		}

		const hasHtml = /<[a-z][\s\S]*>/i.test(str)
		const processed = linkify(str)

		if (hasHtml) {
			return (
				<div
					className="blog-rich-content"
					style={{ marginBottom: '20px', lineHeight: 1.8, color: '#334155' }}
					dangerouslySetInnerHTML={{ __html: processed }}
				/>
			)
		}

		const paras = processed.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean)
		if (paras.length === 0) return null

		return paras.map((p, pIdx) => (
			<p
				key={pIdx}
				style={{ marginBottom: '20px', textAlign: 'justify', textJustify: 'inter-word', lineHeight: 1.8 }}
				dangerouslySetInnerHTML={{ __html: p.replace(/\n/g, '<br/>') }}
			/>
		))
	}

	const blogSchema = current.title ? {
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		'headline': current.title,
		'image': current.image,
		'author': {
			'@type': 'Person',
			'name': current.author || 'Golden Travels Specialist'
		},
		'publisher': {
			'@type': 'Organization',
			'name': 'Golden Travels'
		},
		'description': current.metaDescription || current.excerpt || '',
		'datePublished': current.date || new Date().toISOString()
	} : null

	return (
		<Layout headerStyle={3} footerStyle={1} pageKey="blog" breadcrumbTitle={current.title || "Blog Article"}>
			<SEO
				title={current.metaTitle || (current.title ? `${current.title} | Golden Travels` : undefined)}
				description={current.metaDescription || current.excerpt || undefined}
				keywords={current.metaKeywords || (current.title ? `${current.title}, ${current.category || ''}, travel guide, golden travels` : undefined)}
				image={current.image}
				canonical={current.canonicalUrl || (current.slug ? `${getBaseSiteUrl()}/blog/${current.slug}` : undefined)}
				type="article"
				schema={blogSchema}
			/>
			<section style={{ padding: '60px 0', backgroundColor: '#ffffff' }}>
				<div className="tf-container">
					<div className="row justify-content-center">
						<div className="col-lg-8 col-md-10">
							{/* Back to Blog link */}
							<div style={{ marginBottom: '20px' }}>
								<Link
									href="/blog"
									style={{
										color: '#16a34a',
										fontSize: '14px',
										fontWeight: '700',
										textDecoration: 'none',
										display: 'inline-flex',
										alignItems: 'center',
										gap: '6px'
									}}
								>
									← Back to All Stories
								</Link>
							</div>

							{/* Header */}
							<div style={{ textAlign: 'center', marginBottom: '30px' }}>
								<span style={{ backgroundColor: '#16a34a', color: '#ffffff', padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'inline-block', marginBottom: '16px' }}>
									{current.category || 'Travel Guide'}
								</span>
								<h1 style={{ fontSize: '38px', fontWeight: '900', color: '#0f172a', lineHeight: 1.3, marginBottom: '20px' }}>
									{current.title}
								</h1>
								<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', fontSize: '14px', color: '#64748b', fontWeight: '500', flexWrap: 'wrap' }}>
									<span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
										<IconCalendar size={14} color="#64748b" /> {current.date}
									</span>
									<span>•</span>
									<span>{current.readTime}</span>
									{current.author && (
										<>
											<span>•</span>
											<span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
												<IconAuthor size={14} color="#64748b" /> {current.author}
											</span>
										</>
									)}
								</div>
							</div>

							{/* Hero Media (Image or Video) */}
							<div style={{ width: '100%', height: '420px', borderRadius: '24px', overflow: 'hidden', marginBottom: '40px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', backgroundColor: '#0f172a' }}>
								{/\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(current.image || '') ? (
									<video
										src={current.image}
										controls
										autoPlay
										muted
										loop
										playsInline
										style={{ width: '100%', height: '100%', objectFit: 'cover' }}
									/>
								) : (
									<img 
										src={current.image} 
										alt={current.title} 
										style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
									/>
								)}
							</div>

							{/* Content: 1. Summary, 2. Heading, 3. Content */}
							<div style={{ fontSize: '16px', lineHeight: 1.8, color: '#334155' }}>
								{/* 1. Summary */}
								{current.excerpt && (
									<div style={{ marginBottom: '24px', fontSize: '18px', fontWeight: '500', color: '#0f172a', lineHeight: 1.7 }}>
										{renderFormattedStoryContent(current.excerpt)}
									</div>
								)}

								{/* Article Story Sections */}
								{Array.isArray(current.sections) && current.sections.length > 0 ? (
									current.sections.map((sec, sIdx) => (
										<div key={sIdx} style={{ marginBottom: '32px' }}>
											{sec.heading && (
												<h3 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', marginTop: sIdx === 0 ? '24px' : '36px', marginBottom: '16px', textAlign: 'left' }}>
													{sec.heading}
												</h3>
											)}
											{renderFormattedStoryContent(sec.content)}
										</div>
									))
								) : (
									<>
										{/* 2. Heading (Legacy) */}
										{current.heading && (
											<h3 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', marginTop: '36px', marginBottom: '16px', textAlign: 'left' }}>
												{current.heading}
											</h3>
										)}

										{/* 3. Content (Legacy) */}
										{current.content ? (
											renderFormattedStoryContent(current.content)
										) : (
											<p style={{ marginBottom: '20px', textAlign: 'justify', textJustify: 'inter-word' }}>
												Explore this destination with Golden Travels' customized holiday itineraries, complete visa assistance, and 24/7 on-trip concierge support.
											</p>
										)}
									</>
								)}
							</div>
						</div>
					</div>
				</div>
			</section>
		</Layout>
	)
}

