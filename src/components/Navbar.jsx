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
    return userRole === 'donor' ? '/donor/dashboard' : '/receiver/requests'
  }

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blood rounded-full flex items-center justify-center text-white font-bold">
              LD
            </div>
            <span className="font-bold text-lg text-gray-800">LifeDrop</span>
          </Link>

          {currentUser && (
            <div className="flex items-center gap-4">
              <Link
                to={getDashboardLink()}
                className={`px-4 py-2 rounded-lg transition ${
                  location.pathname.includes(
                    userRole === 'donor' ? '/donor' : '/receiver'
                  )
                    ? 'bg-blood text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {userRole === 'donor' ? 'Dashboard' : 'My Requests'}
              </Link>

              {userRole === 'receiver' && (
                <Link
                  to="/receiver/search"
                  className={`px-4 py-2 rounded-lg transition ${
                    location.pathname === '/receiver/search'
                      ? 'bg-blood text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Search Donors
                </Link>
              )}

              <Link
                to="/all-donors"
                className={`px-4 py-2 rounded-lg transition ${
                  location.pathname === '/all-donors'
                    ? 'bg-blood text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                All Donors
              </Link>

              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
