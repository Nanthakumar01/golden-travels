/**
 * Benny's Royal Tours Destination Structure for Golden Travels
 * Covers all International Continents & India Regions with all country/state lists
 */

export const DESTINATION_GROUPS = [
	{
		group: 'International',
		regions: [
			{
				id: 'north-america',
				name: 'North America',
				countries: [
					'Antigua and Barbuda', 'Barbados', 'Belize',
					'Canada', 'Costa Rica', 'Cuba',
					'Dominica', 'Dominican Republic', 'El Salvador',
					'Grenada', 'Guatemala', 'Haiti',
					'Honduras', 'Jamaica', 'Mexico',
					'Nicaragua', 'Panama', 'Saint Kitts and Nevis',
					'Saint Lucia', 'Saint Vincent and the Grenadines', 'The Bahamas',
					'United States', 'West Indies'
				]
			},
			{
				id: 'south-america',
				name: 'South America',
				countries: [
					'Argentina', 'Bolivia', 'Brazil',
					'Chile', 'Colombia', 'Ecuador',
					'Guyana', 'Paraguay', 'Peru',
					'Suriname', 'Trinidad and Tobago', 'Uruguay',
					'Venezuela'
				]
			},
			{
				id: 'europe',
				name: 'Europe',
				countries: [
					'Albania', 'Andorra', 'Austria',
					'Belarus', 'Belgium', 'Bosnia and Herzegovina',
					'Bulgaria', 'Croatia', 'Cyprus',
					'Czechia', 'Denmark', 'England',
					'Estonia', 'Finland', 'France',
					'Georgia', 'Germany', 'Greece',
					'Hungary', 'Iceland', 'Ireland',
					'Italy', 'Latvia', 'Liechtenstein',
					'Lithuania', 'Luxembourg', 'Malta',
					'Moldova', 'Monaco', 'Montenegro',
					'Netherlands', 'North Macedonia', 'Northern Ireland',
					'Norway', 'Poland', 'Portugal',
					'Republic Of Ireland', 'Romania', 'San Marino',
					'Scotland', 'Serbia', 'Slovakia',
					'Slovenia', 'Spain', 'Sweden',
					'Switzerland', 'Turkey', 'Ukraine',
					'United Kingdom (UK)', 'Vatican', 'Wales'
				]
			},
			{
				id: 'africa',
				name: 'Africa',
				countries: [
					'Algeria', 'Angola', 'Benin',
					'Botswana', 'Burkina Faso', 'Burundi',
					'Cabo Verde', 'Cameroon', 'Central African Republic',
					'Chad', 'Comoros', 'Congo',
					'Djibouti', 'Egypt', 'Equatorial Guinea',
					'Eritrea', 'Eswatini', 'Ethiopia',
					'Gabon', 'Gambia', 'Ghana',
					'Guinea', 'Guinea Bissau', 'Ivory Coast',
					'Kenya', 'Lesotho', 'Liberia',
					'Libya', 'Madagascar', 'Malawi',
					'Mali', 'Mauritania', 'Mauritius',
					'Mozambique', 'Morocco', 'Namibia',
					'Niger', 'Nigeria', 'Rwanda',
					'Sao Tome And Príncipe', 'Senegal', 'Sierra Leone',
					'Somalia', 'South Africa', 'South Sudan',
					'Sudan', 'Tanzania', 'Togo',
					'Tunisia', 'Uganda', 'Zambia',
					'Zimbabwe'
				]
			},
			{
				id: 'asia',
				name: 'Asia',
				countries: [
					'Afghanistan', 'Armenia', 'Azerbaijan',
					'Bahrain', 'Bangladesh', 'Bhutan',
					'Brunei', 'Cambodia', 'China',
					'East Timor', 'Indonesia', 'Iran',
					'Iraq', 'Israel', 'Japan',
					'Jordan', 'Kazakhstan', 'North Korea',
					'South Korea', 'Kuwait', 'Kyrgyzstan',
					'Laos', 'Lebanon', 'Malaysia',
					'Maldives', 'Mongolia', 'Myanmar',
					'Nepal', 'Oman', 'Pakistan',
					'Palestine', 'Philippines', 'Qatar',
					'Russia', 'Saudi Arabia', 'Seychelles',
					'Singapore', 'Sri Lanka', 'Syria',
					'Taiwan', 'Tajikistan', 'Thailand',
					'Turkmenistan', 'U.A.E', 'Uzbekistan',
					'Vietnam', 'Yemen'
				]
			},
			{
				id: 'oceania',
				name: 'Oceani',
				countries: [
					'Australia', 'Fiji', 'Kiribati',
					'Marshall Islands', 'Micronesia', 'Nauru',
					'New Zealand', 'Palau', 'Papua New Guinea',
					'Samoa', 'Solomon Islands', 'Tonga',
					'Tuvalu', 'Vanuatu'
				]
			},
			{
				id: 'antarctica',
				name: 'Antarctica',
				countries: [
					'Antarctica'
				]
			}
		]
	},
	{
		group: 'India',
		regions: [
			{
				id: 'east-northeast-india',
				name: 'East & North East India',
				countries: [
					'Arunachal Pradesh', 'Assam', 'Bihar',
					'Jharkhand', 'Manipur', 'Meghalaya',
					'Mizoram', 'Nagaland', 'Odisha',
					'Sikkim', 'Tripura', 'West Bengal'
				]
			},
			{
				id: 'west-central-india',
				name: 'West & Central India',
				countries: [
					'Chhattisgarh', 'Goa', 'Gujarat',
					'Madhya Pradesh', 'Maharashtra', 'Rajasthan'
				]
			},
			{
				id: 'north-india',
				name: 'North India',
				countries: [
					'Delhi (National Capital Territory)', 'Haryana', 'Himachal Pradesh',
					'Jammu and Kashmir', 'Punjab', 'Rajasthan',
					'Uttar Pradesh', 'Uttarakhand'
				]
			},
			{
				id: 'south-india',
				name: 'South India',
				countries: [
					'Andhra Pradesh', 'Karnataka', 'Kerala',
					'Tamil Nadu', 'Telangana'
				]
			},
			{
				id: 'union-territories',
				name: 'Union Territories',
				countries: [
					'Andaman and Nicobar Island', 'Chandigarh',
					'Dadra and Nagar Haveli and Daman and Diu', 'Delhi',
					'Jammu and Kashmir', 'Ladakh', 'Lakshadweep',
					'Puducherry'
				]
			}
		]
	}
]

