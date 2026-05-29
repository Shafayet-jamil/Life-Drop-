import { useState } from 'react'
import { validateEmail, validatePassword } from '../../utils/validators'

export default function LoginForm({ onSubmit, loading }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!validateEmail(email)) {
      setError('Invalid email address')
      return
    }

    if (!validatePassword(password)) {
      setError('Password must be at least 6 characters')
      return
    }

    try {
      await onSubmit(email, password)
    } catch (err) {
      setError(err.message || 'Login failed')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg font-semibold flex items-center gap-3">
          <span className="text-xl">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Email Field */}
      <div>
        <label className="block text-sm font-black text-gray-900 mb-3">
          📧 Email Address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="w-full border-2 border-gray-300 rounded-xl px-5 py-3 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-400/30 font-semibold text-gray-800 placeholder-gray-500 hover:border-gray-400 transition-all"
        />
      </div>

      {/* Password Field */}
      <div>
        <label className="block text-sm font-black text-gray-900 mb-3">
          🔐 Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          className="w-full border-2 border-gray-300 rounded-xl px-5 py-3 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-400/30 font-semibold text-gray-800 placeholder-gray-500 hover:border-gray-400 transition-all"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 rounded-xl font-black text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-70 disabled:scale-100 shadow-lg"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin">⏳</span>
            Logging in...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <span>🚀</span>
            Login
          </span>
        )}
      </button>
    </form>
  )
}
