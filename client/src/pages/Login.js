// In client/src/pages/Login.js

import React, { useEffect } from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import { useNavigate } from 'react-router-dom';
import '@aws-amplify/ui-react/styles.css';
import { fetchAuthSession } from 'aws-amplify/auth';

// This is the function that will run when a user tries to sign up.
// We are overriding the default Amplify behavior.
const customSignUpHandler = async (formData) => {
  // This is the default sign-up logic from Amplify
  const { username, password, attributes } = formData;
  
  // We must import this to call Cognito
  const { signUp } = await import('aws-amplify/auth');

  try {
    const result = await signUp({
      username,
      password,
      attributes,
    });
    return result;
    
  } catch (error) {
    // This is the FIX:
    // 1. We catch the full, ugly error (e.g., "PreSignUp failed...")
    // 2. We check if it's our specific email error.
    if (error.message.includes("@g.siit.tu.ac.th")) {
      // 3. We throw a NEW, clean error with *only* our message.
      throw new Error("Only @g.siit.tu.ac.th email addresses are allowed.");
    }
    
    // For any other error (like "Password too short"), show it normally.
    throw error;
  }
};


// This is the redirect component (no change here)
// This is the redirect component (the MODIFIED version)
function RedirectToHome() {
  const navigate = useNavigate();
  
  useEffect(() => {
    async function checkUserRole() {
      try {
        // 1. Get the current user's session token
        const { tokens } = await fetchAuthSession();
        
        // 2. Extract the groups/roles from the ID token (Cognito stores roles in 'cognito:groups')
        const groups = tokens.idToken.payload['cognito:groups'] || []; 
        
        // 3. Determine the destination based on the group
        if (groups.includes('admin') || groups.includes('staff')) {
          // If the user belongs to the Admin or Staff group, go to the Admin Dashboard
          navigate('/admin/dashboard');
        } else {
          // Default: If Student or unassigned, go to the Student Home page
          navigate('/home');
        }
      } catch (error) {
        console.error("Error checking user role:", error);
        // Fallback safety redirect
        navigate('/home');
      }
    }
    checkUserRole();
  }, [navigate]);
  
  return <div>Authenticating and checking role...</div>;
}

// This is your main Login component
export default function Login() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Authenticator
        // This tells the component to use your custom sign-up logic
        services={{
          handleSignUp: customSignUpHandler,
        }}
        
        // --- THIS IS THE NEW CODE ---
        // This prop changes the field labels
        formFields={{
          signIn: {
            username: {
              label: 'Email',
              placeholder: 'Enter your university email',
            },
          },
          signUp: {
            username: {
              label: 'Email',
              placeholder: 'Enter your university email',
            },
          },
        }}
        // --- END OF NEW CODE ---
      >
        {/* This is the child that renders on successful login */}
        <RedirectToHome />
      </Authenticator>
    </div>
  );
}