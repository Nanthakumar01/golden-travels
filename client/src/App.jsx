import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

// Pages
import Home from './pages/Home';
import ArchiveTour from './pages/ArchiveTour';
import TourPackageV2 from './pages/TourPackageV2';
import TourSingle from './pages/TourSingle';
import TourDestinationV1 from './pages/TourDestinationV1';
import SingleDestination from './pages/SingleDestination';
import Blog from './pages/Blog';
import BlogSingle from './pages/BlogSingle';
import ContactUs from './pages/ContactUs';

function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    try {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });
    } catch {
      window.scrollTo(0, 0);
    }
  }, [pathname, search, hash]);

  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/archieve-tour" element={<ArchiveTour />} />
        <Route path="/tour" element={<TourPackageV2 />} />
        <Route path="/tour-package-v2" element={<TourPackageV2 />} />
        <Route path="/tour-packages" element={<TourPackageV2 />} />
        <Route path="/tour/:slug" element={<TourSingle />} />
        <Route path="/north-east-program" element={<TourSingle />} />
        <Route path="/tour-destination-v1" element={<TourDestinationV1 />} />
        <Route path="/destinations" element={<TourDestinationV1 />} />
        <Route path="/single-destination" element={<SingleDestination />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogSingle />} />
        <Route path="/contact-us" element={<ContactUs />} />

        <Route path="*" element={<Home />} />
      </Routes>
    </>
  );
}
