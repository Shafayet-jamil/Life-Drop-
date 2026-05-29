import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import RegisterForm from '../components/forms/RegisterForm'

export default function Register() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleRegister = async (email, password, role) => {
    setLoading(true)
    try {
      await signup(email, password, role)
      if (role === 'donor') {
        navigate('/donor/setup')
      } else if (role === 'admin') {
        navigate('/admin/dashboard')
      } else {
        navigate('/receiver/search')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center text-white font-black text-2xl mx-auto mb-6 shadow-lg">
              LD
            </div>
            <h1 className="text-3xl font-black text-gray-900 mb-2">LifeDrop</h1>
            <p className="text-gray-600 font-semibold">Create your account and start making a difference</p>
          </div>

          {/* Register Form */}
          <RegisterForm onSubmit={handleRegister} loading={loading} />

          {/* Divider */}
          <div className="my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-gray-500 font-semibold">OR</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Login Link */}
          <p className="text-center text-gray-700 font-semibold">
            Already have an account?{' '}
            <Link to="/login" className="bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent font-black hover:underline">
              Login here
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 font-semibold mt-8">
          Join our community of life savers 🩸
        </p>
      </div>
    </div>
  )
}

