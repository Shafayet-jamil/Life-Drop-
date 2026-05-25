import { useState, useEffect } from 'react'
import {
  listenToIncomingRequests,
  listenToReceiverRequests,
  listenToAvailableDonors,
} from '../utils/firebaseHelpers'

export function useFirestore() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const subscribeToIncomingRequests = (donorId) => {
    setLoading(true)
    setError('')
    const unsubscribe = listenToIncomingRequests(donorId, (requests) => {
      setData(requests)
      setLoading(false)
    })
    return unsubscribe
  }

  const subscribeToReceiverRequests = (receiverId) => {
    setLoading(true)
    setError('')
    const unsubscribe = listenToReceiverRequests(receiverId, (requests) => {
      setData(requests)
      setLoading(false)
    })
    return unsubscribe
  }

  const subscribeToAvailableDonors = () => {
    setLoading(true)
    setError('')
    const unsubscribe = listenToAvailableDonors((donors) => {
      setData(donors)
      setLoading(false)
    })
    return unsubscribe
  }

  return {
    data,
    loading,
    error,
    subscribeToIncomingRequests,
    subscribeToReceiverRequests,
    subscribeToAvailableDonors,
  }
}
