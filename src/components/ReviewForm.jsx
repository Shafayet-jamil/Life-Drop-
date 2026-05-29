import { useState } from 'react'
import { saveReview } from '../utils/firebaseHelpers'

export default function ReviewForm({ donorId, receiverName, onReviewSubmitted }) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (!comment.trim()) {
      setError('Please write a review')
      return
    }

    try {
      setLoading(true)
      await saveReview(donorId, null, {
        rating,
        comment: comment.trim(),
        reviewerName: receiverName || 'Anonymous',
      })
      setSuccess(true)
      setComment('')
      setRating(5)
      if (onReviewSubmitted) {
        onReviewSubmitted()
      }
    } catch (err) {
      setError(err.message || 'Failed to submit review')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
      <h3 className="font-semibold text-gray-800 mb-4">Leave a Review</h3>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
          Review submitted successfully!
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => setRating(i)}
              className={`text-3xl transition ${
                i <= rating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-200'
              }`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience with this donor..."
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-blood focus:outline-none focus:ring-2 focus:ring-blood/20"
          rows="4"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blood text-white py-2 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 transition"
      >
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  )
}
