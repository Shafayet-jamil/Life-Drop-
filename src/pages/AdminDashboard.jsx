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
  const adminCount = users.filter(u => u.role === 'admin').length

  if (loading) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-block mb-4">
            <span className="text-5xl">⚙️</span>
          </div>
          <h1 className="text-5xl font-black text-gray-900 mb-3">Admin Dashboard</h1>
          <p className="text-xl text-gray-600 font-semibold">Manage all users and monitor system activity</p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl shadow-lg border-2 border-blue-200 hover:shadow-xl transition-all">
            <p className="text-blue-600 text-sm font-black mb-2">👥 TOTAL USERS</p>
            <p className="text-4xl font-black text-blue-700">{users.length}</p>
            <p className="text-blue-600 text-xs font-semibold mt-2">Active members</p>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 p-8 rounded-2xl shadow-lg border-2 border-red-200 hover:shadow-xl transition-all">
            <p className="text-red-600 text-sm font-black mb-2">🩸 DONORS</p>
            <p className="text-4xl font-black text-red-700">{donorCount}</p>
            <p className="text-red-600 text-xs font-semibold mt-2">Blood donors</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl shadow-lg border-2 border-green-200 hover:shadow-xl transition-all">
            <p className="text-green-600 text-sm font-black mb-2">👤 RECEIVERS</p>
            <p className="text-4xl font-black text-green-700">{receiverCount}</p>
            <p className="text-green-600 text-xs font-semibold mt-2">Blood receivers</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl shadow-lg border-2 border-purple-200 hover:shadow-xl transition-all">
            <p className="text-purple-600 text-sm font-black mb-2">👨‍💼 ADMINS</p>
            <p className="text-4xl font-black text-purple-700">{adminCount}</p>
            <p className="text-purple-600 text-xs font-semibold mt-2">Administrators</p>
          </div>
        </div>

        {error && (
          <div className="p-6 mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg font-semibold flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Filter Buttons */}
        <div className="mb-8">
          <p className="text-sm font-black text-gray-900 mb-4">FILTER BY ROLE</p>
          <div className="flex gap-4 flex-wrap">
            {[
              { id: 'all', label: 'All Users', count: users.length, color: 'from-blue-500 to-blue-600' },
              { id: 'donor', label: 'Donors', count: donorCount, color: 'from-red-500 to-red-600' },
              { id: 'receiver', label: 'Receivers', count: receiverCount, color: 'from-green-500 to-green-600' },
              { id: 'admin', label: 'Admins', count: adminCount, color: 'from-purple-500 to-purple-600' }
            ].map(btn => (
              <button
                key={btn.id}
                onClick={() => setFilterRole(btn.id)}
                className={`px-6 py-3 rounded-xl font-black transition-all duration-300 transform hover:scale-105 shadow-lg ${
                  filterRole === btn.id
                    ? `bg-gradient-to-r ${btn.color} text-white`
                    : 'bg-white text-gray-800 border-2 border-gray-300 hover:border-gray-400'
                }`}
              >
                {btn.label} ({btn.count})
              </button>
            ))}
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          {filteredUsers.length === 0 ? (
            <div className="p-16 text-center">
              <p className="text-5xl mb-4">👤</p>
              <p className="text-xl text-gray-600 font-semibold">No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
                  <tr>
                    <th className="px-8 py-5 text-left text-sm font-black">EMAIL</th>
                    <th className="px-8 py-5 text-left text-sm font-black">ROLE</th>
                    <th className="px-8 py-5 text-left text-sm font-black">NAME</th>
                    <th className="px-8 py-5 text-left text-sm font-black">BLOOD TYPE</th>
                    <th className="px-8 py-5 text-left text-sm font-black">PHONE</th>
                    <th className="px-8 py-5 text-left text-sm font-black">LOCATION</th>
                    <th className="px-8 py-5 text-left text-sm font-black">JOINED</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-8 py-5 text-sm font-semibold text-gray-800">{user.email}</td>
                      <td className="px-8 py-5 text-sm">
                        <span className={`px-4 py-2 rounded-lg font-black text-sm ${
                          user.role === 'donor'
                            ? 'bg-red-100 text-red-800'
                            : user.role === 'receiver'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {user.role === 'donor' && '🩸'} {user.role === 'receiver' && '👤'} {user.role === 'admin' && '⚙️'} {user.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-sm font-semibold text-gray-800">{user.name || '-'}</td>
                      <td className="px-8 py-5 text-sm font-semibold text-gray-800">{user.bloodType || '-'}</td>
                      <td className="px-8 py-5 text-sm text-gray-700">{user.phone || '-'}</td>
                      <td className="px-8 py-5 text-sm text-gray-700">{user.city || user.location || '-'}</td>
                      <td className="px-8 py-5 text-sm text-gray-600">
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
    </div>
  )
}
