import { useState, useEffect } from 'react'
import { listenToReviewsForDonor } from '../utils/firebaseHelpers'
import LoadingSpinner from './LoadingSpinner'

export default function ReviewsDisplay({ donorId, donorName, averageRating, reviewCount }) {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!donorId) return

    setLoading(true)
    const unsubscribe = listenToReviewsForDonor(donorId, (fetchedReviews) => {
      setReviews(fetchedReviews)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [donorId])

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={star <= rating ? 'text-yellow-400' : 'text-gray-300'}>
            ★
          </span>
        ))}
      </div>
    )
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown date'
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Reviews & Ratings for {donorName}
      </h3>

      {/* Rating Summary */}
      {reviewCount > 0 && (
        <div className="mb-8 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
          <div className="flex items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-4xl font-bold text-gray-900">{averageRating}</span>
                <span className="text-gray-600">/ 5</span>
              </div>
              {renderStars(Math.round(averageRating))}
            </div>
            <div className="text-sm text-gray-600">
              Based on <span className="font-semibold">{reviewCount}</span> review
              {reviewCount !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">
            No reviews yet. Be the first to review this donor!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="border-l-4 border-blood bg-gray-50 p-4 rounded-lg"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex gap-2 items-center mb-1">
                    {renderStars(review.rating)}
                    <span className="text-sm font-semibold text-gray-700 bg-yellow-100 px-2 py-1 rounded">
                      {review.rating} stars
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{formatDate(review.createdAt)}</p>
                </div>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">{review.reviewText}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
