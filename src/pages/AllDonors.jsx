import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { getAllUsers } from '../utils/firebaseHelpers'
import LoadingSpinner from '../components/LoadingSpinner'
import DonorProfileCard from '../components/DonorProfileCard'
import { useNavigate } from 'react-router-dom'

const BLOOD_TYPES = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+']

export default function AllDonors() {
  const { currentUser, userRole } = useAuth()
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterRole, setFilterRole] = useState('donor')
  const [bloodTypeFilter, setBloodTypeFilter] = useState('')
  const [cityFilter, setCityFilter] = useState('')
  const [filteredUsers, setFilteredUsers] = useState([])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const allUsers = await getAllUsers()
        setUsers(allUsers)
      } catch (err) {
        console.error('Error fetching users:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  useEffect(() => {
    let filtered = users.filter((user) => {
      // Filter by role
      if (filterRole !== 'all' && user.role !== filterRole) return false

      // Exclude current user
      if (user.id === currentUser?.uid) return false

      // Filter by blood type
      if (bloodTypeFilter && user.bloodType !== bloodTypeFilter) return false

      // Filter by city
      if (cityFilter && !user.city?.toLowerCase().includes(cityFilter.toLowerCase())) {
        return false
      }

      return true
    })

    setFilteredUsers(filtered)
  }, [users, filterRole, bloodTypeFilter, cityFilter, currentUser])

  if (loading) return <LoadingSpinner />

  const donorCount = users.filter(u => u.role === 'donor').length
  const receiverCount = users.filter(u => u.role === 'receiver').length

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-block mb-4">
            <span className="text-5xl">👥</span>
          </div>
          <h1 className="text-5xl font-black text-gray-900 mb-3">All Users Directory</h1>
          <p className="text-xl text-gray-600 font-semibold">Browse all registered donors and receivers in our network</p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-2xl shadow-lg border-2 border-red-200">
            <p className="text-red-600 text-sm font-black mb-1">🩸 DONORS</p>
            <p className="text-3xl font-black text-red-700">{donorCount}</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl shadow-lg border-2 border-green-200">
            <p className="text-green-600 text-sm font-black mb-1">👤 RECEIVERS</p>
            <p className="text-3xl font-black text-green-700">{receiverCount}</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl shadow-lg border-2 border-blue-200">
            <p className="text-blue-600 text-sm font-black mb-1">👥 TOTAL</p>
            <p className="text-3xl font-black text-blue-700">{users.length}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-12 border border-gray-100">
          <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
            🔍 Search & Filter
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Role Filter */}
            <div>
              <label className="block text-sm font-black text-gray-900 mb-3">Role Type</label>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-xl px-5 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400/30 font-semibold text-gray-800 bg-white hover:border-gray-400 transition"
              >
                <option value="donor">🩸 Donors Only</option>
                <option value="receiver">👤 Receivers Only</option>
                <option value="all">👥 All Users</option>
              </select>
            </div>

            {/* Blood Type Filter */}
            <div>
              <label className="block text-sm font-black text-gray-900 mb-3">💧 Blood Type</label>
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
              <label className="block text-sm font-black text-gray-900 mb-3">📍 Location</label>
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

        {/* Users List */}
        {filteredUsers.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-2xl p-16 text-center border border-gray-100">
            <p className="text-6xl mb-6">🔍</p>
            <h2 className="text-3xl font-black text-gray-900 mb-3">No Users Found</h2>
            <p className="text-xl text-gray-600 font-semibold">
              No {filterRole === 'all' ? 'users' : filterRole === 'donor' ? 'donors' : 'receivers'} match your search criteria
            </p>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-8 text-center">
              <p className="text-lg font-black text-gray-900">
                Found <span className="text-3xl text-blue-600">{filteredUsers.length}</span> {filterRole === 'all' ? 'User' : filterRole === 'donor' ? 'Donor' : 'Receiver'}{filteredUsers.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Cards Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredUsers.map((user) => (
                <DonorProfileCard key={user.id} donor={user} showFullProfile={false} />
              ))}
            </div>
          </>
        )}

        {/* Info Box */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 rounded-2xl p-8 text-center">
          <p className="text-2xl mb-3">💡 Blood Type Information</p>
          <p className="text-lg text-gray-800 font-semibold">
            🩸 <strong>O-</strong> is the universal donor (can give to anyone) • <strong>AB+</strong> is the universal recipient (can receive from anyone)
          </p>
        </div>
      </div>
    </div>
  )
}
