import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { listenToReceiverRequests, getUserProfile } from '../utils/firebaseHelpers'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'

export default function MyRequests() {
  const { currentUser } = useAuth()
  const [requests, setRequests] = useState([])
  const [donorProfiles, setDonorProfiles] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!currentUser) return

    const unsubscribe = listenToReceiverRequests(currentUser.uid, async (receiverRequests) => {
      setRequests(receiverRequests)

      // Load donor profiles for accepted requests
      const profiles = {}
      for (const request of receiverRequests) {
        if (request.donorId && !profiles[request.donorId]) {
          try {
            const donor = await getUserProfile(request.donorId)
            profiles[request.donorId] = donor
          } catch (err) {
            console.error('Error loading donor profile:', err)
          }
        }
      }
      setDonorProfiles(profiles)
      setLoading(false)
    })

    return unsubscribe
  }, [currentUser])

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'accepted':
        return 'bg-green-100 text-green-800'
      case 'declined':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Blood Requests</h1>
          <Link
            to="/receiver/search"
            className="bg-blood text-white px-6 py-2 rounded-lg hover:bg-red-700 font-semibold"
          >
            + New Request
          </Link>
        </div>

        {requests.length === 0 ? (
          <EmptyState
            title="No requests yet"
            message="You haven't sent any blood requests. Start by searching for available donors."
            action={
              <Link
                to="/receiver/search"
                className="inline-block bg-blood text-white px-6 py-2 rounded-lg hover:bg-red-700"
              >
                Search Donors
              </Link>
            }
          />
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div
                key={request.id}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {request.bloodType} Blood Request
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {request.city} •{' '}
                      {new Date(request.createdAt?.toDate?.() || request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                      request.status
                    )}`}
                  >
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                </div>

                {request.status === 'accepted' && donorProfiles[request.donorId] && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Donor Accepted! 🎉</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Name</p>
                        <p className="font-semibold text-gray-800">
                          {donorProfiles[request.donorId].name}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-semibold text-gray-800">
                          {donorProfiles[request.donorId].phone}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-semibold text-gray-800">
                          {donorProfiles[request.donorId].email}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">City</p>
                        <p className="font-semibold text-gray-800">
                          {donorProfiles[request.donorId].city}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {request.status === 'declined' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <p className="text-red-800 font-semibold">
                      This donor has declined your request. You can search for other donors.
                    </p>
                  </div>
                )}

                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                  <strong>Your message:</strong> <br />
                  {request.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
