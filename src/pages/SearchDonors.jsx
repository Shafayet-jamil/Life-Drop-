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
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Find Available Donors</h1>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="font-semibold text-gray-900 mb-4">Search & Filter</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blood Type
              </label>
              <select
                value={bloodTypeFilter}
                onChange={(e) => setBloodTypeFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-blood focus:outline-none focus:ring-2 focus:ring-blood/20"
              >
                <option value="">All blood types</option>
                {BLOOD_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <input
                type="text"
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                placeholder="Search by city..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-blood focus:outline-none focus:ring-2 focus:ring-blood/20"
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDonors.map((donor) => (
              <DonorProfileCard key={donor.id} donor={donor} showFullProfile={false} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
