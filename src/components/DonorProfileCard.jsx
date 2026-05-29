import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getDonationCount } from '../utils/firebaseHelpers'
import ReviewsDisplay from './ReviewsDisplay'
import ReviewForm from './ReviewForm'

export default function DonorProfileCard({ donor, showFullProfile = false, showReviewForm = false, currentUserName = null }) {
  const [donationCount, setDonationCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [reviewsRefresh, setReviewsRefresh] = useState(0)

  useEffect(() => {
    const fetchDonationCount = async () => {
      try {
        const count = await getDonationCount(donor.id)
        setDonationCount(count)
      } catch (err) {
        console.error('Error fetching donation count:', err)
      } finally {
        setLoading(false)
      }
    }

    if (donor?.id) {
      fetchDonationCount()
    }
  }, [donor?.id])

  const getAvailabilityColor = (isAvailable) => {
    return isAvailable ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
  }

  const getAvailabilityText = (isAvailable) => {
    return isAvailable ? '✓ Available Now' : '✗ Not Available'
  }

  if (!showFullProfile) {
    // Simple card view for SearchDonors
    return (
      <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition h-full flex flex-col">
        <div className="bg-blood text-white p-4">
          <h3 className="text-xl font-bold">{donor.name}</h3>
          <p className="text-red-100">{donor.bloodType}</p>
        </div>

        <div className="p-6 flex-grow flex flex-col">
          <div className="space-y-3 mb-6 flex-grow">
            <div>
              <p className="text-sm text-gray-600">Location</p>
              <p className="font-semibold text-gray-800">{donor.city || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="font-semibold text-gray-800">{donor.phone || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Donations</p>
              <p className="font-semibold text-gray-800">{donationCount} times</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getAvailabilityColor(donor.isAvailable)}`}>
                {getAvailabilityText(donor.isAvailable)}
              </div>
            </div>
          </div>

          <Link
            to={`/donor/profile/${donor.id}`}
            className="w-full block text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-semibold transition mb-2"
          >
            View Profile
          </Link>

          <Link
            to={`/receiver/requests/${donor.id}/send`}
            className="w-full block text-center bg-blood text-white py-2 rounded-lg hover:bg-red-700 font-semibold transition"
          >
            Request Blood
          </Link>
        </div>
      </div>
    )
  }

  // Full profile view
  return (
    <div className="space-y-8">
      {/* Profile Card */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blood to-red-700 text-white p-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold mb-2">{donor.name}</h1>
              <p className="text-red-100 text-lg">{donor.bloodType}</p>
            </div>
            <div className={`px-6 py-3 rounded-lg font-semibold text-lg ${getAvailabilityColor(donor.isAvailable)}`}>
              {getAvailabilityText(donor.isAvailable)}
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Details */}
            <div>
              <p className="text-sm text-gray-600 mb-1">Full Name</p>
              <p className="font-semibold text-gray-800 text-lg">{donor.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Email</p>
              <p className="font-semibold text-gray-800">{donor.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Phone</p>
              <p className="font-semibold text-gray-800">{donor.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Blood Group</p>
              <p className="font-semibold text-gray-800 text-lg">{donor.bloodType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Location</p>
              <p className="font-semibold text-gray-800">{donor.city || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Times Donated</p>
              <p className="font-bold text-blood text-2xl">{donationCount}x</p>
            </div>
          </div>

          <hr className="my-8" />

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <p className="text-gray-600 text-sm font-semibold">Total Donations</p>
              <p className="text-3xl font-bold text-blue-600">{donationCount}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <p className="text-gray-600 text-sm font-semibold">Availability</p>
              <p className="text-2xl font-bold text-green-600">{donor.isAvailable ? '✓' : '✗'}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <p className="text-gray-600 text-sm font-semibold">Blood Type</p>
              <p className="text-2xl font-bold text-purple-600">{donor.bloodType}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg text-center">
              <p className="text-gray-600 text-sm font-semibold">Member Since</p>
              <p className="text-sm font-bold text-yellow-600">
                {donor.createdAt ? new Date(donor.createdAt.toDate?.() || donor.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews & Ratings</h2>
        <ReviewsDisplay donorId={donor.id} key={reviewsRefresh} />
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Share Your Experience</h2>
          <ReviewForm
            donorId={donor.id}
            receiverName={currentUserName}
            onReviewSubmitted={() => setReviewsRefresh(prev => prev + 1)}
          />
        </div>
      )}
    </div>
  )
}
