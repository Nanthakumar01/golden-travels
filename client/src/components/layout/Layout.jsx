import React, { useEffect, useState } from "react"
import AddClassBody from "../elements/AddClassBody"
import BackToTop from '../elements/BackToTop'
import Breadcrumb from './Breadcrumb'
import Footer from './Footer'
import Header from './Header'
import OffcanvasModal from "./OffcanvasModal"
import WhatsAppFloat from "../elements/WhatsAppFloat"
import InquiryModal from "../elements/InquiryModal"
import { fetchBanners } from "@/services/api"

const DEFAULT_BANNERS = {
	tours: {
		pageKey: 'tours',
		title: 'Tour Packages',
		subtitle: 'Handcrafted holiday packages tailored for every travel style',
		bgImage: '/uploads/tour-1791823074893-747405157.jpg'
	},
	blog: {
		pageKey: 'blog',
		title: 'Travel Stories & Guides',
		subtitle: 'Insider tips, destination highlights and travel inspiration',
		bgImage: '/uploads/tour-1791823117834-917129456.jpg'
	},
	contact: {
		pageKey: 'contact',
		title: 'Get In Touch',
		subtitle: 'Speak directly with our destination travel specialists',
		bgImage: '/uploads/tour-1791823134415-737644623.jpg'
	}
}

export default function Layout({ breadcrumbTitle, breadcrumbSubtitle, breadcrumbBgImage, pageKey, children }) {
	const [scroll, setScroll] = useState(0)
	const [dynamicBanner, setDynamicBanner] = useState(pageKey ? DEFAULT_BANNERS[pageKey] || null : null)

	useEffect(() => {
		if (pageKey) {
			setDynamicBanner(DEFAULT_BANNERS[pageKey] || null)
			fetchBanners().then(res => {
				if (res && res.success && res.data) {
					const b = res.data.find(x => x.pageKey === pageKey)
					if (b) setDynamicBanner(b)
				}
			}).catch(() => {})
		}
	}, [pageKey])
	
	// Mobile Menu
	const [isMobileMenu, setMobileMenu] = useState(false)
	const handleMobileMenu = () => {
		setMobileMenu(prev => !prev)
	}

	useEffect(() => {
		if (isMobileMenu) {
			document.body.classList.add("mobile-menu-visible")
		} else {
			document.body.classList.remove("mobile-menu-visible")
		}
		return () => {
			document.body.classList.remove("mobile-menu-visible")
		}
	}, [isMobileMenu])

	// Offcanvas
	const [isOffcanvas, setOffcanvas] = useState(false)
	const handleOffcanvas = () => setOffcanvas(!isOffcanvas)

	// Search
	const [isSearch, setSearch] = useState(false)
	const handleSearch = () => setSearch((isOpen) => !isOpen)

	// Inquiry Modal
	const [isInquiryOpen, setIsInquiryOpen] = useState(false)
	const [selectedPackage, setSelectedPackage] = useState("")
	const [selectedPackageData, setSelectedPackageData] = useState(null)

	const handleOpenInquiry = (payload = "") => {
		if (payload && typeof payload === 'object') {
			setSelectedPackageData(payload)
			setSelectedPackage(payload.packageName || payload.destination || "")
		} else {
			setSelectedPackageData(null)
			setSelectedPackage(typeof payload === 'string' ? payload : "")
		}
		setIsInquiryOpen(true)
	}

	const handleCloseInquiry = () => {
		setIsInquiryOpen(false)
	}

	useEffect(() => {
		const onGlobalOpenInquiry = (e) => {
			handleOpenInquiry(e.detail || "")
		}
		window.addEventListener('open-inquiry-modal', onGlobalOpenInquiry)
		return () => {
			window.removeEventListener('open-inquiry-modal', onGlobalOpenInquiry)
		}
	}, [])

	useEffect(() => {
		// Dynamic & Responsive Scroll Reveal Observer
		const revealSelectors = '.scroll-reveal, .reveal-fade-up, .reveal-fade-left, .reveal-fade-right, .reveal-scale, .wow'

		const observeElements = () => {
			const elements = document.querySelectorAll(revealSelectors)
			if ('IntersectionObserver' in window) {
				const observer = new IntersectionObserver(
					(entries) => {
						entries.forEach((entry) => {
							if (entry.isIntersecting) {
								entry.target.classList.add('is-visible', 'animated')
								observer.unobserve(entry.target)
							}
						})
					},
					{ threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
				)
				elements.forEach((el) => {
					if (!el.classList.contains('is-visible')) {
						observer.observe(el)
					}
				})
			} else {
				elements.forEach((el) => el.classList.add('is-visible', 'animated'))
			}
		}

		observeElements()

		// Safety timeout: ensure everything is visible
		const timer = setTimeout(() => {
			document.querySelectorAll(revealSelectors).forEach((el) => {
				el.classList.add('is-visible')
			})
		}, 1200)

		const onScroll = () => {
			setScroll(window.scrollY > 140)
		}

		window.addEventListener("scroll", onScroll, { passive: true })
		return () => {
			clearTimeout(timer)
			window.removeEventListener("scroll", onScroll)
		}
	}, [])

	return (
		<>
			<div id="top" />
			<AddClassBody />
			<div id="wrapper">
				<div id="pagee" className="clearfix">
					<Header
						scroll={scroll}
						isMobileMenu={isMobileMenu}
						handleMobileMenu={handleMobileMenu}
						handleOffcanvas={handleOffcanvas}
						isSearch={isSearch}
						handleSearch={handleSearch}
						onOpenInquiry={handleOpenInquiry}
					/>
					<main className="main">
						{breadcrumbTitle && (
							<Breadcrumb
								breadcrumbTitle={dynamicBanner?.title || breadcrumbTitle}
								subtitle={dynamicBanner?.subtitle || breadcrumbSubtitle}
								bgImage={dynamicBanner?.bgImage || breadcrumbBgImage}
							/>
						)}
						{typeof children === 'function' ? children({ onOpenInquiry: handleOpenInquiry }) : children}
					</main>

					<Footer />
				</div>
			</div>
			<BackToTop target="#top" />
			<OffcanvasModal isOffcanvas={isOffcanvas} handleOffcanvas={handleOffcanvas} />
			<WhatsAppFloat />
			<InquiryModal
				isOpen={isInquiryOpen}
				onClose={handleCloseInquiry}
				packageName={selectedPackage}
				packageData={selectedPackageData}
			/>
		</>
	)
}
