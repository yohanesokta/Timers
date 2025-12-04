import React, { useState, useEffect, useRef } from 'react';
import './Timer.css';

const padTime = (time) => time.toString().padStart(2, '0');

// Create an audio context to be reused
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function Timer() {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(5);

  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    let animationFrameId;
    if (isRunning && timeLeft > 0) {
      let lastTime = performance.now();
      const animate = (now) => {
        const deltaTime = now - lastTime;
        if (deltaTime >= 10) { // Update roughly every 10ms
          setTimeLeft(prev => prev - deltaTime);
          lastTime = now;
        }
        if (timeLeft > 10) {
            animationFrameId = requestAnimationFrame(animate);
        } else {
            // Final countdown with higher precision
            setTimeLeft(0);
        }
      };
      animationFrameId = requestAnimationFrame(animate);
    } else if (timeLeft <= 0 && isRunning) {
      setIsRunning(false);
      setTimeLeft(0);
      playSound();
    }
    return () => cancelAnimationFrame(animationFrameId);
  }, [isRunning, timeLeft]);


  const handleStart = () => {
    // Set initial time when starting
    const totalMilliseconds = (minutes * 60 + seconds) * 1000;
    setTimeLeft(totalMilliseconds);
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    // Reset display to the initial set time, not 0
    const totalMilliseconds = (minutes * 60 + seconds) * 1000;
    setTimeLeft(totalMilliseconds);
  };

  const playSound = () => {
    // Simple beep sound using Web Audio API
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, audioContext.currentTime); // A5 note
    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 1);


    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const formatTime = (time) => {
    if (time < 0) time = 0;
    const mins = padTime(Math.floor(time / (60 * 1000)));
    const secs = padTime(Math.floor((time % (60 * 1000)) / 1000));
    const millis = padTime(Math.floor((time % 1000) / 10));
    return `${mins}:${secs}:${millis}`;
  };

  const isDramatic = timeLeft < 3000 && timeLeft > 0;

  return (
    <div className="timer-container">
      <div className={`timer-display ${isDramatic ? 'dramatic' : ''}`}>
        {formatTime(timeLeft)}
      </div>
      <div className="input-group">
        <input
            type="number"
            value={padTime(minutes)}
            onChange={(e) => setMinutes(Math.max(0, parseInt(e.target.value, 10)))}
            disabled={isRunning}
            min="0"
        />
        <span>:</span>
        <input
            type="number"
            value={padTime(seconds)}
            onChange={(e) => setSeconds(Math.max(0, Math.min(59, parseInt(e.target.value, 10))))}
            disabled={isRunning}
            min="0"
            max="59"
        />
      </div>
      <div className="controls">
        {!isRunning ? (
          <button onClick={handleStart} disabled={(minutes === 0 && seconds === 0) || isRunning}>Start</button>
        ) : (
          <button onClick={handleStop}>Stop</button>
        )}
        {!isRunning && <button onClick={handleReset}>Reset</button>}
      </div>
    </div>
  );
}

export default Timer;
