import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useFirestore } from '../hooks/useFirestore'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import DonorProfileCard from '../components/DonorProfileCard'

const BLOOD_TYPES = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+']

export default function SearchDonors() {
  const { currentUser } = useAuth()
  const { data: allDonors, loading, subscribeToAvailableDonors } = useFirestore()
  const [filteredDonors, setFilteredDonors] = useState([])
  const [bloodTypeFilter, setBloodTypeFilter] = useState('')
  const [cityFilter, setCityFilter] = useState('')

  useEffect(() => {
    subscribeToAvailableDonors()
  }, [])

  useEffect(() => {
    let filtered = allDonors.filter((donor) => {
      // Exclude current user if they're also a donor
      if (donor.id === currentUser?.uid) return false

      // Filter by blood type
      if (bloodTypeFilter && donor.bloodType !== bloodTypeFilter) return false

      // Filter by city (case-insensitive)
      if (cityFilter && !donor.city.toLowerCase().includes(cityFilter.toLowerCase())) {
        return false
      }

      return true
    })

    setFilteredDonors(filtered)
  }, [allDonors, bloodTypeFilter, cityFilter, currentUser])

  if (loading) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-block mb-4">
            <span className="text-6xl">🩸</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-4">
            Find Blood Donors
          </h1>
          <p className="text-xl text-gray-600 font-semibold max-w-2xl mx-auto">
            Connect with available blood donors in your area. Save lives by finding compatible donors quickly and easily.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-12 border border-gray-100">
          <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
            🔍 Search & Filter
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Blood Type Filter */}
            <div>
              <label className="block text-sm font-black text-gray-900 mb-3">
                💧 Blood Type
              </label>
              <select
                value={bloodTypeFilter}
                onChange={(e) => setBloodTypeFilter(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-xl px-5 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400/30 font-semibold text-gray-800 bg-white hover:border-gray-400 transition"
              >
                <option value="">All blood types</option>
                {BLOOD_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* City Filter */}
            <div>
              <label className="block text-sm font-black text-gray-900 mb-3">
                📍 Location
              </label>
              <input
                type="text"
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                placeholder="Search by city..."
                className="w-full border-2 border-gray-300 rounded-xl px-5 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400/30 font-semibold text-gray-800 placeholder-gray-500 hover:border-gray-400 transition"
              />
            </div>
          </div>
        </div>

        {/* Donors List */}
        {filteredDonors.length === 0 ? (
          <EmptyState
            title="No donors found"
            message={
              allDonors.length === 0
                ? 'No available donors at the moment.'
                : 'No donors match your filters. Try adjusting your search criteria.'
            }
          />
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-8 text-center">
              <p className="text-lg font-black text-gray-900">
                Found <span className="text-3xl text-blue-600">{filteredDonors.length}</span> Available {filteredDonors.length === 1 ? 'Donor' : 'Donors'}
              </p>
            </div>

            {/* Cards Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDonors.map((donor) => (
                <DonorProfileCard key={donor.id} donor={donor} showFullProfile={false} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
