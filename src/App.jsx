import React, { useState, useEffect } from 'react';
import Timer from './Timer';
import DownloadPopup from './DownloadPopup';
import './App.css';
import './DownloadPopup.css';

function App() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    
    const shouldShowPopup = typeof window !== 'undefined' && window.location.href.includes('vercel');

    if (shouldShowPopup) {
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 1000); 
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <main className="container">
      <Timer />
      {showPopup && <DownloadPopup onClose={() => setShowPopup(false)} />}
    </main>
  );
}

export default App;
