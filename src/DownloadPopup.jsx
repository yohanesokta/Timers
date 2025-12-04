import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './DownloadPopup.css';

const DownloadPopup = ({ onClose }) => {
  const [releaseContent, setReleaseContent] = useState('');
  const isVercel = import.meta.env.VERCEL_ENV; 

  useEffect(() => {
    fetch('/ContohRelease.md')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then(text => setReleaseContent(text))
      .catch(error => {
        console.error("Could not fetch release content:", error);
        setReleaseContent("Failed to load release information.");
      });
  }, []);

  const handleOverlayClick = (event) => {
    if (event.target.classList.contains('download-popup-overlay')) {
      onClose();
    }
  };

  return ReactDOM.createPortal(
    <div className="download-popup-overlay" onClick={handleOverlayClick}>
      <div className="download-popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="download-popup-close" onClick={onClose}>&times;</button>
        <h2>Download Free!</h2>
        <div className="download-button-container top-button-container">
          <a href="https://github.com/yohanesokta/Timers/releases" target="_blank" rel="noopener noreferrer" className="download-button">
            Download Now
          </a>
        </div>
        <div className="release-features">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{releaseContent}</ReactMarkdown>
        </div>
        <p className="download-cta">
          {isVercel ? "Enjoy our application hosted on Vercel!" : "Enjoy our application with all these amazing features!"}
        </p>
        <div className="download-button-container">
          <a href="https://github.com/yohanesokta/Timers/releases" target="_blank" rel="noopener noreferrer" className="download-button">
            Download Now
          </a>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default DownloadPopup;
