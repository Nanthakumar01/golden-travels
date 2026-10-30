/**
 * Dynamic site URL utility for Golden Travels Admin
 * Returns the correct base URL depending on environment:
 * - Local development: http://localhost:3000 (or VITE_SITE_URL / VITE_CLIENT_URL / VITE_FRONTEND_URL)
 * - Test / Staging: e.g. https://test.goldentravels.in
 * - Production: https://goldentravels.in
 */
export const getSiteBaseUrl = () => {
	// 1. Explicit VITE_SITE_URL, VITE_CLIENT_URL, or VITE_FRONTEND_URL in .env
	const envUrl = import.meta.env.VITE_SITE_URL || import.meta.env.VITE_CLIENT_URL || import.meta.env.VITE_FRONTEND_URL
	if (envUrl) {
		return envUrl.replace(/\/+$/, '')
	}

	// 2. Dynamic check from current browser location
	if (typeof window !== 'undefined' && window.location) {
		const { hostname, protocol } = window.location

		// Localhost / 127.0.0.1 -> default client port 3000
		if (hostname === 'localhost' || hostname === '127.0.0.1') {
			return `${protocol}//localhost:3000`
		}

		// Test or Staging domain (e.g. admin.test.goldentravels.in -> https://test.goldentravels.in)
		if (hostname.includes('test') || hostname.includes('staging') || hostname.includes('dev')) {
			const cleanHost = hostname.replace(/^admin[-.]?/, '')
			return `${protocol}//${cleanHost}`
		}

		// Production domain
		if (hostname.includes('goldentravels.in')) {
			return 'https://goldentravels.in'
		}

		// Fallback for custom domains: strip admin prefix if present
		const clientHost = hostname.replace(/^admin[-.]?/, '')
		return `${protocol}//${clientHost}`
	}

	return 'https://goldentravels.in'
}

export const buildCanonicalUrl = (type, slug) => {
	const base = getSiteBaseUrl()
	if (!slug) return ''
	const path = type === 'blog' ? 'blog' : 'tour'
	return `${base}/${path}/${slug}`
}

/**
 * Resolves any canonical URL to always use the CURRENT environment base URL.
 * Automatically synchronizes with VITE_SITE_URL or the active environment (local / test / prod).
 */
export const resolveCanonicalUrl = (existingUrl, type = 'tour', fallbackSlug = '') => {
	const currentBase = getSiteBaseUrl()
	const pathSegment = type === 'blog' ? 'blog' : 'tour'

	if (!existingUrl) {
		return fallbackSlug ? `${currentBase}/${pathSegment}/${fallbackSlug}` : ''
	}

	// If it contains /tour/slug or /blog/slug
	const match = existingUrl.match(new RegExp(`/${pathSegment}/([^/?#]+)`))
	if (match && match[1]) {
		const slug = match[1]
		return `${currentBase}/${pathSegment}/${slug}`
	}

	// If it's a full standard URL, replace origin with currentBase
	if (existingUrl.startsWith('http://') || existingUrl.startsWith('https://')) {
		try {
			const parsed = new URL(existingUrl)
			return `${currentBase}${parsed.pathname}`
		} catch (_) {
			return existingUrl
		}
	}

	// If it was just a slug or relative path
	const cleanSlug = existingUrl.replace(new RegExp(`^/?(${pathSegment}/)?`), '').replace(/\/+$/, '')
	return cleanSlug ? `${currentBase}/${pathSegment}/${cleanSlug}` : ''
}

export const isStandardCanonicalUrl = (url, type) => {
	if (!url) return true
	const path = type === 'blog' ? 'blog' : 'tour'
	return (
		url.includes(`/${path}/`) ||
		url.startsWith('https://goldentravels.in/') ||
		url.startsWith('http://localhost') ||
		url.includes('test.goldentravels.in')
	)
}

/**
 * Resolves static page canonical URL (home, tours, blog, contact, etc.)
 * to always match the current environment base URL.
 */
export const resolvePageCanonicalUrl = (existingUrl, defaultRoute = '/') => {
	const currentBase = getSiteBaseUrl()
	const cleanRoute = (defaultRoute || '/').replace(/^\/+/, '').replace(/\/+$/, '')
	const expectedPath = cleanRoute ? `/${cleanRoute}` : '/'

	if (!existingUrl) {
		return `${currentBase}${expectedPath}`
	}

	// If existingUrl has an origin/protocol, preserve its path and swap to current environment base
	if (existingUrl.startsWith('http://') || existingUrl.startsWith('https://')) {
		try {
			const parsed = new URL(existingUrl)
			let pathname = parsed.pathname || '/'
			if (pathname.length > 1) {
				pathname = pathname.replace(/\/+$/, '')
			}
			return `${currentBase}${pathname}`
		} catch (_) {
			return `${currentBase}${expectedPath}`
		}
	}

	// Relative path
	const clean = existingUrl.replace(/^\/+/, '').replace(/\/+$/, '')
	return clean ? `${currentBase}/${clean}` : `${currentBase}/`
}

