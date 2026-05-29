import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  onSnapshot,
  orderBy,
} from 'firebase/firestore'
import { db } from '../firebase/config'

// User operations
export const saveUser = async (userId, userData) => {
  const userRef = doc(db, 'users', userId)
  await setDoc(userRef, userData, { merge: true })
}

export const getUserProfile = async (userId) => {
  const userRef = doc(db, 'users', userId)
  const snapshot = await getDoc(userRef)
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null
}

// Request operations
export const saveDonorRequest = async (requestData) => {
  const requestsRef = collection(db, 'requests')
  const docRef = await addDoc(requestsRef, {
    ...requestData,
    createdAt: new Date(),
    status: 'pending',
  })
  return docRef.id
}

export const updateRequestStatus = async (requestId, status, donorId = null) => {
  const requestRef = doc(db, 'requests', requestId)
  const updateData = { status }
  if (donorId) {
    updateData.donorId = donorId
  }
  await updateDoc(requestRef, updateData)
}

export const getDonorRequests = async (donorId) => {
  const q = query(
    collection(db, 'requests'),
    where('donorId', '==', donorId),
    orderBy('createdAt', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}

export const getReceiverRequests = async (receiverId) => {
  const q = query(
    collection(db, 'requests'),
    where('receiverId', '==', receiverId),
    orderBy('createdAt', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}

export const getIncomingDonorRequests = async (donorId) => {
  const q = query(
    collection(db, 'requests'),
    where('donorId', '==', donorId),
    orderBy('createdAt', 'desc')
  )
  return q
}

export const getReceiverRequestsQuery = async (receiverId) => {
  const q = query(
    collection(db, 'requests'),
    where('receiverId', '==', receiverId),
    orderBy('createdAt', 'desc')
  )
  return q
}

export const getRequest = async (requestId) => {
  const requestRef = doc(db, 'requests', requestId)
  const snapshot = await getDoc(requestRef)
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null
}

// Get all donors
export const getAvailableDonors = async () => {
  const q = query(
    collection(db, 'users'),
    where('role', '==', 'donor'),
    orderBy('name')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}

// Get all users (for admin)
export const getAllUsers = async () => {
  try {
    const usersCollection = collection(db, 'users')
    const snapshot = await getDocs(usersCollection)
    const users = snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt || new Date()
      }
    })
    return users.sort((a, b) => {
      const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt)
      const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt)
      return new Date(dateB) - new Date(dateA)
    })
  } catch (error) {
    console.error('getAllUsers error:', error.code, error.message)
    throw error
  }
}

// Real-time listener utilities
export const listenToIncomingRequests = (donorId, callback) => {
  const q = query(
    collection(db, 'requests'),
    where('donorId', '==', donorId),
    orderBy('createdAt', 'desc')
  )
  return onSnapshot(q, (snapshot) => {
    const requests = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    callback(requests)
  })
}

export const listenToReceiverRequests = (receiverId, callback) => {
  const q = query(
    collection(db, 'requests'),
    where('receiverId', '==', receiverId),
    orderBy('createdAt', 'desc')
  )
  return onSnapshot(q, (snapshot) => {
    const requests = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    callback(requests)
  })
}

export const listenToAvailableDonors = (callback) => {
  const q = query(
    collection(db, 'users'),
    where('role', '==', 'donor')
  )
  return onSnapshot(q, (snapshot) => {
    const donors = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    callback(donors)
  })
}

export const listenToSingleUser = (userId, callback) => {
  const userRef = doc(db, 'users', userId)
  return onSnapshot(userRef, (snapshot) => {
    if (snapshot.exists()) {
      callback({ id: snapshot.id, ...snapshot.data() })
    }
  })
}

// Reviews operations
export const saveReview = async (donorId, receiverId, review) => {
  const reviewsRef = collection(db, 'reviews')
  return await addDoc(reviewsRef, {
    donorId,
    receiverId,
    ...review,
    createdAt: new Date(),
  })
}

export const getDonorReviews = async (donorId) => {
  const q = query(
    collection(db, 'reviews'),
    where('donorId', '==', donorId),
    orderBy('createdAt', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}

// Donation count
export const getDonationCount = async (donorId) => {
  const q = query(
    collection(db, 'requests'),
    where('donorId', '==', donorId),
    where('status', '==', 'accepted')
  )
  const snapshot = await getDocs(q)
  return snapshot.size
}
