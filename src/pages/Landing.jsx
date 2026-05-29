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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-20">
          <div className="inline-block mb-6">
            <span className="text-8xl animate-bounce">🩸</span>
          </div>

          <h1 className="text-6xl md:text-7xl font-black text-gray-900 mb-6 leading-tight">
            Save Lives with <span className="bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">LifeDrop</span>
          </h1>

          <p className="text-2xl text-gray-600 font-semibold mb-12 max-w-2xl mx-auto">
            Connect blood donors with those in need. Be the hero someone needs today.
          </p>

          {!currentUser && (
            <div className="flex gap-6 justify-center flex-wrap">
              <Link
                to="/register"
                className="px-10 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-2xl font-black text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                🚀 Get Started Now
              </Link>
              <Link
                to="/login"
                className="px-10 py-4 bg-white border-3 border-gray-300 hover:border-red-500 text-gray-800 hover:text-red-600 rounded-2xl font-black text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                👤 Login
              </Link>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {/* Card 1 */}
          <div className="group bg-gradient-to-br from-blue-50 to-blue-100 p-10 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-blue-200 hover:border-blue-400">
            <div className="text-6xl mb-6 group-hover:scale-125 transition-transform duration-300">🩸</div>
            <h3 className="text-2xl font-black text-gray-900 mb-3">For Donors</h3>
            <p className="text-gray-700 font-semibold leading-relaxed">
              Set your availability and help people in need. Accept or decline requests at your convenience.
            </p>
            <div className="mt-6 h-1 w-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full group-hover:w-full transition-all duration-300"></div>
          </div>

          {/* Card 2 */}
          <div className="group bg-gradient-to-br from-green-50 to-green-100 p-10 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-green-200 hover:border-green-400">
            <div className="text-6xl mb-6 group-hover:scale-125 transition-transform duration-300">🔍</div>
            <h3 className="text-2xl font-black text-gray-900 mb-3">Quick Search</h3>
            <p className="text-gray-700 font-semibold leading-relaxed">
              Find compatible blood donors near you instantly. Filter by blood type and location.
            </p>
            <div className="mt-6 h-1 w-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full group-hover:w-full transition-all duration-300"></div>
          </div>

          {/* Card 3 */}
          <div className="group bg-gradient-to-br from-purple-50 to-purple-100 p-10 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-purple-200 hover:border-purple-400">
            <div className="text-6xl mb-6 group-hover:scale-125 transition-transform duration-300">⚡</div>
            <h3 className="text-2xl font-black text-gray-900 mb-3">Real-time Updates</h3>
            <p className="text-gray-700 font-semibold leading-relaxed">
              Get instant notifications when requests are accepted. Stay connected and informed.
            </p>
            <div className="mt-6 h-1 w-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full group-hover:w-full transition-all duration-300"></div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-red-500 to-red-700 rounded-3xl shadow-2xl p-16 text-white mb-20">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-5xl font-black mb-2">1000+</p>
              <p className="text-xl font-semibold">Active Donors</p>
            </div>
            <div>
              <p className="text-5xl font-black mb-2">500+</p>
              <p className="text-xl font-semibold">Lives Saved</p>
            </div>
            <div>
              <p className="text-5xl font-black mb-2">50+</p>
              <p className="text-xl font-semibold">Cities</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        {!currentUser && (
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-2xl p-16 text-center">
            <h2 className="text-4xl font-black text-white mb-6">Ready to Save Lives?</h2>
            <p className="text-xl text-gray-300 font-semibold mb-10">
              Join thousands of blood donors making a difference
            </p>
            <Link
              to="/register"
              className="inline-block px-12 py-5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-2xl font-black text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              🎯 Start Your Journey
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}

