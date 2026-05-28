import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useFirestore } from '../hooks/useFirestore'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import { useNavigate } from 'react-router-dom'

export default function AllDonors() {
  const { currentUser, userRole } = useAuth()
  const { data: allDonors, loading, subscribeToAvailableDonors } = useFirestore()
  const navigate = useNavigate()
  const [filteredDonors, setFilteredDonors] = useState([])

  useEffect(() => {
    subscribeToAvailableDonors()
  }, [])

  useEffect(() => {
    // Filter out current user if donor
    let filtered = allDonors.filter((donor) => {
      if (donor.id === currentUser?.uid) return false
      return true
    })
    setFilteredDonors(filtered)
  }, [allDonors, currentUser])

  if (loading) return <LoadingSpinner />

  const handleRequestBlood = (donorId) => {
    if (userRole === 'receiver') {
      navigate(`/receiver/requests/${donorId}/send`)
    } else {
      alert('Only receivers can send blood requests')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">All Registered Donors</h1>
        <p className="text-gray-600 mb-8">Browse all registered blood donors in our network</p>

        {filteredDonors.length === 0 ? (
          <EmptyState
            title="No donors registered"
            message="There are currently no registered donors. Check back soon!"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDonors.map((donor) => (
              <div
                key={donor.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition transform hover:scale-105"
              >
                <div className="bg-gradient-to-r from-blood to-red-700 text-white p-6">
                  <h3 className="text-2xl font-bold">{donor.name}</h3>
                  <p className="text-lg text-red-100 font-semibold">{donor.bloodType}</p>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">📍 Location</p>
                    <p className="text-lg text-gray-800">{donor.city}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 font-semibold">📞 Phone</p>
                    <p className="text-gray-800 font-mono">{donor.phone}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 font-semibold">✉️ Email</p>
                    <p className="text-gray-800 break-all">{donor.email}</p>
                  </div>

                  <div className="pt-4 border-t">
                    <span className="inline-block px-4 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                      ✓ Available
                    </span>
                  </div>

                  {userRole === 'receiver' && (
                    <button
                      onClick={() => handleRequestBlood(donor.id)}
                      className="w-full mt-4 bg-blood text-white py-2 rounded-lg hover:bg-red-700 font-semibold transition"
                    >
                      Request Blood
                    </button>
                  )}

                  {userRole === 'donor' && donor.id === currentUser?.uid && (
                    <div className="text-center text-sm text-blue-600 font-semibold">
                      This is your profile
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <h2 className="font-bold text-blue-900 mb-2">💡 Did you know?</h2>
          <p className="text-blue-800">
            Blood type O- is the universal donor and can be given to anyone. AB+ is the universal recipient.
          </p>
        </div>
      </div>
    </div>
  )
}
