import { createContext, useState, useEffect } from 'react'
import { getUserProfile, listenToSingleUser } from '../utils/firebaseHelpers'

export const UserContext = createContext()

export function UserProvider({ children }) {
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchUserProfile = async (userId) => {
    if (!userId) return
    setLoading(true)
    setError('')
    try {
      const profile = await getUserProfile(userId)
      setUserProfile(profile)
    } catch (err) {
      setError(err.message)
      console.error('Error fetching user profile:', err)
    } finally {
      setLoading(false)
    }
  }

  const subscribeToUserProfile = (userId, onUpdate) => {
    if (!userId) return () => {}
    return listenToSingleUser(userId, (profile) => {
      setUserProfile(profile)
      if (onUpdate) onUpdate(profile)
    })
  }

  return (
    <UserContext.Provider
      value={{
        userProfile,
        loading,
        error,
        fetchUserProfile,
        subscribeToUserProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
