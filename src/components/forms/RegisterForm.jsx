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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Confirm Password
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Role</label>
        <div className="space-y-2">
          <label className="flex items-center gap-3">
            <input
              type="radio"
              name="role"
              value="donor"
              checked={role === 'donor'}
              onChange={(e) => setRole(e.target.value)}
              className="w-4 h-4"
            />
            <span className="text-gray-700">
              <strong>Donor</strong> - I want to donate blood
            </span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="radio"
              name="role"
              value="receiver"
              checked={role === 'receiver'}
              onChange={(e) => setRole(e.target.value)}
              className="w-4 h-4"
            />
            <span className="text-gray-700">
              <strong>Receiver</strong> - I need blood
            </span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="radio"
              name="role"
              value="admin"
              checked={role === 'admin'}
              onChange={(e) => setRole(e.target.value)}
              className="w-4 h-4"
            />
            <span className="text-gray-700">
              <strong>Admin</strong> - I manage the platform
            </span>
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blood text-white py-2 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50"
      >
        {loading ? 'Creating account...' : 'Register'}
      </button>
    </form>
  )
}
