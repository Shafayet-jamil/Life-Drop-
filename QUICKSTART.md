# Quick Start Guide

## 1. Get Firebase Credentials

1. Go to https://console.firebase.google.com/
2. Create a new project named "LifeDrop"
3. Go to Project Settings (gear icon)
4. Under "Your apps", click "Web" to register app
5. Copy all the config values

## 2. Fill .env File

Edit `.env` in the project root with your Firebase config:

```
VITE_FIREBASE_API_KEY=abc123...
VITE_FIREBASE_AUTH_DOMAIN=lifedrop-xxxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=lifedrop-xxxxx
VITE_FIREBASE_STORAGE_BUCKET=lifedrop-xxxxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123def456
```

## 3. Setup Firebase

### Firestore
1. In Firebase Console → Firestore Database
2. Create database in Test mode
3. Go to Rules tab
4. Replace with these rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId || request.auth != null;
    }
    match /requests/{requestId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.donorId || request.auth.uid == resource.data.receiverId;
    }
  }
}
```

### Authentication
1. Go to Authentication → Sign-in method
2. Enable Email/Password
3. Save

## 4. Run the App

```bash
npm run dev
```

App opens at `http://localhost:5173/`

## 5. Test It

**Test Donor Account:**
1. Register with email, password, select "Donor"
2. Fill profile (name, blood type O+, city, phone)
3. Toggle "Mark as Available"

**Test Receiver Account (in another browser/incognito):**
1. Register with different email, password, select "Receiver"
2. Click "Search Donors"
3. Click "Request Blood" on the donor
4. Send request with a message
5. Check "My Requests" for status

**Back on Donor:**
1. See request in "Incoming Requests"
2. Click request, click "✓ Accept Request"

**Back on Receiver:**
1. Refresh "My Requests"
2. See donor contact info appear

## Troubleshooting

**"Firebase: Error (auth/invalid-api-key)"**
- Make sure .env has all Firebase credentials

**"No database found" errors**
- Firestore database must be created in Firebase Console

**"Permission denied" errors**
- Check Firestore security rules are updated

**"Module not found" errors**
- Make sure all files are created (check src/ folder structure)

## Key Routes

- `/` - Landing page
- `/login` - Login
- `/register` - Register (role selection)
- `/donor/dashboard` - Donor main page
- `/receiver/search` - Receiver search page
- `/receiver/requests` - Receiver track requests

## Learn More

See README.md for full documentation
