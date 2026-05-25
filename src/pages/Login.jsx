import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import LoginForm from '../components/forms/LoginForm'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleLogin = async (email, password) => {
    setLoading(true)
    try {
      await login(email, password)
      navigate('/') // Will redirect based on role via Landing
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-blood rounded-full flex items-center justify-center text-white font-bold mx-auto mb-4">
              LD
            </div>
            <h1 className="text-2xl font-bold text-gray-900">LifeDrop</h1>
            <p className="text-gray-600 mt-2">Login to your account</p>
          </div>

          <LoginForm onSubmit={handleLogin} loading={loading} />

          <p className="text-center text-gray-600 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-blood font-semibold hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
