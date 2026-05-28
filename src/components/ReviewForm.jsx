import { useState } from 'react'
import { saveReview } from '../utils/firebaseHelpers'

export default function ReviewForm({ donorId, receiverId, donorName, onReviewSubmitted }) {
  const [rating, setRating] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (rating === 0) {
      setError('Please select a rating')
      return
    }

    if (reviewText.trim().length < 10) {
      setError('Review must be at least 10 characters long')
      return
    }

    setLoading(true)

    try {
      await saveReview({
        donorId,
        receiverId,
        rating,
        reviewText: reviewText.trim(),
      })

      setSuccess(true)
      setRating(0)
      setReviewText('')

      if (onReviewSubmitted) {
        onReviewSubmitted()
      }

      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError('Failed to submit review. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Leave a Review for {donorName}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Star Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Rate your experience
          </label>
          <div className="flex gap-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-3xl transition transform hover:scale-110 ${
                  star <= rating ? 'text-yellow-400' : 'text-gray-300'
                }`}
              >
                ★
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-sm text-gray-600 mt-2">{rating} star(s) selected</p>
          )}
        </div>

        {/* Review Text */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Review
          </label>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Share your experience with this donor. How was their behavior? Overall experience? (minimum 10 characters)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blood focus:outline-none focus:ring-2 focus:ring-blood/20 resize-none"
            rows="4"
          />
          <p className="text-xs text-gray-500 mt-1">
            {reviewText.length}/100 characters
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
            ✓ Review submitted successfully!
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blood text-white py-2 rounded-lg hover:bg-red-700 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  )
}
