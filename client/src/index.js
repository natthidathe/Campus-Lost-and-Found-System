import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// 1. IMPORT AMPLIFY AND STYLES
import { Amplify } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css'; 

// 2. PASTE YOUR AMPLIFY CONFIGURE CODE HERE
Amplify.configure({
  Auth: {
    Cognito: {
      // 1. This is your correct User Pool ID
      userPoolId: 'us-east-1_cy41QrYAg', 
      
      // 2. This is your correct App Client ID
      userPoolClientId: '400etr3rk0m39t2b6ed3807po8', 
      
      loginWith: {
        oauth: {
          // 3. PASTE YOUR *CORRECT* COGNITO DOMAIN HERE
          // (Find it on the 'App integration' tab)
          domain: 'YOUR-DOMAIN-FROM-COGNITO.auth.us-east-1.amazoncognito.com', 
          
          scopes: ['openid', 'email', 'profile'],
          redirectSignIn: ['http://localhost:3000/'],
          redirectSignOut: ['http://localhost:3000/'], 
          responseType: 'code',
        }
      }
    }
  }
});
// --- END OF AMPLIFY CONFIG ---


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();