import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ToastProvider } from './context/ToastContext'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import AdminPackages from './pages/AdminPackages'
import AdminPackageForm from './pages/AdminPackageForm'
import AdminInquiries from './pages/AdminInquiries'
import AdminSlidersBanners from './pages/AdminSlidersBanners'
import AdminPersonas from './pages/AdminPersonas'
import AdminDestinations from './pages/AdminDestinations'
import AdminFeatures from './pages/AdminFeatures'
import AdminTestimonials from './pages/AdminTestimonials'
import AdminFaqs from './pages/AdminFaqs'
import AdminBlogs from './pages/AdminBlogs'
import AdminSEO from './pages/AdminSEO'

// Protected Route wrapper
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('gt_admin_token')
  if (!token) {
    return <Navigate to="/login" replace />
  }
  return children
}

export default function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/packages" element={<ProtectedRoute><AdminPackages /></ProtectedRoute>} />
        <Route path="/packages/new" element={<ProtectedRoute><AdminPackageForm /></ProtectedRoute>} />
        <Route path="/packages/edit/:id" element={<ProtectedRoute><AdminPackageForm /></ProtectedRoute>} />
        <Route path="/sliders-banners" element={<ProtectedRoute><AdminSlidersBanners /></ProtectedRoute>} />
        <Route path="/sliders" element={<Navigate to="/sliders-banners" replace />} />
        <Route path="/personas" element={<ProtectedRoute><AdminPersonas /></ProtectedRoute>} />
        <Route path="/destinations" element={<ProtectedRoute><AdminDestinations /></ProtectedRoute>} />
        <Route path="/features" element={<ProtectedRoute><AdminFeatures /></ProtectedRoute>} />
        <Route path="/testimonials" element={<ProtectedRoute><AdminTestimonials /></ProtectedRoute>} />
        <Route path="/faqs" element={<ProtectedRoute><AdminFaqs /></ProtectedRoute>} />
        <Route path="/blogs" element={<ProtectedRoute><AdminBlogs /></ProtectedRoute>} />
        <Route path="/seo" element={<ProtectedRoute><AdminSEO /></ProtectedRoute>} />
        <Route path="/inquiries" element={<ProtectedRoute><AdminInquiries /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ToastProvider>
  )
}


