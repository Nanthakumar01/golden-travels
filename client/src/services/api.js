const getApiBase = () => {
	// If explicit env var is set and not localhost, use it
	const envUrl = import.meta.env.VITE_API_URL
	if (envUrl && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
		return envUrl.replace(/\/+$/, '')
	}
	// In browser environment, check hostname
	if (typeof window !== 'undefined' && window.location) {
		const hostname = window.location.hostname
		const protocol = window.location.protocol || 'http:'
		// Local development
		if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.') || hostname.startsWith('10.')) {
			return `${protocol}//${hostname}:5000/api`
		}
		// In live production, default to /api if not explicitly set
		return envUrl ? envUrl.replace(/\/+$/, '') : `${protocol}//${hostname}/api`
	}
	return envUrl || 'http://localhost:5000/api'
}

const API_BASE = getApiBase()

// Helper for authorized headers
const authHeaders = () => {
	const token = localStorage.getItem('gt_admin_token')
	return {
		'Content-Type': 'application/json',
		...(token ? { Authorization: `Bearer ${token}` } : {})
	}
}

// ----------------- AUTH -----------------
export const adminLogin = async (username, password) => {
	if (!API_BASE) throw new Error('API server not configured')
	const res = await fetch(`${API_BASE}/auth/login`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ username, password })
	})
	const data = await res.json()
	if (!res.ok) throw new Error(data.message || 'Login failed')
	return data
}

export const getAdminProfile = async () => {
	if (!API_BASE) return { success: false }
	const res = await fetch(`${API_BASE}/auth/me`, {
		headers: authHeaders()
	})
	return await res.json()
}

// ----------------- PACKAGES -----------------
export const fetchPackages = async (params = {}) => {
	if (!API_BASE) return { success: false, data: [] }
	try {
		const query = new URLSearchParams(params).toString()
		const url = `${API_BASE}/packages${query ? `?${query}` : ''}`
		const res = await fetch(url)
		if (!res.ok) throw new Error('Failed to fetch packages')
		return await res.json()
	} catch (e) {
		return { success: false, data: [] }
	}
}

export const fetchPackageByIdOrSlug = async (idOrSlug) => {
	if (!API_BASE) return { success: false, data: null }
	try {
		const res = await fetch(`${API_BASE}/packages/${idOrSlug}`)
		if (!res.ok) throw new Error('Failed to fetch package')
		return await res.json()
	} catch (e) {
		return { success: false, data: null }
	}
}

export const createPackage = async (packageData) => {
	const res = await fetch(`${API_BASE}/packages`, {
		method: 'POST',
		headers: authHeaders(),
		body: JSON.stringify(packageData)
	})
	const data = await res.json()
	if (!res.ok) throw new Error(data.message || 'Failed to create package')
	return data
}

export const updatePackage = async (id, packageData) => {
	const res = await fetch(`${API_BASE}/packages/${id}`, {
		method: 'PUT',
		headers: authHeaders(),
		body: JSON.stringify(packageData)
	})
	const data = await res.json()
	if (!res.ok) throw new Error(data.message || 'Failed to update package')
	return data
}

export const deletePackage = async (id) => {
	const res = await fetch(`${API_BASE}/packages/${id}`, {
		method: 'DELETE',
		headers: authHeaders()
	})
	const data = await res.json()
	if (!res.ok) throw new Error(data.message || 'Failed to delete package')
	return data
}

// ----------------- INQUIRIES -----------------
export const submitInquiry = async (inquiryData) => {
	const res = await fetch(`${API_BASE}/inquiries`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(inquiryData)
	})
	return await res.json()
}

export const fetchInquiries = async (status = '') => {
	const url = `${API_BASE}/inquiries${status ? `?status=${status}` : ''}`
	const res = await fetch(url, { headers: authHeaders() })
	if (!res.ok) throw new Error('Failed to fetch inquiries')
	return await res.json()
}

export const updateInquiryStatus = async (id, status, notes = '') => {
	const res = await fetch(`${API_BASE}/inquiries/${id}`, {
		method: 'PUT',
		headers: authHeaders(),
		body: JSON.stringify({ status, notes })
	})
	const data = await res.json()
	if (!res.ok) throw new Error(data.message || 'Failed to update inquiry')
	return data
}

export const deleteInquiry = async (id) => {
	const res = await fetch(`${API_BASE}/inquiries/${id}`, {
		method: 'DELETE',
		headers: authHeaders()
	})
	const data = await res.json()
	if (!res.ok) throw new Error(data.message || 'Failed to delete inquiry')
	return data
}

// ----------------- STATS -----------------
export const fetchDashboardStats = async () => {
	const res = await fetch(`${API_BASE}/stats`, { headers: authHeaders() })
	if (!res.ok) throw new Error('Failed to fetch dashboard stats')
	return await res.json()
}

export const fetchAllContent = async () => {
	try {
		const res = await fetch(`${API_BASE}/content/all`)
		if (!res.ok) return null
		return await res.json()
	} catch (err) {
		return null
	}
}

export const fetchBanners = async () => {
	try {
		const res = await fetch(`${API_BASE}/content/banners`)
		if (!res.ok) return null
		return await res.json()
	} catch (err) {
		return null
	}
}

export const fetchSlides = async () => {
	try {
		const res = await fetch(`${API_BASE}/content/slides`)
		if (!res.ok) return null
		return await res.json()
	} catch (err) {
		return null
	}
}

export const fetchDestinations = async () => {
	try {
		const res = await fetch(`${API_BASE}/content/destinations`)
		if (!res.ok) return null
		return await res.json()
	} catch (err) {
		return null
	}
}

export const fetchDestinationGroups = async () => {
	try {
		const res = await fetch(`${API_BASE}/content/destination-groups`)
		if (!res.ok) return null
		return await res.json()
	} catch (err) {
		return null
	}
}

export const submitReview = async (reviewData) => {
	const res = await fetch(`${API_BASE}/content/testimonials`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(reviewData)
	})
	const data = await res.json()
	if (!res.ok) throw new Error(data.message || 'Failed to submit review')
	return data
}

export const fetchBlogs = async () => {
	try {
		const res = await fetch(`${API_BASE}/content/blogs`)
		if (!res.ok) return null
		return await res.json()
	} catch (err) {
		return null
	}
}

export const fetchBlogBySlug = async (slug) => {
	try {
		const res = await fetch(`${API_BASE}/content/blogs/${slug}`)
		if (!res.ok) return null
		return await res.json()
	} catch (err) {
		return null
	}
}

export const fetchPageMeta = async (pageKey) => {
	try {
		const res = await fetch(`${API_BASE}/content/seo/${pageKey}`)
		if (!res.ok) return null
		return await res.json()
	} catch (err) {
		return null
	}
}

export const fetchPartners = async (params = {}) => {
	try {
		const query = new URLSearchParams(params).toString()
		const res = await fetch(`${API_BASE}/content/partners${query ? `?${query}` : ''}`)
		if (!res.ok) return { success: false, data: [] }
		return await res.json()
	} catch (err) {
		return { success: false, data: [] }
	}
}

export default {
	adminLogin,
	getAdminProfile,
	fetchPackages,
	fetchPackageByIdOrSlug,
	createPackage,
	updatePackage,
	deletePackage,
	submitInquiry,
	fetchInquiries,
	updateInquiryStatus,
	deleteInquiry,
	fetchDashboardStats,
	fetchAllContent,
	fetchBanners,
	submitReview,
	fetchBlogs,
	fetchBlogBySlug,
	fetchPageMeta,
	fetchPartners
}

