export default function DonationStats({ totalDonations, lastDonationDate }) {
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Never'
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    const now = new Date()
    const diffMs = now - date
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Total Donations */}
      <div className="bg-gradient-to-br from-blood to-red-700 rounded-lg p-4 text-white shadow-md">
        <div className="text-3xl font-bold">{totalDonations}</div>
        <p className="text-red-100 text-sm mt-1">
          {totalDonations === 1 ? 'Donation' : 'Donations'}
        </p>
        <p className="text-xs text-red-200 mt-2">💉 Total given</p>
      </div>

      {/* Last Donation */}
      <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-lg p-4 text-white shadow-md">
        <div className="text-sm font-semibold">Last Donation</div>
        <p className="text-lg font-bold mt-2">{formatDate(lastDonationDate)}</p>
        <p className="text-xs text-green-200 mt-2">📅 {totalDonations > 0 ? 'Time' : 'Not yet'}</p>
      </div>
    </div>
  )
}
