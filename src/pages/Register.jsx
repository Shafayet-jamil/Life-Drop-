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
      } else {
        navigate('/receiver/search')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-blood rounded-full flex items-center justify-center text-white font-bold mx-auto mb-4">
              LD
            </div>
            <h1 className="text-2xl font-bold text-gray-900">LifeDrop</h1>
            <p className="text-gray-600 mt-2">Create your account</p>
          </div>

          <RegisterForm onSubmit={handleRegister} loading={loading} />

          <p className="text-center text-gray-600 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-blood font-semibold hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