/**
 * Direct mapping dictionary for known packages
 */
export const KNOWN_DESTINATION_PACKAGES = {
	'vietnam': 'vietnam-beauty-of-vietnam',
	'taiwan': 'taiwan-taipei-explorer',
	'spain': 'spain-barcelona-madrid',
	'south korea': 'south-korea-seoul-busan',
	'philippines': 'philippines-manila-angeles-pagsanjan',
	'gujarat': 'rann-utsav-kutch',
	'rajasthan': 'rajasthan-royal-heritage',
	'odisha': 'puri-bhubaneswar-heritage',
	'andaman and nicobar island': 'andaman-islands-escape',
	'andaman': 'andaman-islands-escape',
	'assam': 'north-east-program',
	'meghalaya': 'north-east-program',
	'shillong': 'north-east-program'
}

/**
 * Checks whether a given destination has a matching package in the system.
 * Returns the matching package object or null.
 */
export const findPackageForDestination = (destInput, packages = []) => {
	if (!destInput) return null
	let destName = ''
	if (typeof destInput === 'object' && destInput !== null) {
		if (destInput.slug) {
			const found = packages.find(p => p.slug === destInput.slug)
			if (found) return found
			return { slug: destInput.slug, title: destInput.name || '' }
		}
		destName = destInput.name || ''
	} else if (typeof destInput === 'string') {
		destName = destInput
	}
	if (!destName || typeof destName !== 'string') return null
	const clean = destName.toLowerCase().trim()
	if (!clean) return null

	// 1. Check known direct map
	if (KNOWN_DESTINATION_PACKAGES[clean]) {
		const targetSlug = KNOWN_DESTINATION_PACKAGES[clean]
		const found = packages.find(p => p.slug === targetSlug)
		if (found) return found
		return { slug: targetSlug, title: destName }
	}

	// Escape special regex characters and match whole words
	const escaped = clean.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
	const wordRegex = new RegExp(`\\b${escaped}\\b`, 'i')

	// 2. Check full package array (destination, region, title, cities, tags)
	return packages.find(p => {
		const dest = (p.destination || '')
		const reg = (p.region || '')
		const title = (p.title || '')
		const cities = (p.cities || '')
		const slug = (p.slug || '').toLowerCase()
		const tags = Array.isArray(p.tags) ? p.tags.map(t => String(t).toLowerCase().trim()) : []

		return wordRegex.test(dest) ||
			wordRegex.test(reg) ||
			wordRegex.test(title) ||
			wordRegex.test(cities) ||
			slug === clean.replace(/\s+/g, '-') ||
			tags.some(t => t === clean)
	}) || null
}
