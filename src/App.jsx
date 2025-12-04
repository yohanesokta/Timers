import React, { useState, useEffect } from 'react';
import Timer from './Timer';
import DownloadPopup from './DownloadPopup';
import './App.css';
import './DownloadPopup.css';

function App() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Check if the app is running in a browser and not as a Tauri app
    const isRunningInBrowser = typeof window !== 'undefined' && !window.__TAURI__;

    if (isRunningInBrowser) {
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 1000); // Show popup after 1 second
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
