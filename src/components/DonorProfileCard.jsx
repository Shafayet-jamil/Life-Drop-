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
    return isAvailable
      ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg shadow-green-500/30'
      : 'bg-gradient-to-r from-gray-400 to-gray-500 text-white'
  }

  const getAvailabilityText = (isAvailable) => {
    return isAvailable ? '🟢 Available Now' : '⚫ Not Available'
  }

  if (!showFullProfile) {
    // Simple card view for SearchDonors
    return (
      <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col border border-gray-100">
        {/* Header */}
        <div className="bg-gradient-to-br from-red-500 via-red-600 to-red-700 text-white p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-400 rounded-full -mr-16 -mt-16 opacity-20"></div>
          <h3 className="text-2xl font-bold mb-1 relative z-10">{donor.name}</h3>
          <p className="text-red-100 text-lg font-semibold relative z-10">💧 {donor.bloodType}</p>
        </div>

        <div className="p-6 flex-grow flex flex-col">
          {/* Stats Grid */}
          <div className="space-y-4 mb-6 flex-grow">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
              <p className="text-sm text-blue-600 font-semibold mb-1">📍 Location</p>
              <p className="font-bold text-gray-800 text-lg">{donor.city || 'Not specified'}</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
              <p className="text-sm text-purple-600 font-semibold mb-1">📞 Phone</p>
              <p className="font-bold text-gray-800">{donor.phone || 'Not specified'}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-3 rounded-xl border border-orange-200 text-center">
                <p className="text-xs text-orange-600 font-semibold mb-1">🩸 Donations</p>
                <p className="font-bold text-orange-700 text-xl">{donationCount}x</p>
              </div>

              <div className={`p-3 rounded-xl border-2 text-center transition-all ${getAvailabilityColor(donor.isAvailable)}`}>
                <p className="text-xs font-semibold">{getAvailabilityText(donor.isAvailable)}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              to={`/donor/profile/${donor.id}`}
              className="w-full block text-center bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              👁️ View Full Profile
            </Link>

            <Link
              to={`/receiver/requests/${donor.id}/send`}
              className="w-full block text-center bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              ❤️ Request Blood
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Full profile view
  return (
    <div className="space-y-8">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-br from-red-500 via-red-600 to-red-800 text-white p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-400 rounded-full -mr-32 -mt-32 opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-red-400 rounded-full -ml-24 -mb-24 opacity-10"></div>

          <div className="flex justify-between items-start relative z-10">
            <div className="flex-grow">
              <p className="text-red-100 text-lg mb-2">🩸 Blood Donor Profile</p>
              <h1 className="text-5xl font-black mb-3">{donor.name}</h1>
              <p className="text-2xl text-red-100 font-bold">Blood Type: <span className="text-white text-3xl">{donor.bloodType}</span></p>
            </div>

            <div className={`px-8 py-4 rounded-2xl font-bold text-lg shadow-xl ${getAvailabilityColor(donor.isAvailable)} min-w-max`}>
              {getAvailabilityText(donor.isAvailable)}
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="p-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {/* Name */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border-2 border-blue-200 hover:shadow-lg transition-all">
              <p className="text-blue-600 text-sm font-bold mb-2">👤 FULL NAME</p>
              <p className="font-black text-gray-900 text-xl">{donor.name}</p>
            </div>

            {/* Email */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border-2 border-purple-200 hover:shadow-lg transition-all">
              <p className="text-purple-600 text-sm font-bold mb-2">📧 EMAIL</p>
              <p className="font-semibold text-gray-800 break-all">{donor.email}</p>
            </div>

            {/* Phone */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border-2 border-green-200 hover:shadow-lg transition-all">
              <p className="text-green-600 text-sm font-bold mb-2">📞 PHONE</p>
              <p className="font-semibold text-gray-800">{donor.phone}</p>
            </div>

            {/* Blood Group */}
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-2xl border-2 border-red-200 hover:shadow-lg transition-all">
              <p className="text-red-600 text-sm font-bold mb-2">💧 BLOOD GROUP</p>
              <p className="font-black text-red-700 text-3xl">{donor.bloodType}</p>
            </div>

            {/* Location */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-2xl border-2 border-orange-200 hover:shadow-lg transition-all">
              <p className="text-orange-600 text-sm font-bold mb-2">📍 LOCATION</p>
              <p className="font-semibold text-gray-800">{donor.city || 'Not specified'}</p>
            </div>

            {/* Member Since */}
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-2xl border-2 border-indigo-200 hover:shadow-lg transition-all">
              <p className="text-indigo-600 text-sm font-bold mb-2">📅 MEMBER SINCE</p>
              <p className="font-semibold text-gray-800">
                {donor.createdAt ? new Date(donor.createdAt.toDate?.() || donor.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
              </p>
            </div>
          </div>

          <hr className="my-8 border-gray-300" />

          {/* Stats Section */}
          <div>
            <h2 className="text-3xl font-black text-gray-900 mb-6">📊 Donation Stats</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-400 to-blue-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                <p className="text-blue-100 text-sm font-bold mb-2">Total Donations</p>
                <p className="text-4xl font-black">{donationCount}</p>
                <p className="text-blue-100 text-xs mt-2">times helped</p>
              </div>

              <div className="bg-gradient-to-br from-green-400 to-green-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                <p className="text-green-100 text-sm font-bold mb-2">Status</p>
                <p className="text-3xl mb-1">{donor.isAvailable ? '✓' : '✗'}</p>
                <p className="text-green-100 text-xs">{donor.isAvailable ? 'Available' : 'Unavailable'}</p>
              </div>

              <div className="bg-gradient-to-br from-purple-400 to-purple-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                <p className="text-purple-100 text-sm font-bold mb-2">Blood Type</p>
                <p className="text-3xl font-black">{donor.bloodType}</p>
                <p className="text-purple-100 text-xs mt-2">group</p>
              </div>

              <div className="bg-gradient-to-br from-orange-400 to-orange-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                <p className="text-orange-100 text-sm font-bold mb-2">Impact</p>
                <p className="text-2xl font-black mb-1">{donationCount > 0 ? '⭐' : '✨'}</p>
                <p className="text-orange-100 text-xs">Life Saver</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-white rounded-3xl shadow-2xl p-12 border border-gray-100">
        <div className="flex items-center mb-8">
          <span className="text-4xl mr-3">⭐</span>
          <h2 className="text-3xl font-black text-gray-900">Reviews & Ratings</h2>
        </div>
        <div className="bg-gray-50 p-8 rounded-2xl border-2 border-gray-200">
          <ReviewsDisplay donorId={donor.id} key={reviewsRefresh} />
        </div>
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <div className="bg-white rounded-3xl shadow-2xl p-12 border border-gray-100">
          <div className="flex items-center mb-8">
            <span className="text-4xl mr-3">✍️</span>
            <h2 className="text-3xl font-black text-gray-900">Share Your Experience</h2>
          </div>
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

