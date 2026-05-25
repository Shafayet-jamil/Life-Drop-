# LifeDrop - Blood Donation App

A complete Uber-style blood donation app built with React, Vite, Firebase, and Tailwind CSS.

## Features

- **User Authentication**: Email/password registration with role selection (Donor/Receiver)
- **Donor Flow**: 
  - Set up profile with blood type, city, and phone
  - Toggle availability
  - View and respond to donation requests
- **Receiver Flow**:
  - Search available donors by blood type and city
  - Send requests with personalized messages
  - Track request status in real-time
- **Real-time Updates**: Firestore listeners for instant updates
- **Role-based Access**: Different dashboards for donors and receivers
- **Responsive Design**: Works on desktop, tablet, and mobile

## Project Setup

### 1. Clone and Install

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:5173/`

### 2. Firebase Setup

You need to create a Firebase project and get your credentials:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a new project"
3. Name it "LifeDrop"
4. Enable Google Analytics (optional)
5. Once created, go to Project Settings (⚙️)
6. Under "Your apps", click "Web" to register a web app
7. Copy the Firebase configuration object

### 3. Configure Environment Variables

1. Open `.env` file in the project root
2. Fill in your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Setup Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click **Create database**
3. Start in **Test mode** (for development)
4. Choose location (default is fine)
5. Click **Create**

#### Set Firestore Security Rules

Go to **Firestore → Rules** and replace with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId || request.auth != null;
    }
    
    // Requests collection
    match /requests/{requestId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.donorId || request.auth.uid == resource.data.receiverId;
    }
  }
}
```

Click **Publish**

### 5. Enable Authentication

1. Go to **Authentication** → **Sign-in method**
2. Enable **Email/Password**
3. Save changes

## Project Structure

```
src/
├── firebase/
│   └── config.js          # Firebase initialization
├── contexts/
│   ├── AuthContext.jsx    # Auth state management
│   └── UserContext.jsx    # User profile state
├── hooks/
│   ├── useAuth.js
│   ├── useUser.js
│   └── useFirestore.js    # Real-time listeners
├── utils/
│   ├── firebaseHelpers.js # Firestore CRUD operations
│   └── validators.js      # Form validation
├── components/
│   ├── ProtectedRoute.jsx
│   ├── LoadingSpinner.jsx
│   ├── EmptyState.jsx
│   ├── Navbar.jsx
│   └── forms/
│       ├── LoginForm.jsx
│       ├── RegisterForm.jsx
│       └── RequestForm.jsx
├── pages/
│   ├── Landing.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── DonorProfileSetup.jsx
│   ├── DonorDashboard.jsx
│   ├── RequestDetail.jsx
│   ├── SearchDonors.jsx
│   ├── SendRequest.jsx
│   ├── MyRequests.jsx
│   └── NotFound.jsx
├── App.jsx
├── main.jsx
└── index.css
```

## Routes

### Public Routes
- `/` - Landing page
- `/login` - Login page
- `/register` - Registration with role selection

### Donor Routes (Protected)
- `/donor/setup` - Profile setup after registration
- `/donor/dashboard` - Main donor hub with incoming requests
- `/donor/requests/:requestId` - View and respond to request

### Receiver Routes (Protected)
- `/receiver/search` - Search available donors
- `/receiver/requests/:donorId/send` - Send request to donor
- `/receiver/requests` - Track sent requests

## Testing the App

### Donor Flow

1. **Register**
   - Click "Register"
   - Enter email, password, select "Donor" role
   - Click "Register"

2. **Setup Profile**
   - Fill in: Name, Blood Type, City, Phone
   - Click "Complete Setup"

3. **Toggle Availability**
   - On dashboard, click "Mark as Available"
   - Your profile is now visible to receivers

4. **Receive & Accept Requests**
   - Requests from receivers appear on your dashboard
   - Click request to view details
   - Accept or Decline

### Receiver Flow

1. **Register**
   - Click "Register"
   - Enter email, password, select "Receiver" role
   - Click "Register" (skips profile setup)

2. **Search Donors**
   - Click "Search Donors"
   - Filter by blood type and city
   - Click "Request Blood" on a donor card

3. **Send Request**
   - Fill in message explaining your need
   - Click "Send Request"

4. **Track Status**
   - Go to "My Requests"
   - View request status: Pending → Accepted → See donor contact info
   - Or see Declined status

## Key Features Explained

### Real-time Updates
- DonorDashboard: Listens to incoming requests
- MyRequests: Listens to sent requests
- Updates appear instantly without page refresh

### Role-based Routing
- Donors automatically go to `/donor/dashboard`
- Receivers automatically go to `/receiver/requests`
- Protected routes prevent unauthorized access
- Users can't access routes for their non-existent role

### Firestore Collections

**users/**
- userId: {name, email, role, bloodType, city, phone, isAvailable}

**requests/**
- requestId: {receiverId, donorId, bloodType, city, message, status, createdAt}

## Build for Production

```bash
npm run build
```

Output goes to `dist/` folder

## Tech Stack

- **React 19** - UI library
- **Vite 8** - Build tool & dev server
- **Firebase 12** - Backend (Auth + Firestore)
- **React Router 7** - Client-side routing
- **Tailwind CSS 4** - Utility-first CSS framework

## Notes

- App uses Firestore Realtime listeners (onSnapshot) for live updates
- Firebase free tier: 50K reads, 20K writes, 20K deletes per day
- Clean up listeners when components unmount to avoid quota overages
- Tighten security rules before deploying to production
- All form validation happens client-side
- Password must be at least 6 characters

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
