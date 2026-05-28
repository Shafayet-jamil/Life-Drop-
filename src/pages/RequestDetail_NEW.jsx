import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { getRequest, updateRequestStatus, getUserProfile, updateDonationStats } from '../utils/firebaseHelpers'
import LoadingSpinner from '../components/LoadingSpinner'

export default function RequestDetail() {
  const { requestId } = useParams()
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [request, setRequest] = useState(null)
  const [receiverInfo, setReceiverInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadRequest = async () => {
      try {
        const requestData = await getRequest(requestId)
        setRequest(requestData)

        if (requestData?.receiverId) {
          const receiver = await getUserProfile(requestData.receiverId)
          setReceiverInfo(receiver)
        }
      } catch (err) {
        setError('Failed to load request')
      } finally {
        setLoading(false)
      }
    }

    loadRequest()
  }, [requestId])

  const handleAccept = async () => {
    setError('')
    setSubmitting(true)
    try {
      await updateRequestStatus(requestId, 'accepted', currentUser.uid)
      navigate('/donor/dashboard')
    } catch (err) {
      setError(err.message || 'Failed to accept request')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDecline = async () => {
    setError('')
    setSubmitting(true)
    try {
      await updateRequestStatus(requestId, 'declined')
      navigate('/donor/dashboard')
    } catch (err) {
      setError(err.message || 'Failed to decline request')
    } finally {
      setSubmitting(false)
    }
  }

  const handleComplete = async () => {
    setError('')
    setSubmitting(true)
    try {
      // Update request status to completed
      await updateRequestStatus(requestId, 'completed')
      // Increment donor donation counter and set last donation date
      await updateDonationStats(currentUser.uid)
      navigate('/donor/dashboard')
    } catch (err) {
      setError(err.message || 'Failed to complete request')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <LoadingSpinner />

  if (!request) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <p className="text-center text-gray-600">Request not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate('/donor/dashboard')}
          className="mb-6 text-blood hover:underline font-semibold"
        >
          ← Back to Dashboard
        </button>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Blood Donation Request</h1>
              <p className="text-gray-600 mt-2">Status: {request.status}</p>
            </div>
            <span
              className={`px-4 py-2 rounded-lg font-semibold text-white ${
                request.status === 'pending'
                  ? 'bg-yellow-500'
                  : request.status === 'accepted'
                  ? 'bg-green-500'
                  : request.status === 'completed'
                  ? 'bg-blue-500'
                  : 'bg-red-500'
              }`}
            >
              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
            </span>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Receiver Info */}
          {receiverInfo && (
            <div className="bg-gray-50 p-6 rounded-lg mb-8 border border-gray-200">
              <h2 className="font-semibold text-gray-900 mb-4">Receiver Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-semibold text-gray-800">{receiverInfo.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-semibold text-gray-800">{receiverInfo.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">City</p>
                  <p className="font-semibold text-gray-800">{receiverInfo.city}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold text-gray-800">{receiverInfo.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Request Message */}
          <div className="mb-8">
            <h2 className="font-semibold text-gray-900 mb-4">Message from Receiver</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <p className="text-gray-700 whitespace-pre-wrap">{request.message}</p>
            </div>
          </div>

          {/* Request Details */}
          <div className="bg-gray-50 p-6 rounded-lg mb-8 border border-gray-200">
            <h2 className="font-semibold text-gray-900 mb-4">Request Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Blood Type Needed</p>
                <p className="font-semibold text-gray-800">{request.bloodType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Date Requested</p>
                <p className="font-semibold text-gray-800">
                  {new Date(request.createdAt?.toDate?.() || request.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {request.status === 'pending' && (
            <div className="flex gap-4">
              <button
                onClick={handleAccept}
                disabled={submitting}
                className="flex-1 bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 disabled:opacity-50"
              >
                {submitting ? 'Processing...' : '✓ Accept Request'}
              </button>
              <button
                onClick={handleDecline}
                disabled={submitting}
                className="flex-1 bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 disabled:opacity-50"
              >
                {submitting ? 'Processing...' : '✗ Decline Request'}
              </button>
            </div>
          )}

          {request.status === 'accepted' && (
            <div className="flex gap-4">
              <button
                onClick={handleComplete}
                disabled={submitting}
                className="flex-1 bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 disabled:opacity-50"
              >
                {submitting ? 'Processing...' : '✓ Mark as Completed'}
              </button>
              <button
                onClick={handleDecline}
                disabled={submitting}
                className="flex-1 bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 disabled:opacity-50"
              >
                {submitting ? 'Processing...' : 'Cancel'}
              </button>
            </div>
          )}

          {request.status !== 'pending' && request.status !== 'accepted' && (
            <div className="p-4 bg-gray-100 text-gray-700 rounded-lg text-center font-semibold">
              This request has been {request.status}.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
