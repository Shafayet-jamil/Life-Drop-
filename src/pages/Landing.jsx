import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useEffect } from 'react'

export default function Landing() {
  const { currentUser, userRole } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (currentUser) {
      if (userRole === 'admin') {
        navigate('/admin/dashboard')
      } else if (userRole === 'donor') {
        navigate('/donor/dashboard')
      } else if (userRole === 'receiver') {
        navigate('/receiver/requests')
      }
    }
  }, [currentUser, userRole, navigate])

  return (
    <div className="min-h-screen bg-gradient-to-b from-blood via-red-50 to-white">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blood rounded-full flex items-center justify-center text-white font-bold">
              LD
            </div>
            <span className="font-bold text-lg">LifeDrop</span>
          </div>
          {!currentUser && (
            <div className="flex gap-4">
              <Link to="/login" className="text-gray-700 hover:text-blood font-medium">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blood text-white px-6 py-2 rounded-lg hover:bg-red-700"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Save Lives with <span className="text-blood">LifeDrop</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Connect blood donors with those in need. Be the hero someone needs today.
          </p>
          {!currentUser && (
            <div className="flex gap-4 justify-center">
              <Link
                to="/register"
                className="bg-blood text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 text-lg"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="bg-white border-2 border-blood text-blood px-8 py-3 rounded-lg font-semibold hover:bg-red-50 text-lg"
              >
                Login
              </Link>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8 my-16">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">🩸</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">For Donors</h3>
            <p className="text-gray-600">
              Set your availability and help people in need. Accept or decline requests at your convenience.
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Quick Search</h3>
            <p className="text-gray-600">
              Find compatible blood donors near you instantly. Filter by blood type and location.
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Real-time Updates</h3>
            <p className="text-gray-600">
              Get instant notifications when requests are accepted. Stay connected and informed.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
