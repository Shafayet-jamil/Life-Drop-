import { useState, useEffect } from 'react'
import { getAllUsers } from '../utils/firebaseHelpers'
import LoadingSpinner from '../components/LoadingSpinner'

export default function AdminDashboard() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filterRole, setFilterRole] = useState('all')

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        setError('')
        const allUsers = await getAllUsers()
        setUsers(allUsers)
      } catch (err) {
        console.error('Error fetching users:', err)
        setError(err.message || 'Failed to fetch users')
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const filteredUsers = filterRole === 'all' ? users : users.filter(u => u.role === filterRole)
  const donorCount = users.filter(u => u.role === 'donor').length
  const receiverCount = users.filter(u => u.role === 'receiver').length

  if (loading) return <LoadingSpinner />

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-blood">{users.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">Donors</h3>
          <p className="text-3xl font-bold text-blue-600">{donorCount}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">Receivers</h3>
          <p className="text-3xl font-bold text-green-600">{receiverCount}</p>
        </div>
      </div>

      {error && (
        <div className="p-4 mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Filter */}
      <div className="mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setFilterRole('all')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filterRole === 'all'
                ? 'bg-blood text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            All Users ({users.length})
          </button>
          <button
            onClick={() => setFilterRole('donor')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filterRole === 'donor'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Donors ({donorCount})
          </button>
          <button
            onClick={() => setFilterRole('receiver')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filterRole === 'receiver'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Receivers ({receiverCount})
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="p-8 text-center text-gray-600">
            No users found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Role</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Blood Type</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Phone</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Location</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Joined</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-700">{user.email}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        user.role === 'donor'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {user.role === 'donor' ? '🩸 Donor' : '👤 Receiver'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{user.name || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{user.bloodType || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{user.phone || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{user.location || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {user.createdAt ? new Date(user.createdAt.toDate?.() || user.createdAt).toLocaleDateString() : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
