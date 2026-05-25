import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useUser } from '../hooks/useUser'
import { getUserProfile, saveDonorRequest } from '../utils/firebaseHelpers'
import LoadingSpinner from '../components/LoadingSpinner'
import RequestForm from '../components/forms/RequestForm'

export default function SendRequest() {
  const { donorId } = useParams()
  const { currentUser } = useAuth()
  const { userProfile } = useUser()
  const navigate = useNavigate()
  const [donorInfo, setDonorInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const loadDonor = async () => {
      try {
        const donor = await getUserProfile(donorId)
        setDonorInfo(donor)
      } catch (err) {
        console.error('Failed to load donor:', err)
      } finally {
        setLoading(false)
      }
    }

    loadDonor()
  }, [donorId])

  const handleSendRequest = async (message) => {
    setSubmitting(true)
    try {
      await saveDonorRequest({
        donorId,
        receiverId: currentUser.uid,
        bloodType: donorInfo.bloodType,
        city: donorInfo.city,
        message,
      })
      navigate('/receiver/requests')
    } catch (err) {
      console.error('Error sending request:', err)
      throw err
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <LoadingSpinner />

  if (!donorInfo) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <p className="text-center text-gray-600">Donor not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate('/receiver/search')}
          className="mb-6 text-blood hover:underline font-semibold"
        >
          ← Back to Search
        </button>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Send Blood Request</h1>
          <p className="text-gray-600 mb-8">
            Contact {donorInfo.name} to request blood donation
          </p>

          <RequestForm
            donorInfo={donorInfo}
            onSubmit={handleSendRequest}
            loading={submitting}
          />
        </div>
      </div>
    </div>
  )
}
