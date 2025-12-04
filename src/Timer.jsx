import React, { useState, useEffect, useRef } from 'react';
import './Timer.css';

const padTime = (time) => time.toString().padStart(2, '0');

const audioContext = new (window.AudioContext || window.webkitAudioContext)();

const FullscreenEnterIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
    </svg>
);

const FullscreenExitIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 8V5a2 2 0 0 1 2-2h3m11 0h-3a2 2 0 0 1-2 2v3m0 11v-3a2 2 0 0 1 2-2h3M8 19H5a2 2 0 0 1-2-2v-3"/>
    </svg>
);

const SunIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>
);

const MoonIcon = () => (
     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
);


const GithubIcon = () => (
    <svg height="24" viewBox="0 0 16 16" version="1.1" width="24" aria-hidden="true">
        <path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
    </svg>
);


function Timer() {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(5);
  const initialTimeSet = useRef(false);

  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [theme, setTheme] = useState('dark');
  
  // State for progress bar
  const [progress, setProgress] = useState(100);
  const [progressBarColor, setProgressBarColor] = useState('#4caf50');

  const animationFrameRef = useRef(null);
  const startTimeRef = useRef(0);
  const totalDurationRef = useRef(0);

  // Effect to update time left when inputs change
  useEffect(() => {
    if (!isRunning) {
        const newTime = (hours * 3600 + minutes * 60 + seconds) * 1000;
        setTimeLeft(newTime);
        if (!initialTimeSet.current) {
            totalDurationRef.current = newTime;
        }
    }
  }, [hours, minutes, seconds]);

  // Effect to handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
        setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Effect to run the timer loop
  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = performance.now() - (totalDurationRef.current - timeLeft);
      animationFrameRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRunning]);

  // Effect to update progress bar WHEN timeLeft changes
  useEffect(() => {
    const getProgressBarColor = (percentage) => {
        if (percentage > 50) return '#4caf50'; // Green
        if (percentage > 20) return '#ffeb3b'; // Yellow
        return '#f44336'; // Red
    };

    if (totalDurationRef.current > 0) {
        const newProgress = (timeLeft / totalDurationRef.current) * 100;
        setProgress(newProgress);
        setProgressBarColor(getProgressBarColor(newProgress));
    } else {
        setProgress(100);
        setProgressBarColor('#4caf50');
    }
  }, [timeLeft]);


  const animate = (now) => {
    const elapsedTime = now - startTimeRef.current;
    const remaining = totalDurationRef.current - elapsedTime;

    if (remaining <= 0) {
      setTimeLeft(0);
      setIsRunning(false);
      playSound();
      return;
    }

    setTimeLeft(remaining);
    animationFrameRef.current = requestAnimationFrame(animate);
  };

  const handleStart = () => {
    if (hours === 0 && minutes === 0 && seconds === 0) return;

    const totalMilliseconds = (hours * 3600 + minutes * 60 + seconds) * 1000;
    totalDurationRef.current = totalMilliseconds;
    // Set timeLeft here to ensure it's correct right at the start
    setTimeLeft(totalMilliseconds); 
    setIsRunning(true);
    initialTimeSet.current = true;
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    const newTime = (hours * 3600 + minutes * 60 + seconds) * 1000;
    setTimeLeft(newTime);
    totalDurationRef.current = newTime;
    initialTimeSet.current = false;
  };
  
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
  };

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  const playSound = () => {
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 1);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const formatTime = (time) => {
    const t = time < 0 ? 0 : time;
    const hrs = padTime(Math.floor(t / (3600 * 1000)));
    const mins = padTime(Math.floor((t % (3600 * 1000)) / (60 * 1000)));
    const secs = padTime(Math.floor((t % (60 * 1000)) / 1000));
    const millis = padTime(Math.floor((t % 1000) / 10));
    return { hrs, mins, secs, millis };
  };

  const { hrs, mins, secs, millis } = formatTime(timeLeft);
  // Dramatic effect now considers hours as well
  const isDramatic = timeLeft < 180000 && timeLeft > 0;
  
  const renderControls = () => {
      if (isRunning) {
          return <button onClick={handleStop} className="control-button">Stop</button>;
      }
      
      const canStart = hours > 0 || minutes > 0 || seconds > 0;
      const showReset = timeLeft > 0 || initialTimeSet.current;

      return (
          <>
            {canStart && <button onClick={handleStart} className="control-button">Start</button>}
            {showReset && <button onClick={handleReset} className="control-button">Reset</button>}
          </>
      );
  }

  return (
    <div className={`timer-container theme-${theme}`}>
      <div className="top-controls">
        <button onClick={toggleTheme} className="theme-button">
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>
        <button onClick={toggleFullscreen} className="fullscreen-button">
            {isFullscreen ? <FullscreenExitIcon /> : <FullscreenEnterIcon />}
        </button>
      </div>

      <div className={`timer-display ${isDramatic ? 'dramatic' : ''}`} data-testid="timer-display">
        {parseInt(hrs) > 0 && ( // Conditionally render hours
            <>
                <span className="time-part" data-testid="hours">{hrs}</span>
                <span className="separator">:</span>
            </>
        )}
        <span className="time-part" data-testid="minutes">{mins}</span>
        <span className="separator">:</span>
        <span className="time-part" data-testid="seconds">{secs}</span>
        <span className="separator">:</span>
        <span className="time-part" data-testid="milliseconds">{millis}</span>
      </div>

      <div className="progress-bar-container">
        <div 
          className="progress-bar-indicator" 
          style={{ 
            transform: `scaleX(${progress / 100})`,
            backgroundColor: progressBarColor
          }}
        ></div>
      </div>

      {!isRunning && (
        <div className="input-group">
          <div className="input-field-group">
            <input
                type="number"
                value={padTime(hours)}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setHours(Math.max(0, isNaN(val) ? 0 : val));
                }}
                min="0"
                data-testid="hours-input"
            />
            <span className="input-label-unit">Jam</span>
          </div>
          <span className="separator-input">:</span>
          <div className="input-field-group">
            <input
                type="number"
                value={padTime(minutes)}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setMinutes(Math.max(0, Math.min(59, isNaN(val) ? 0 : val)));
                }}
                min="0"
                max="59"
            />
            <span className="input-label-unit">Menit</span>
          </div>
          <span className="separator-input">:</span>
          <div className="input-field-group">
            <input
                type="number"
                value={padTime(seconds)}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setSeconds(Math.max(0, Math.min(59, isNaN(val) ? 0 : val)));
                }}
                min="0"
                max="59"
            />
            <span className="input-label-unit">Detik</span>
          </div>
        </div>
      )}

      <div className="controls">
        {renderControls()}
      </div>

      <a href="https://github.com/yohanesokta" target="_blank" rel="noopener noreferrer" className="watermark">
        <GithubIcon />
        <span>github.com/yohanesokta</span>
      </a>
    </div>
  );
}



export default Timer;
