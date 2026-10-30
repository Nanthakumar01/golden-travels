import React, { useState } from 'react';

export default function Faq({ faqsData, sectionHeader }) {
	const [isAccordion, setIsAccordion] = useState(null)
	const handleAccordion = (key) => {
		setIsAccordion(prevState => prevState === key ? null : key)
	}

	const defaultFaqs = [
		{
			id: 1,
			question: 'Can I customize my tour package according to my dates and budget?',
			answer: 'Absolutely! Every itinerary at Golden Travels is 100% customizable. You can adjust the number of days, hotel category (4★/5★), sightseeing activities, private transfers, and meal plans according to your exact preference.'
		},
		{
			id: 2,
			question: 'How does Golden Travels assist with visas and documentation?',
			answer: 'Our dedicated visa concierge team provides end-to-end documentation assistance, appointment scheduling, cover letter drafting, and biometric guidance with an industry-leading 99.2% approval success rate.'
		},
		{
			id: 3,
			question: 'What kind of support is provided while traveling on the trip?',
			answer: 'You will have access to a 24/7 dedicated on-trip concierge manager on WhatsApp and phone. From flight updates to local driver coordination and emergency assistance, our team is always just a text away.'
		},
		{
			id: 4,
			question: 'What are the payment terms and refund policies?',
			answer: 'We offer flexible payment milestone plans with transparent pricing. You can book your package with an initial deposit, and the balance can be paid in convenient installments before departure. Zero hidden charges guaranteed.'
		}
	]

	const faqs = (faqsData && faqsData.length > 0) ? faqsData : defaultFaqs
	const badgeText = sectionHeader?.badge || 'Got Questions?'
	const titleText = sectionHeader?.title || 'Frequently Asked Questions'
	const imageSrc = sectionHeader?.bgImage || sectionHeader?.bg_image || '/assets/images/tour/tour-details.jpg'

	return (
		<section style={{ padding: '48px 0', backgroundColor: '#ffffff' }}>
			<div className="tf-container">
				<div className="row align-items-center">
					<div className="col-md-5">
						<div className="image-faq scroll-reveal reveal-fade-left" style={{ textAlign: 'center', padding: '20px' }}>
							<img src={imageSrc} alt="Travel FAQ" className="floating-elem" style={{ width: '100%', height: '100%', minHeight: '400px', objectFit: 'cover', borderRadius: '24px', boxShadow: '0 15px 40px rgba(0,0,0,0.1)' }} />
						</div>
					</div>
					<div className="col-md-7">
						<div className="content-faq scroll-reveal reveal-fade-right">
							<div style={{ marginBottom: '24px' }}>
								<span className="sub-title-heading text-main font-yes fs-28-46">
									{badgeText}
								</span>
								<h2 className="title-heading" style={{ marginTop: '4px' }}>
									{titleText.includes('Questions') ? (
										<>
											{titleText.replace(/Questions/i, '').trim()}{' '}
											<span className="text-gray font-yes">Questions</span>
										</>
									) : (
										titleText
									)}
								</h2>
							</div>
							<div className="accordion faq-list" id="accordionExample">
								{faqs.map((faq, index) => (
									<div
										key={faq.id}
										className={`accordion-item scroll-reveal stagger-delay-${index + 1}`}
										style={{
											marginBottom: '12px',
											borderRadius: '12px',
											border: isAccordion === faq.id ? '1px solid #16a34a' : '1px solid #e5e7eb',
											overflow: 'hidden',
											transition: 'all 0.3s ease',
											boxShadow: isAccordion === faq.id ? '0 4px 15px rgba(22, 163, 74, 0.08)' : 'none'
										}}
									>
										<h2 className="accordion-header">
											<button
												className={isAccordion === faq.id ? "accordion-button" : "accordion-button collapsed"}
												onClick={() => handleAccordion(faq.id)}
												style={{ fontSize: '15px', fontWeight: '700', color: isAccordion === faq.id ? '#16a34a' : '#111827', padding: '16px 20px', transition: 'color 0.25s ease' }}
											>
												{faq.question}
											</button>
										</h2>
										<div
											className={isAccordion === faq.id ? "accordion-collapse relative collapse show" : "accordion-collapse relative collapse"}
										>
											<div className="accordion-body" style={{ fontSize: '14px', color: '#6b7280', lineHeight: 1.6, padding: '0 20px 18px' }}>
												{faq.answer}
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
