import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { getUserProfile } from '../utils/firebaseHelpers'
import LoadingSpinner from '../components/LoadingSpinner'
import DonorProfileCard from '../components/DonorProfileCard'

export default function DonorProfile() {
  const { donorId } = useParams()
  const { currentUser, userRole } = useAuth()
  const navigate = useNavigate()
  const [donor, setDonor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchDonor = async () => {
      try {
        setLoading(true)
        const profile = await getUserProfile(donorId)
        if (profile && profile.role === 'donor') {
          setDonor(profile)
        } else {
          setError('Donor not found')
        }
      } catch (err) {
        console.error('Error fetching donor:', err)
        setError('Failed to load donor profile')
      } finally {
        setLoading(false)
      }
    }

    if (donorId) {
      fetchDonor()
    }
  }, [donorId])

  if (loading) return <LoadingSpinner />

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 text-blood hover:underline font-semibold"
          >
            ← Go Back
          </button>
          <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg">
            {error}
          </div>
        </div>
      </div>
    )
  }

  if (!donor) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 text-blood hover:underline font-semibold"
          >
            ← Go Back
          </button>
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-6 rounded-lg">
            Donor not found
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-blood hover:underline font-semibold"
        >
          ← Go Back
        </button>

        <DonorProfileCard
          donor={donor}
          showFullProfile={true}
          showReviewForm={userRole === 'receiver' && currentUser?.uid !== donorId}
          currentUserName={currentUser?.email?.split('@')[0]}
        />
      </div>
    </div>
  )
}
