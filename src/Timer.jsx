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


function Timer() {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(5);
  const initialTimeSet = useRef(false);

  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const animationFrameRef = useRef(null);
  const startTimeRef = useRef(0);
  const totalDurationRef = useRef(0);

  useEffect(() => {
    if (!initialTimeSet.current) {
        setTimeLeft((minutes * 60 + seconds) * 1000);
    }
  }, [minutes, seconds]);

  useEffect(() => {
    const handleFullscreenChange = () => {
        setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

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
    if (minutes === 0 && seconds === 0) return;

    const totalMilliseconds = (minutes * 60 + seconds) * 1000;
    totalDurationRef.current = totalMilliseconds;
    setTimeLeft(totalMilliseconds);
    setIsRunning(true);
    initialTimeSet.current = true;
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft((minutes * 60 + seconds) * 1000);
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
    const mins = padTime(Math.floor(t / (60 * 1000)));
    const secs = padTime(Math.floor((t % (60 * 1000)) / 1000));
    const millis = padTime(Math.floor((t % 1000) / 10));
    return { mins, secs, millis };
  };

  const { mins, secs, millis } = formatTime(timeLeft);
  const isDramatic = timeLeft < 180000 && timeLeft > 0;
  
  const renderControls = () => {
      if (isRunning) {
          return <button onClick={handleStop} className="control-button">Stop</button>;
      }
      
      const canStart = minutes > 0 || seconds > 0;
      const showReset = timeLeft > 0 || initialTimeSet.current;

      return (
          <>
            {canStart && <button onClick={handleStart} className="control-button">Start</button>}
            {showReset && <button onClick={handleReset} className="control-button">Reset</button>}
          </>
      );
  }

  return (
    <div className="timer-container">
      <button onClick={toggleFullscreen} className="fullscreen-button">
        {isFullscreen ? <FullscreenExitIcon /> : <FullscreenEnterIcon />}
      </button>

      <div className={`timer-display ${isDramatic ? 'dramatic' : ''}`}>
        <span className="time-part">{mins}</span>
        <span className="separator">:</span>
        <span className="time-part">{secs}</span>
        <span className="separator">:</span>
        <span className="time-part">{millis}</span>
      </div>

      {!isRunning && (
        <div className="input-group">
          <input
              type="number"
              value={padTime(minutes)}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setMinutes(Math.max(0, isNaN(val) ? 0 : val));
              }}
              min="0"
          />
          <span>:</span>
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
        </div>
      )}

      <div className="controls">
        {renderControls()}
      </div>
    </div>
  );
}

export default Timer;
