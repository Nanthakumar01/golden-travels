import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { fetchPageMeta } from '../../services/api'

// In-memory cache for page meta to avoid repeated network hits
const metaCache = new Map()

const DEFAULT_TITLE = 'Golden Travels - Luxury Tours & Custom Holidays'
const DEFAULT_DESC = 'Golden Travels offers handcrafted international & domestic holiday packages, visa assistance, and bespoke luxury itineraries from Coimbatore.'
const DEFAULT_KEYWORDS = 'golden travels, tour packages, international holidays, domestic tours, luxury honeymoon packages, coimbatore travel agency'

export const getBaseSiteUrl = () => {
	if (import.meta.env.VITE_SITE_URL) {
		return import.meta.env.VITE_SITE_URL.replace(/\/+$/, '')
	}
	if (typeof window !== 'undefined' && window.location) {
		return window.location.origin
	}
	return 'https://goldentravels.in'
}

export default function SEO({
	pageKey,
	title,
	description,
	keywords,
	image,
	canonical,
	type = 'website',
	schema
}) {
	const location = useLocation()
	const [dbMeta, setDbMeta] = useState(pageKey && metaCache.has(pageKey) ? metaCache.get(pageKey) : null)

	useEffect(() => {
		let isMounted = true

		if (pageKey) {
			if (metaCache.has(pageKey)) {
				setDbMeta(metaCache.get(pageKey))
			} else {
				fetchPageMeta(pageKey)
					.then((res) => {
						if (isMounted && res && res.data) {
							metaCache.set(pageKey, res.data)
							setDbMeta(res.data)
						}
					})
					.catch(() => {})
			}
		}

		return () => {
			isMounted = false
		}
	}, [pageKey])

	useEffect(() => {
		const origin = window.location.origin
		const siteBase = getBaseSiteUrl()
		const currentPath = location.pathname + location.search

		// Determine effective values (Explicit Props > DB Meta > Defaults)
		const effectiveTitle = title || (dbMeta && dbMeta.metaTitle) || DEFAULT_TITLE
		const effectiveDesc = description || (dbMeta && dbMeta.metaDescription) || DEFAULT_DESC
		const effectiveKeywords = keywords || (dbMeta && dbMeta.metaKeywords) || DEFAULT_KEYWORDS
		
		let rawImage = image || (dbMeta && dbMeta.ogImage) || '/assets/images/page/breakcrumb.jpg'
		if (rawImage && !rawImage.startsWith('http')) {
			rawImage = `${origin}${rawImage.startsWith('/') ? '' : '/'}${rawImage}`
		}
		const effectiveImage = rawImage

		const canonicalRaw = canonical || (dbMeta && dbMeta.canonicalUrl) || currentPath
		let effectiveCanonical = canonicalRaw

		// Dynamic environment resolution: adapt to local, test, or production env
		if (canonicalRaw.startsWith('http')) {
			const isLocalOrTest = siteBase.includes('localhost') || siteBase.includes('127.0.0.1') || siteBase.includes('test.') || siteBase.includes('staging.')
			if (isLocalOrTest && canonicalRaw.includes('goldentravels.in')) {
				const pathOnly = canonicalRaw.replace(/^https?:\/\/[^/]+/, '')
				effectiveCanonical = `${siteBase}${pathOnly}`
			}
		} else {
			effectiveCanonical = `${siteBase}${canonicalRaw.startsWith('/') ? '' : '/'}${canonicalRaw}`
		}

		// 1. Update Title
		document.title = effectiveTitle

		// 2. Helper to set or create meta tag
		const updateMeta = (attrKey, attrVal, contentVal) => {
			if (!contentVal) return
			let el = document.querySelector(`meta[${attrKey}="${attrVal}"]`)
			if (!el) {
				el = document.createElement('meta')
				el.setAttribute(attrKey, attrVal)
				document.head.appendChild(el)
			}
			el.setAttribute('content', contentVal)
		}

		// Standard SEO Meta Tags
		updateMeta('name', 'description', effectiveDesc)
		updateMeta('name', 'keywords', effectiveKeywords)
		updateMeta('name', 'robots', 'index, follow')

		// Open Graph / Facebook / WhatsApp Preview
		updateMeta('property', 'og:site_name', 'Golden Travels')
		updateMeta('property', 'og:type', type)
		updateMeta('property', 'og:title', effectiveTitle)
		updateMeta('property', 'og:description', effectiveDesc)
		updateMeta('property', 'og:image', effectiveImage)
		updateMeta('property', 'og:url', effectiveCanonical)

		// Twitter Card
		updateMeta('name', 'twitter:card', 'summary_large_image')
		updateMeta('name', 'twitter:title', effectiveTitle)
		updateMeta('name', 'twitter:description', effectiveDesc)
		updateMeta('name', 'twitter:image', effectiveImage)

		// 3. Update Canonical Link
		let canonicalLink = document.querySelector('link[rel="canonical"]')
		if (!canonicalLink) {
			canonicalLink = document.createElement('link')
			canonicalLink.setAttribute('rel', 'canonical')
			document.head.appendChild(canonicalLink)
		}
		canonicalLink.setAttribute('href', effectiveCanonical)

		// 4. Update Schema.org JSON-LD
		let schemaData = schema
		if (!schemaData) {
			if (pageKey === 'home') {
				schemaData = {
					'@context': 'https://schema.org',
					'@type': 'TravelAgency',
					'name': 'Golden Travels',
					'url': origin,
					'logo': `${origin}/assets/images/logo/logo.png`,
					'image': effectiveImage,
					'description': effectiveDesc,
					'address': {
						'@type': 'PostalAddress',
						'addressLocality': 'Coimbatore',
						'addressRegion': 'Tamil Nadu',
						'addressCountry': 'IN'
					},
					'telephone': '+91 93630 25252',
					'priceRange': '₹₹₹',
					'openingHours': 'Mo-Sa 09:30-19:30'
				}
			} else if (pageKey === 'contact') {
				schemaData = {
					'@context': 'https://schema.org',
					'@type': 'ContactPage',
					'name': effectiveTitle,
					'description': effectiveDesc,
					'url': effectiveCanonical
				}
			} else if (pageKey === 'about') {
				schemaData = {
					'@context': 'https://schema.org',
					'@type': 'AboutPage',
					'name': effectiveTitle,
					'description': effectiveDesc,
					'url': effectiveCanonical
				}
			}
		}

		let scriptEl = document.querySelector('script#gt-seo-jsonld')
		if (schemaData) {
			if (!scriptEl) {
				scriptEl = document.createElement('script')
				scriptEl.id = 'gt-seo-jsonld'
				scriptEl.type = 'application/ld+json'
				document.head.appendChild(scriptEl)
			}
			scriptEl.textContent = JSON.stringify(schemaData)
		} else if (scriptEl) {
			scriptEl.remove()
		}
	}, [pageKey, dbMeta, title, description, keywords, image, canonical, type, schema, location.pathname, location.search])

	return null
}
