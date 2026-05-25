import { createContext, useState, useEffect } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { auth } from '../firebase/config'
import { saveUser, getUserProfile } from '../utils/firebaseHelpers'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          setCurrentUser(user)
          // Fetch user profile to get role
          const profile = await getUserProfile(user.uid)
          if (profile) {
            setUserRole(profile.role)
          }
        } else {
          setCurrentUser(null)
          setUserRole(null)
        }
      } catch (err) {
        console.error('Auth state error:', err)
      } finally {
        setLoading(false)
      }
    })

    return unsubscribe
  }, [])

  const signup = async (email, password, role) => {
    setError('')
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      // Create user profile in Firestore
      await saveUser(result.user.uid, {
        email,
        role,
        createdAt: new Date(),
      })
      setUserRole(role)
      return result.user
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const login = async (email, password) => {
    setError('')
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      return result.user
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const logout = async () => {
    setError('')
    try {
      await signOut(auth)
      setUserRole(null)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userRole,
        loading,
        error,
        signup,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
