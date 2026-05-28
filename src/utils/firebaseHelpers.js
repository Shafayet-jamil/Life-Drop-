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

// Review operations
export const saveReview = async (reviewData) => {
  const reviewsRef = collection(db, 'reviews')
  const docRef = await addDoc(reviewsRef, {
    ...reviewData,
    createdAt: new Date(),
  })
  
  // Update donor's rating stats
  await updateDonorRatingStats(reviewData.donorId)
  
  return docRef.id
}

export const getReviewsForDonor = async (donorId) => {
  const q = query(
    collection(db, 'reviews'),
    where('donorId', '==', donorId),
    orderBy('createdAt', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}

export const listenToReviewsForDonor = (donorId, callback) => {
  const q = query(
    collection(db, 'reviews'),
    where('donorId', '==', donorId),
    orderBy('createdAt', 'desc')
  )
  return onSnapshot(q, (snapshot) => {
    const reviews = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    callback(reviews)
  })
}

export const updateDonorRatingStats = async (donorId) => {
  const reviews = await getReviewsForDonor(donorId)
  
  if (reviews.length === 0) {
    await updateDoc(doc(db, 'users', donorId), {
      averageRating: 0,
      reviewCount: 0,
    })
    return
  }
  
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
  const averageRating = (totalRating / reviews.length).toFixed(1)
  
  await updateDoc(doc(db, 'users', donorId), {
    averageRating: parseFloat(averageRating),
    reviewCount: reviews.length,
  })
}

// Donation tracking operations
export const updateDonationStats = async (donorId) => {
  const userRef = doc(db, 'users', donorId)
  const userDoc = await getDoc(userRef)
  
  if (userDoc.exists()) {
    const currentDonations = userDoc.data().totalDonations || 0
    await updateDoc(userRef, {
      totalDonations: currentDonations + 1,
      lastDonationDate: new Date(),
    })
  }
}

export const getDonorStats = async (donorId) => {
  const userRef = doc(db, 'users', donorId)
  const userDoc = await getDoc(userRef)
  
  if (userDoc.exists()) {
    const data = userDoc.data()
    return {
      totalDonations: data.totalDonations || 0,
      lastDonationDate: data.lastDonationDate || null,
      averageRating: data.averageRating || 0,
      reviewCount: data.reviewCount || 0,
    }
  }
  
  return {
    totalDonations: 0,
    lastDonationDate: null,
    averageRating: 0,
    reviewCount: 0,
  }
}
