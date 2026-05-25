import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useUser } from '../hooks/useUser'
import { useFirestore } from '../hooks/useFirestore'
import { saveUser, listenToIncomingRequests, getUserProfile } from '../utils/firebaseHelpers'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'

export default function DonorDashboard() {
  const { currentUser } = useAuth()
  const { userProfile, subscribeToUserProfile } = useUser()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [isAvailable, setIsAvailable] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!currentUser) return

    subscribeToUserProfile(currentUser.uid, (profile) => {
      setIsAvailable(profile?.isAvailable || false)
    })

    const unsubscribe = listenToIncomingRequests(currentUser.uid, (incomingRequests) => {
      setRequests(incomingRequests.filter((r) => r.status === 'pending'))
      setLoading(false)
    })

    return unsubscribe
  }, [currentUser])

  const handleToggleAvailability = async () => {
    setError('')
    try {
      await saveUser(currentUser.uid, { isAvailable: !isAvailable })
      setIsAvailable(!isAvailable)
    } catch (err) {
      setError(err.message || 'Failed to update availability')
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{userProfile?.name || 'Profile'}</h1>
              <p className="text-gray-600 mt-2">
                {userProfile?.bloodType} • {userProfile?.city}
              </p>
            </div>
            <div
              className={`px-6 py-3 rounded-lg font-semibold text-white ${
                isAvailable ? 'bg-green-500' : 'bg-gray-400'
              }`}
            >
              {isAvailable ? '✓ Available' : '✗ Unavailable'}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="font-semibold text-gray-800">{userProfile?.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-semibold text-gray-800">{userProfile?.email}</p>
            </div>
          </div>

          <button
            onClick={handleToggleAvailability}
            className={`w-full py-3 rounded-lg font-semibold text-white transition ${
              isAvailable
                ? 'bg-orange-500 hover:bg-orange-600'
                : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {isAvailable ? 'Mark as Unavailable' : 'Mark as Available'}
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Incoming Requests */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Incoming Requests</h2>

          {requests.length === 0 ? (
            <EmptyState
              title="No pending requests"
              message="You don't have any pending blood donation requests at the moment."
              action={
                <Link
                  to="/"
                  className="inline-block bg-blood text-white px-6 py-2 rounded-lg hover:bg-red-700"
                >
                  Back to Home
                </Link>
              }
            />
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        Blood Donation Request
                      </h3>
                      <p className="text-sm text-gray-600">
                        {new Date(request.createdAt?.toDate?.() || request.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                      {request.status}
                    </span>
                  </div>

                  <p className="text-gray-700 mb-4">{request.message}</p>

                  <Link
                    to={`/donor/requests/${request.id}`}
                    className="inline-block bg-blood text-white px-6 py-2 rounded-lg hover:bg-red-700"
                  >
                    View Request
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
