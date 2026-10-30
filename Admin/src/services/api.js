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
	const res = await fetch(`${API_BASE}/auth/me`, {
		headers: authHeaders()
	})
	return await res.json()
}

// ----------------- PACKAGES -----------------
export const fetchPackages = async (params = {}) => {
	const query = new URLSearchParams(params).toString()
	const url = `${API_BASE}/packages${query ? `?${query}` : ''}`
	const res = await fetch(url)
	if (!res.ok) throw new Error('Failed to fetch packages')
	return await res.json()
}

export const fetchPackageByIdOrSlug = async (idOrSlug) => {
	const res = await fetch(`${API_BASE}/packages/${idOrSlug}`)
	if (!res.ok) throw new Error('Failed to fetch package')
	return await res.json()
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

// ----------------- UPLOAD -----------------
export const uploadImage = async (file) => {
	const formData = new FormData()
	formData.append('image', file)
	const token = localStorage.getItem('gt_admin_token')
	const res = await fetch(`${API_BASE}/upload`, {
		method: 'POST',
		headers: token ? { Authorization: `Bearer ${token}` } : {},
		body: formData
	})
	const data = await res.json()
	if (!res.ok) throw new Error(data.message || 'Upload failed')
	return data
}

// ----------------- HOME & PAGE CONTENT -----------------
export const fetchAllContent = async () => {
	const res = await fetch(`${API_BASE}/content/all`)
	if (!res.ok) throw new Error('Failed to fetch site content')
	return await res.json()
}

// 1. Sliders & Banners
export const fetchSlides = async () => {
	const res = await fetch(`${API_BASE}/content/slides`)
	return await res.json()
}
export const updateSlide = async (id, data) => {
	const res = await fetch(`${API_BASE}/content/slides/${id}`, {
		method: 'PUT',
		headers: authHeaders(),
		body: JSON.stringify(data)
	})
	return await res.json()
}
export const createSlide = async (data) => {
	const res = await fetch(`${API_BASE}/content/slides`, {
		method: 'POST',
		headers: authHeaders(),
		body: JSON.stringify(data)
	})
	return await res.json()
}
export const deleteSlide = async (id) => {
	const res = await fetch(`${API_BASE}/content/slides/${id}`, {
		method: 'DELETE',
		headers: authHeaders()
	})
	return await res.json()
}

export const fetchBanners = async () => {
	const res = await fetch(`${API_BASE}/content/banners`)
	return await res.json()
}
export const updateBanner = async (id, data) => {
	const res = await fetch(`${API_BASE}/content/banners/${id}`, {
		method: 'PUT',
		headers: authHeaders(),
		body: JSON.stringify(data)
	})
	return await res.json()
}

// 2. Personas
export const fetchPersonas = async () => {
	const res = await fetch(`${API_BASE}/content/personas`)
	return await res.json()
}
export const createPersona = async (data) => {
	const res = await fetch(`${API_BASE}/content/personas`, {
		method: 'POST',
		headers: authHeaders(),
		body: JSON.stringify(data)
	})
	return await res.json()
}
export const updatePersona = async (id, data) => {
	const res = await fetch(`${API_BASE}/content/personas/${id}`, {
		method: 'PUT',
		headers: authHeaders(),
		body: JSON.stringify(data)
	})
	return await res.json()
}
export const deletePersona = async (id) => {
	const res = await fetch(`${API_BASE}/content/personas/${id}`, {
		method: 'DELETE',
		headers: authHeaders()
	})
	return await res.json()
}

// 4. Destinations (Explore The World)
export const fetchDestinations = async () => {
	const res = await fetch(`${API_BASE}/content/destinations`)
	return await res.json()
}
export const createDestination = async (data) => {
	const res = await fetch(`${API_BASE}/content/destinations`, {
		method: 'POST',
		headers: authHeaders(),
		body: JSON.stringify(data)
	})
	const result = await res.json()
	if (!res.ok) throw new Error(result.message || 'Failed to create destination')
	return result
}
export const updateDestination = async (id, data) => {
	const res = await fetch(`${API_BASE}/content/destinations/${id}`, {
		method: 'PUT',
		headers: authHeaders(),
		body: JSON.stringify(data)
	})
	const result = await res.json()
	if (!res.ok) throw new Error(result.message || 'Failed to update destination')
	return result
}
export const deleteDestination = async (id) => {
	const res = await fetch(`${API_BASE}/content/destinations/${id}`, {
		method: 'DELETE',
		headers: authHeaders()
	})
	const result = await res.json()
	if (!res.ok) throw new Error(result.message || 'Failed to delete destination')
	return result
}

// 4b. Destination Regions & Countries Hierarchy (International & Domestic)
export const fetchDestinationRegions = async () => {
	const res = await fetch(`${API_BASE}/content/destination-regions`)
	const result = await res.json()
	if (!res.ok) throw new Error(result.message || 'Failed to fetch destination regions')
	return result
}
export const fetchDestinationGroups = async () => {
	const res = await fetch(`${API_BASE}/content/destination-groups`)
	const result = await res.json()
	if (!res.ok) throw new Error(result.message || 'Failed to fetch destination groups')
	return result
}
export const createDestinationRegion = async (data) => {
	const res = await fetch(`${API_BASE}/content/destination-regions`, {
		method: 'POST',
		headers: authHeaders(),
		body: JSON.stringify(data)
	})
	const result = await res.json()
	if (!res.ok) throw new Error(result.message || 'Failed to create destination region')
	return result
}
export const updateDestinationRegion = async (id, data) => {
	const res = await fetch(`${API_BASE}/content/destination-regions/${id}`, {
		method: 'PUT',
		headers: authHeaders(),
		body: JSON.stringify(data)
	})
	const result = await res.json()
	if (!res.ok) throw new Error(result.message || 'Failed to update destination region')
	return result
}
export const deleteDestinationRegion = async (id) => {
	const res = await fetch(`${API_BASE}/content/destination-regions/${id}`, {
		method: 'DELETE',
		headers: authHeaders()
	})
	const result = await res.json()
	if (!res.ok) throw new Error(result.message || 'Failed to delete destination region')
	return result
}
export const addCountryToRegion = async (id, data) => {
	const res = await fetch(`${API_BASE}/content/destination-regions/${id}/countries`, {
		method: 'POST',
		headers: authHeaders(),
		body: JSON.stringify(data)
	})
	const result = await res.json()
	if (!res.ok) throw new Error(result.message || 'Failed to add country to region')
	return result
}
export const deleteCountryFromRegion = async (id, countryName) => {
	const res = await fetch(`${API_BASE}/content/destination-regions/${id}/countries/${encodeURIComponent(countryName)}`, {
		method: 'DELETE',
		headers: authHeaders()
	})
	const result = await res.json()
	if (!res.ok) throw new Error(result.message || 'Failed to delete country from region')
	return result
}

// 4. Features (Why Choose Us)
export const fetchFeatures = async () => {
	const res = await fetch(`${API_BASE}/content/features`)
	return await res.json()
}
export const createFeature = async (data) => {
	const res = await fetch(`${API_BASE}/content/features`, {
		method: 'POST',
		headers: authHeaders(),
		body: JSON.stringify(data)
	})
	return await res.json()
}
export const updateFeature = async (id, data) => {
	const res = await fetch(`${API_BASE}/content/features/${id}`, {
		method: 'PUT',
		headers: authHeaders(),
		body: JSON.stringify(data)
	})
	return await res.json()
}
export const deleteFeature = async (id) => {
	const res = await fetch(`${API_BASE}/content/features/${id}`, {
		method: 'DELETE',
		headers: authHeaders()
	})
	return await res.json()
}

// 4b. Trust & Authority Stats (25+ Years, 50,000+ Travelers, etc.)
export const fetchTrustStats = async () => {
	const res = await fetch(`${API_BASE}/content/trust-stats`)
	return await res.json()
}
export const createTrustStat = async (data) => {
	const res = await fetch(`${API_BASE}/content/trust-stats`, {
		method: 'POST',
		headers: authHeaders(),
		body: JSON.stringify(data)
	})
	return await res.json()
}
export const updateTrustStat = async (id, data) => {
	const res = await fetch(`${API_BASE}/content/trust-stats/${id}`, {
		method: 'PUT',
		headers: authHeaders(),
		body: JSON.stringify(data)
	})
	return await res.json()
}
export const deleteTrustStat = async (id) => {
	const res = await fetch(`${API_BASE}/content/trust-stats/${id}`, {
		method: 'DELETE',
		headers: authHeaders()
	})
	return await res.json()
}

// 4. Testimonials (Client Stories)
export const fetchTestimonials = async () => {
	const res = await fetch(`${API_BASE}/content/testimonials`)
	return await res.json()
}
export const createTestimonial = async (data) => {
	const res = await fetch(`${API_BASE}/content/testimonials`, {
		method: 'POST',
		headers: authHeaders(),
		body: JSON.stringify(data)
	})
	return await res.json()
}
export const updateTestimonial = async (id, data) => {
	const res = await fetch(`${API_BASE}/content/testimonials/${id}`, {
		method: 'PUT',
		headers: authHeaders(),
		body: JSON.stringify(data)
	})
	return await res.json()
}
export const deleteTestimonial = async (id) => {
	const res = await fetch(`${API_BASE}/content/testimonials/${id}`, {
		method: 'DELETE',
		headers: authHeaders()
	})
	return await res.json()
}

// 5. FAQs
export const fetchFaqs = async () => {
	const res = await fetch(`${API_BASE}/content/faqs`)
	return await res.json()
}
export const createFaq = async (data) => {
	const res = await fetch(`${API_BASE}/content/faqs`, {
		method: 'POST',
		headers: authHeaders(),
		body: JSON.stringify(data)
	})
	return await res.json()
}
export const updateFaq = async (id, data) => {
	const res = await fetch(`${API_BASE}/content/faqs/${id}`, {
		method: 'PUT',
		headers: authHeaders(),
		body: JSON.stringify(data)
	})
	return await res.json()
}
export const deleteFaq = async (id) => {
	const res = await fetch(`${API_BASE}/content/faqs/${id}`, {
		method: 'DELETE',
		headers: authHeaders()
	})
	return await res.json()
}

// Section Headers
export const fetchSections = async () => {
	const res = await fetch(`${API_BASE}/content/sections`)
	return await res.json()
}
export const updateSection = async (sectionKey, data) => {
	const res = await fetch(`${API_BASE}/content/sections/${sectionKey}`, {
		method: 'PUT',
		headers: authHeaders(),
		body: JSON.stringify(data)
	})
	return await res.json()
}

// 6. Blogs
export const fetchBlogs = async () => {
	const res = await fetch(`${API_BASE}/content/blogs`)
	return await res.json()
}
export const createBlog = async (data) => {
	const res = await fetch(`${API_BASE}/content/blogs`, {
		method: 'POST',
		headers: authHeaders(),
		body: JSON.stringify(data)
	})
	return await res.json()
}
export const updateBlog = async (id, data) => {
	const res = await fetch(`${API_BASE}/content/blogs/${id}`, {
		method: 'PUT',
		headers: authHeaders(),
		body: JSON.stringify(data)
	})
	return await res.json()
}
export const deleteBlog = async (id) => {
	const res = await fetch(`${API_BASE}/content/blogs/${id}`, {
		method: 'DELETE',
		headers: authHeaders()
	})
	return await res.json()
}

// 7. SEO & Page Meta
export const fetchPageMetaList = async () => {
	const res = await fetch(`${API_BASE}/content/seo`)
	return await res.json()
}
export const fetchPageMetaByKey = async (pageKey) => {
	const res = await fetch(`${API_BASE}/content/seo/${pageKey}`)
	return await res.json()
}
export const updatePageMeta = async (pageKey, data) => {
	const res = await fetch(`${API_BASE}/content/seo/${pageKey}`, {
		method: 'PUT',
		headers: authHeaders(),
		body: JSON.stringify(data)
	})
	return await res.json()
}

// 8. Partners & Marquee
export const fetchPartners = async (params = {}) => {
	const query = new URLSearchParams(params).toString()
	const res = await fetch(`${API_BASE}/content/partners${query ? `?${query}` : ''}`)
	return await res.json()
}
export const createPartner = async (data) => {
	const res = await fetch(`${API_BASE}/content/partners`, {
		method: 'POST',
		headers: authHeaders(),
		body: JSON.stringify(data)
	})
	return await res.json()
}
export const updatePartner = async (id, data) => {
	const res = await fetch(`${API_BASE}/content/partners/${id}`, {
		method: 'PUT',
		headers: authHeaders(),
		body: JSON.stringify(data)
	})
	return await res.json()
}
export const deletePartner = async (id) => {
	const res = await fetch(`${API_BASE}/content/partners/${id}`, {
		method: 'DELETE',
		headers: authHeaders()
	})
	return await res.json()
}



