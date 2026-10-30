import React, { useState, useEffect } from 'react'
import Layout from "@/components/layout/Layout"
import Slider3 from "@/components/sections/Slider3"
import TravelerPersona from "@/components/sections/TravelerPersona"
import ExclusivePackages from "@/components/sections/ExclusivePackages"
import TrustStats from "@/components/sections/TrustStats"
import TopDestination4 from "@/components/sections/TopDestination4"
import WhyChooseUs from "@/components/sections/WhyChooseUs"
import Faq from "@/components/sections/Faq"
import CtaBanner from "@/components/sections/CtaBanner"
import Testimonial3 from "@/components/sections/Testimonial3"
import BrandLogoSlider from "@/components/slider/BrandLogoSlider"
import { openInquiryModal } from "@/components/elements/InquiryModal"
import { fetchAllContent } from "@/services/api"
import SEO from "@/components/elements/SEO"

export default function Home() {
	const [activePersona, setActivePersona] = useState("")
	const [contentData, setContentData] = useState(null)

	useEffect(() => {
		const loadContent = async () => {
			try {
				const res = await fetchAllContent()
				if (res && res.success && res.data) {
					setContentData(res.data)
				}
			} catch (e) {
				// Seamless fallback to static defaults in components
			}
		}
		loadContent()
	}, [])

	const handleOpenInquiry = (payload = "") => {
		openInquiryModal(payload)
	}

	const handleSelectPersona = (persona) => {
		const targetUrl = typeof persona === 'object'
			? (persona.slug ? (persona.slug.startsWith('/') ? persona.slug : `/tour/${persona.slug}`) : (persona.link && persona.link !== '/tour' && persona.link !== '#' ? persona.link : ''))
			: ''

		if (targetUrl) {
			window.location.href = targetUrl
			return
		}

		const personaId = typeof persona === 'object' ? persona.id : persona
		setActivePersona(personaId)
		// Smooth scroll to packages
		const pkgEl = document.getElementById('exclusive-packages')
		if (pkgEl) {
			pkgEl.scrollIntoView({ behavior: 'smooth' })
		}
	}

	return (
		<Layout headerStyle={3} footerStyle={1}>
			<SEO pageKey="home" />
			{/* 1. Hero Slider */}
			<Slider3 onOpenInquiry={handleOpenInquiry} slidesData={contentData?.slides} />

			{/* 3. Who's Coming Along? Persona Selector (Pickyourtrail style) */}
			<TravelerPersona
				activePersona={activePersona}
				onSelectPersona={handleSelectPersona}
				onOpenInquiry={handleOpenInquiry}
				personasData={contentData?.personas}
				sectionHeader={contentData?.sections?.persona}
			/>

			{/* 4. Curated Holiday Packages with INR Pricing */}
			<div id="exclusive-packages">
				<ExclusivePackages
					activePersona={activePersona}
					onOpenInquiry={handleOpenInquiry}
					sectionHeader={contentData?.sections?.exclusive_packages}
				/>
			</div>

			{/* 5. Trust & Authority Stats (Benny's Royal Tours style) */}
			<TrustStats statsData={contentData?.trustStats} />

			{/* 6. Trending Global Destinations */}
			<TopDestination4
				packagesData={contentData?.packages}
				destinationsData={contentData?.destinations}
				sectionHeader={contentData?.sections?.explore_world || contentData?.sections?.destinations}
			/>

			{/* 7. Why 50,000+ Travelers Choose Us (Value Pillars) */}
			<WhyChooseUs
				onOpenInquiry={handleOpenInquiry}
				featuresData={contentData?.features}
				sectionHeader={contentData?.sections?.why_choose_us}
			/>

			{/* 8. Real Traveler Reviews & Testimonials */}
			<Testimonial3
				testimonialsData={contentData?.testimonials}
				sectionHeader={contentData?.sections?.client_stories || contentData?.sections?.testimonials}
			/>

			{/* 9. Airline & Hospitality Partner Brands */}
			<BrandLogoSlider />

			{/* 10. Frequently Asked Questions */}
			<Faq
				faqsData={contentData?.faqs}
				sectionHeader={contentData?.sections?.faq || contentData?.sections?.faqs}
			/>

			{/* Banner CTA */}
			<CtaBanner slidesData={contentData?.slides} />
		</Layout>
	)
}
