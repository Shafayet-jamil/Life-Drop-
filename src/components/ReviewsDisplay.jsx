import { useEffect, useState } from 'react'
import { getDonorReviews } from '../utils/firebaseHelpers'

export default function ReviewsDisplay({ donorId }) {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const donorReviews = await getDonorReviews(donorId)
        setReviews(donorReviews)
      } catch (err) {
        console.error('Error fetching reviews:', err)
      } finally {
        setLoading(false)
      }
    }

    if (donorId) {
      fetchReviews()
    }
  }, [donorId])

  if (loading) {
    return <div className="text-gray-500">Loading reviews...</div>
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        <p>No reviews yet</p>
      </div>
    )
  }

  const avgRating = (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex text-yellow-400">
          {[1, 2, 3, 4, 5].map((i) => (
            <span key={i} className={i <= Math.round(avgRating) ? 'text-xl' : 'text-xl opacity-30'}>
              ★
            </span>
          ))}
        </div>
        <span className="font-semibold text-gray-700">{avgRating}/5 ({reviews.length})</span>
      </div>

      {reviews.map((review) => (
        <div key={review.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="font-semibold text-gray-800">{review.reviewerName || 'Anonymous'}</p>
              <p className="text-sm text-gray-500">
                {review.createdAt ? new Date(review.createdAt.toDate?.() || review.createdAt).toLocaleDateString() : ''}
              </p>
            </div>
            <div className="flex text-yellow-400">
              {[1, 2, 3, 4, 5].map((i) => (
                <span key={i} className={i <= (review.rating || 0) ? 'text-lg' : 'text-lg opacity-30'}>
                  ★
                </span>
              ))}
            </div>
          </div>
          <p className="text-gray-700">{review.comment}</p>
        </div>
      ))}
    </div>
  )
}
