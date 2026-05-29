import { useState } from 'react'
import { validateEmail, validatePassword } from '../../utils/validators'

export default function RegisterForm({ onSubmit, loading }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState('donor')
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

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (!role) {
      setError('Please select a role')
      return
    }

    try {
      await onSubmit(email, password, role)
    } catch (err) {
      setError(err.message || 'Registration failed')
    }
  }

  const roles = [
    { value: 'donor', label: 'Donor', description: 'I want to donate blood', emoji: '🩸', color: 'from-red-400 to-red-600' },
    { value: 'receiver', label: 'Receiver', description: 'I need blood', emoji: '👤', color: 'from-blue-400 to-blue-600' },
    { value: 'admin', label: 'Admin', description: 'I manage the platform', emoji: '⚙️', color: 'from-purple-400 to-purple-600' }
  ]

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

      {/* Confirm Password Field */}
      <div>
        <label className="block text-sm font-black text-gray-900 mb-3">
          ✓ Confirm Password
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          required
          className="w-full border-2 border-gray-300 rounded-xl px-5 py-3 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-400/30 font-semibold text-gray-800 placeholder-gray-500 hover:border-gray-400 transition-all"
        />
      </div>

      {/* Role Selection */}
      <div>
        <label className="block text-sm font-black text-gray-900 mb-4">
          🎯 Select Your Role
        </label>
        <div className="space-y-3">
          {roles.map((roleOption) => (
            <label
              key={roleOption.value}
              className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                role === roleOption.value
                  ? `bg-gradient-to-r ${roleOption.color} text-white border-transparent shadow-lg`
                  : 'bg-white border-gray-300 hover:border-gray-400 text-gray-800'
              }`}
            >
              <input
                type="radio"
                name="role"
                value={roleOption.value}
                checked={role === roleOption.value}
                onChange={(e) => setRole(e.target.value)}
                className="w-5 h-5 cursor-pointer"
              />
              <div className="flex-grow">
                <p className="font-black text-lg">{roleOption.emoji} {roleOption.label}</p>
                <p className={role === roleOption.value ? 'text-white/90 text-sm font-semibold' : 'text-gray-600 text-sm font-semibold'}>
                  {roleOption.description}
                </p>
              </div>
            </label>
          ))}
        </div>
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
            Creating account...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <span>🎉</span>
            Create Account
          </span>
        )}
      </button>
    </form>
  )
}

