import { useState } from 'react'

export default function RequestForm({ donorInfo, onSubmit, loading }) {
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!message.trim()) {
      setError('Please write a message')
      return
    }

    try {
      await onSubmit(message)
    } catch (err) {
      setError(err.message || 'Failed to send request')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h3 className="font-semibold text-gray-800 mb-4">Donor Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Name</p>
            <p className="font-semibold text-gray-800">{donorInfo.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Blood Type</p>
            <p className="font-semibold text-gray-800">{donorInfo.bloodType}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">City</p>
            <p className="font-semibold text-gray-800">{donorInfo.city}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Phone</p>
            <p className="font-semibold text-gray-800">{donorInfo.phone}</p>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Message to Donor
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Please explain why you need blood, urgency, etc..."
          rows="6"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-blood focus:outline-none focus:ring-2 focus:ring-blood/20"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blood text-white py-3 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50"
      >
        {loading ? 'Sending request...' : 'Send Request'}
      </button>
    </form>
  )
}
