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
      setTimeout(() => setSuccess(false), 3000)
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
    <form onSubmit={handleSubmit} className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl border-2 border-gray-200">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg font-semibold flex items-center gap-3">
          <span className="text-2xl">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-lg font-semibold flex items-center gap-3 animate-pulse">
          <span className="text-2xl">✅</span>
          <span>Review submitted successfully!</span>
        </div>
      )}

      {/* Rating Section */}
      <div className="mb-8">
        <label className="block text-lg font-black text-gray-900 mb-4">
          ⭐ Your Rating
        </label>
        <div className="flex gap-3 justify-center bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-2xl border-2 border-yellow-200">
          {[1, 2, 3, 4, 5].map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => setRating(i)}
              className={`text-5xl transition-all transform duration-200 ${
                i <= rating
                  ? 'text-yellow-400 scale-125 drop-shadow-lg'
                  : 'text-gray-300 hover:text-yellow-300 hover:scale-110'
              }`}
            >
              ★
            </button>
          ))}
        </div>
        <p className="text-center text-gray-600 font-semibold mt-3">
          {rating === 1 && '😞 Not satisfied'}
          {rating === 2 && '😐 Below average'}
          {rating === 3 && '😊 Average'}
          {rating === 4 && '😄 Very good'}
          {rating === 5 && '😍 Excellent'}
        </p>
      </div>

      {/* Review Text Section */}
      <div className="mb-8">
        <label className="block text-lg font-black text-gray-900 mb-3">
          💬 Your Review
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your honest experience with this donor..."
          className="w-full h-40 border-2 border-gray-300 rounded-xl px-5 py-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400/30 resize-none font-semibold text-gray-700 placeholder-gray-500"
        />
        <p className="text-sm text-gray-500 mt-2">
          {comment.length}/300 characters
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 rounded-xl font-black text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100 shadow-lg"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin">⏳</span>
            Submitting...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <span>✈️</span>
            Submit Review
          </span>
        )}
      </button>

      <p className="text-center text-gray-500 text-sm mt-4 font-semibold">
        Your feedback helps others make informed decisions
      </p>
    </form>
  )
}

