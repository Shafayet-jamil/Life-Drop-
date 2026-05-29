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
    return <div className="text-center py-8 text-gray-500 font-semibold">Loading reviews...</div>
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-5xl mb-3">📝</p>
        <p className="text-gray-600 font-semibold">No reviews yet</p>
        <p className="text-sm text-gray-500 mt-2">Be the first to leave a review!</p>
      </div>
    )
  }

  const avgRating = (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)

  return (
    <div className="space-y-6">
      {/* Average Rating */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-8 rounded-2xl border-2 border-yellow-200">
        <div className="flex items-center gap-4 mb-4">
          <div className="text-5xl">⭐</div>
          <div>
            <p className="text-gray-600 text-sm font-bold mb-1">AVERAGE RATING</p>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-black text-orange-600">{avgRating}</p>
              <p className="text-gray-600 font-semibold">/5.0</p>
            </div>
          </div>
        </div>
        <div className="flex text-yellow-400 text-2xl gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <span key={i} className={i <= Math.round(avgRating) ? '' : 'opacity-30'}>
              ★
            </span>
          ))}
        </div>
        <p className="text-gray-600 font-semibold mt-3">Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}</p>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review, index) => (
          <div
            key={review.id}
            className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl border-2 border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-grow">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                    {(review.reviewerName || 'A')[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-lg">{review.reviewerName || 'Anonymous'}</p>
                    <p className="text-xs text-gray-500">
                      {review.createdAt ? new Date(review.createdAt.toDate?.() || review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : ''}
                    </p>
                  </div>
                </div>
              </div>

              {/* Rating Stars */}
              <div className="flex text-yellow-400 text-xl gap-0.5 ml-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span key={i} className={i <= (review.rating || 0) ? '' : 'opacity-30'}>
                    ★
                  </span>
                ))}
              </div>
            </div>

            {/* Comment */}
            <p className="text-gray-700 leading-relaxed text-base font-medium">{review.comment}</p>

            {/* Rating Badge */}
            <div className="mt-4 inline-block">
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-2 rounded-full text-sm font-bold">
                {review.rating} ⭐
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

