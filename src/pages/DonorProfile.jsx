import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { getDonorStats, getUserProfile } from '../utils/firebaseHelpers'
import LoadingSpinner from '../components/LoadingSpinner'
import DonationStats from '../components/DonationStats'
import ReviewsDisplay from '../components/ReviewsDisplay'
import ReviewForm from '../components/ReviewForm'

export default function DonorProfile() {
  const { donorId } = useParams()
  const { currentUser, userRole } = useAuth()
  const navigate = useNavigate()
  const [donor, setDonor] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const fetchDonorData = async () => {
      try {
        const donorProfile = await getUserProfile(donorId)
        setDonor(donorProfile)

        const donorStats = await getDonorStats(donorId)
        setStats(donorStats)
      } catch (err) {
        console.error('Error fetching donor profile:', err)
      } finally {
        setLoading(false)
      }
    }

    if (donorId) {
      fetchDonorData()
    }
  }, [donorId])

  if (loading) return <LoadingSpinner />

  if (!donor) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 px-4 py-2 text-gray-600 hover:text-gray-900 font-semibold"
          >
            ← Go Back
          </button>
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600">Donor profile not found</p>
          </div>
        </div>
      </div>
    )
  }

  const handleReviewSubmitted = () => {
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 px-4 py-2 text-gray-600 hover:text-gray-900 font-semibold"
        >
          ← Go Back
        </button>

        {/* Donor Header */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-blood to-red-700 text-white p-8">
            <h1 className="text-4xl font-bold mb-2">{donor.name}</h1>
            <p className="text-2xl text-red-100 font-semibold">{donor.bloodType}</p>
          </div>

          {/* Donor Contact Info */}
          <div className="p-8 grid md:grid-cols-2 gap-8 border-b">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">📞 Phone</p>
                  <p className="text-lg font-mono text-gray-800">{donor.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">✉️ Email</p>
                  <p className="text-lg text-gray-800 break-all">{donor.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">📍 Location</p>
                  <p className="text-lg text-gray-800">{donor.city}</p>
                </div>
              </div>
            </div>

            {/* Donation Stats */}
            {stats && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Donation History</h3>
                <DonationStats
                  totalDonations={stats.totalDonations}
                  lastDonationDate={stats.lastDonationDate}
                />
              </div>
            )}
          </div>

          {/* Request Button */}
          {userRole === 'receiver' && currentUser?.uid !== donorId && (
            <div className="p-8">
              <button
                onClick={() => navigate(`/receiver/requests/${donorId}/send`)}
                className="w-full bg-blood text-white py-3 rounded-lg hover:bg-red-700 font-semibold text-lg transition"
              >
                Request Blood from {donor.name.split(' ')[0]}
              </button>
            </div>
          )}
        </div>

        {/* Reviews Section */}
        {stats && (
          <div key={refreshKey}>
            <ReviewsDisplay
              donorId={donorId}
              donorName={donor.name}
              averageRating={stats.averageRating}
              reviewCount={stats.reviewCount}
            />
          </div>
        )}

        {/* Review Form */}
        {userRole === 'receiver' && currentUser?.uid !== donorId && (
          <div className="mt-6">
            <ReviewForm
              donorId={donorId}
              receiverId={currentUser?.uid}
              donorName={donor.name}
              onReviewSubmitted={handleReviewSubmitted}
            />
          </div>
        )}
      </div>
    </div>
  )
}
