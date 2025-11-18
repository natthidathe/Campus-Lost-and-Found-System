// In client/src/pages/Home.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAuthSession, signOut } from 'aws-amplify/auth';


const StudentView = () => (
  <div>
    <h2>Student Dashboard</h2>
    <p>Report Lost/Found | Item List</p>
  </div>
);


const StaffView = () => (
  <div>
    <h2>Staff Dashboard</h2>
    <p>Item Management | Verification</p>
  </div>
);


const AdminView = () => (
  <div>
    <h2>Admin Panel</h2>
    <p>Manage All Reports | Staff Verification</p>
  </div>
);



export default function Home() {
  const [userGroups, setUserGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkAuthAndGetGroups() {
      try {
        
        const session = await fetchAuthSession();
        

        const groups = session.tokens?.accessToken.payload['cognito:groups'] || [];
        setUserGroups(groups);
        
      } catch (error) {

        console.log('User is not authenticated');
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    }
    
    checkAuthAndGetGroups();
  }, [navigate]); 

  
  const handleLogout = async () => {
    try {
      await signOut(); 
      navigate('/'); 
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };


  const renderDashboard = () => {
    if (userGroups.includes('admin')) {
      return <AdminView />;
    }
    if (userGroups.includes('staff')) {
      return <StaffView />;
    }
    
    if (userGroups.includes('student') || userGroups.length === 0) {
      return <StudentView />;
    }
    return <StudentView />; // Failsafe
  };


  if (isLoading) {
    return <div>Loading...</div>;
  }


  return (
    <div>
      <h1>Home - Lost & Found</h1>
      <button onClick={handleLogout} style={{ float: 'right' }}>
        Logout
      </button>

      
      {renderDashboard()}
    </div>
  );
}