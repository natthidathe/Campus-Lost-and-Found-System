// In client/src/pages/Home.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAuthSession, signOut } from 'aws-amplify/auth';

// --- Placeholders for your teammates' components ---
// Mind (Member 1) and PP (Member 3) will build these:
const StudentView = () => (
  <div>
    <h2>Student Dashboard</h2>
    <p>Report Lost/Found | Item List</p>
  </div>
);

// Tong (Member 4) will build this:
const StaffView = () => (
  <div>
    <h2>Staff Dashboard</h2>
    <p>Item Management | Verification</p>
  </div>
);

// Tong (Member 4) will also build this:
const AdminView = () => (
  <div>
    <h2>Admin Panel</h2>
    <p>Manage All Reports | Staff Verification</p>
  </div>
);
// ---------------------------------------------------


export default function Home() {
  const [userGroups, setUserGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkAuthAndGetGroups() {
      try {
        // This will throw an error if the user is not authenticated
        const session = await fetchAuthSession();
        
        // Get the user's groups from their ID token
        const groups = session.tokens?.accessToken.payload['cognito:groups'] || [];
        setUserGroups(groups);
        
      } catch (error) {
        // If there's an error, the user is not logged in.
        // Redirect them to the /login page.
        console.log('User is not authenticated');
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    }
    
    checkAuthAndGetGroups();
  }, [navigate]); // The [navigate] dependency is important

  // Function for the logout button
  const handleLogout = async () => {
    try {
      await signOut(); // This signs the user out of Cognito
      navigate('/'); // Redirect to the Landing page
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  // This function decides which component to show
  const renderDashboard = () => {
    if (userGroups.includes('admin')) {
      return <AdminView />;
    }
    if (userGroups.includes('staff')) {
      return <StaffView />;
    }
    // If not admin or staff, default to student view
    // (We also check if they are in the 'student' group, just to be safe)
    if (userGroups.includes('student') || userGroups.length === 0) {
      return <StudentView />;
    }
    return <StudentView />; // Failsafe
  };

  // Show a loading message while we check authentication
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Once loading is done, show the page
  return (
    <div>
      <h1>Home - Lost & Found</h1>
      <button onClick={handleLogout} style={{ float: 'right' }}>
        Logout
      </button>

      {/* This renders the correct component based on the user's role */}
      {renderDashboard()}
    </div>
  );
}