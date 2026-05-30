import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { listenToReceiverRequests, getUserProfile } from '../utils/firebaseHelpers'
import LoadingSpinner from '../components/LoadingSpinner'

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-5xl font-black text-gray-900 mb-2">🩸 My Blood Requests</h1>
            <p className="text-gray-600 font-semibold">Track all your blood requests here</p>
          </div>
          <div className="flex gap-4 flex-wrap">
            <Link
              to="/receiver/search"
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-black text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              🔍 Search Donors
            </Link>
            <Link
              to="/receiver/search"
              className="px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-black text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              ➕ New Request
            </Link>
          </div>
        </div>

        {requests.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-2xl p-16 text-center border border-gray-100">
            <p className="text-6xl mb-6">📋</p>
            <h2 className="text-3xl font-black text-gray-900 mb-3">No Requests Yet</h2>
            <p className="text-xl text-gray-600 font-semibold mb-8">
              You haven't sent any blood requests. Start by searching for available donors.
            </p>
            <Link
              to="/receiver/search"
              className="inline-block px-10 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-black text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              🔍 Search Donors Now
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {requests.map((request) => (
              <div
                key={request.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl p-8 transition-all duration-300 border border-gray-100 hover:border-gray-300"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-4xl">💧</span>
                      <h3 className="text-2xl font-black text-gray-900">
                        {request.bloodType} Blood Request
                      </h3>
                    </div>
                    <p className="text-gray-600 font-semibold">
                      📍 {request.city} • {' '}
                      {new Date(request.createdAt?.toDate?.() || request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-6 py-3 rounded-xl text-sm font-black whitespace-nowrap ${getStatusColor(
                      request.status
                    )}`}
                  >
                    {request.status === 'pending' && '⏳ PENDING'}
                    {request.status === 'accepted' && '✅ ACCEPTED'}
                    {request.status === 'declined' && '❌ DECLINED'}
                  </span>
                </div>

                {request.message && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600 font-black mb-2">📝 Your Message:</p>
                    <p className="text-gray-800 font-semibold">{request.message}</p>
                  </div>
                )}

                {request.status === 'accepted' && donorProfiles[request.donorId] && (
                  <div className="mb-6 bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-xl p-6">
                    <p className="text-lg font-black text-green-900 mb-4">✅ DONOR ACCEPTED! 🎉</p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-lg">
                        <p className="text-sm text-gray-600 font-black mb-1">👤 NAME</p>
                        <p className="font-bold text-gray-900 text-lg">{donorProfiles[request.donorId].name}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg">
                        <p className="text-sm text-gray-600 font-black mb-1">📞 PHONE</p>
                        <p className="font-bold text-gray-900 text-lg">{donorProfiles[request.donorId].phone}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg">
                        <p className="text-sm text-gray-600 font-black mb-1">📧 EMAIL</p>
                        <p className="font-bold text-gray-900">{donorProfiles[request.donorId].email}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg">
                        <p className="text-sm text-gray-600 font-black mb-1">📍 LOCATION</p>
                        <p className="font-bold text-gray-900">{donorProfiles[request.donorId].city}</p>
                      </div>
                    </div>
                  </div>
                )}

                {request.status === 'declined' && (
                  <div className="mb-6 bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-xl p-6">
                    <p className="text-lg font-black text-red-900 mb-2">❌ REQUEST DECLINED</p>
                    <p className="text-red-800 font-semibold">
                      This donor has declined your request. Search for other available donors.
                    </p>
                  </div>
                )}

                {request.status === 'pending' && (
                  <Link
                    to={`/donor/profile/${request.donorId}`}
                    className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    👁️ View Donor Profile
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
