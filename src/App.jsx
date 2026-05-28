import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { UserProvider } from './contexts/UserContext'
import ProtectedRoute from './components/ProtectedRoute'
import LoadingSpinner from './components/LoadingSpinner'
import { useAuth } from './hooks/useAuth'

// Pages
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import DonorProfileSetup from './pages/DonorProfileSetup'
import DonorDashboard from './pages/DonorDashboard'
import DonorProfile from './pages/DonorProfile'
import RequestDetail from './pages/RequestDetail'
import SearchDonors from './pages/SearchDonors'
import SendRequest from './pages/SendRequest'
import MyRequests from './pages/MyRequests'
import NotFound from './pages/NotFound'
import Navbar from './components/Navbar'

function AppContent() {
  const { currentUser, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {currentUser && <Navbar />}
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Donor routes */}
        <Route
          path="/donor/setup"
          element={
            <ProtectedRoute requiredRole="donor">
              <DonorProfileSetup />
            </ProtectedRoute>
          }
        />
        <Route
          path="/donor/dashboard"
          element={
            <ProtectedRoute requiredRole="donor">
              <DonorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/donor/:donorId"
          element={<DonorProfile />}
        />
        <Route
          path="/receiver/donor/:donorId"
          element={<DonorProfile />}
        />
        <Route
          path="/donor/requests/:requestId"
          element={
            <ProtectedRoute requiredRole="donor">
              <RequestDetail />
            </ProtectedRoute>
          }
        />

        {/* Receiver routes */}
        <Route
          path="/receiver/search"
          element={
            <ProtectedRoute requiredRole="receiver">
              <SearchDonors />
            </ProtectedRoute>
          }
        />
        <Route
          path="/receiver/requests/:donorId/send"
          element={
            <ProtectedRoute requiredRole="receiver">
              <SendRequest />
            </ProtectedRoute>
          }
        />
        <Route
          path="/receiver/requests"
          element={
            <ProtectedRoute requiredRole="receiver">
              <MyRequests />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <UserProvider>
          <AppContent />
        </UserProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
