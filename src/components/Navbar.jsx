import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Navbar() {
  const { currentUser, userRole, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  const getDashboardLink = () => {
    if (userRole === 'admin') return '/admin/dashboard'
    return userRole === 'donor' ? '/donor/dashboard' : '/receiver/requests'
  }

  const getDashboardLabel = () => {
    return userRole === 'admin' ? 'Admin Panel' : userRole === 'donor' ? 'Dashboard' : 'My Requests'
  }

  const isActive = (path) => {
    if (path === '/admin/dashboard') return location.pathname.includes('/admin')
    if (path === '/donor/dashboard') return location.pathname.includes('/donor')
    if (path === '/receiver/requests') return location.pathname.includes('/receiver')
    return location.pathname === path
  }

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-white via-white to-gray-50 shadow-lg border-b-2 border-red-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center text-white font-black text-xl shadow-lg group-hover:shadow-xl transition-all transform group-hover:scale-110">
              LD
            </div>
            <span className="font-black text-2xl bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">LifeDrop</span>
          </Link>

          {currentUser && (
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Dashboard Link */}
              <Link
                to={getDashboardLink()}
                className={`px-4 py-2.5 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 ${
                  isActive(getDashboardLink())
                    ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {getDashboardLabel()}
              </Link>

              {/* Search Donors - Receiver Only */}
              {userRole === 'receiver' && (
                <Link
                  to="/receiver/search"
                  className={`px-4 py-2.5 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 ${
                    location.pathname === '/receiver/search'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  🔍 Search Donors
                </Link>
              )}

              {/* All Donors - Non-Admin Only */}
              {userRole !== 'admin' && (
                <Link
                  to="/all-donors"
                  className={`px-4 py-2.5 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 ${
                    location.pathname === '/all-donors'
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  👥 All Donors
                </Link>
              )}

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="px-4 py-2.5 bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-800 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                🚪 Logout
              </button>
            </div>
          )}

          {!currentUser && (
            <div className="flex gap-3">
              <Link
                to="/login"
                className="px-5 py-2.5 text-red-600 hover:text-red-700 font-bold transition-all duration-300"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

