import { useState, useEffect } from 'react';
import Gallery from './components/Gallery';
import PasswordProtection from './components/PasswordProtection';

const AUTH_STORAGE_KEY = 'karen-maurizio-wedding-auth';
const AUTH_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing authentication on app load
  useEffect(() => {
    const checkExistingAuth = () => {
      try {
        const authData = localStorage.getItem(AUTH_STORAGE_KEY);
        if (authData) {
          const { timestamp } = JSON.parse(authData);
          const now = Date.now();
          
          // Check if authentication is still valid (within 24 hours)
          if (now - timestamp < AUTH_DURATION) {
            setIsAuthenticated(true);
          } else {
            // Authentication expired, remove it
            localStorage.removeItem(AUTH_STORAGE_KEY);
          }
        }
      } catch (error) {
        // If there's any error parsing the auth data, remove it
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
      setIsLoading(false);
    };

    checkExistingAuth();
  }, []);

  const handlePasswordCorrect = () => {
    const authData = {
      timestamp: Date.now(),
      authenticated: true
    };
    
    // Save authentication to localStorage
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
    setIsAuthenticated(true);
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="App" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#0e2017',
        color: '#d4d4c8',
        fontFamily: 'Georgia, serif'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div className="App">
      {isAuthenticated ? (
        <Gallery />
      ) : (
        <PasswordProtection onPasswordCorrect={handlePasswordCorrect} />
      )}
    </div>
  );
}

export default App;
