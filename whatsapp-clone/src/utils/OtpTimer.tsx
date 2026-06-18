import React, { useState, useEffect, useRef } from 'react';

interface OtpTimerProps {
  /** The duration for the countdown timer in minutes */
  minutes: number;
  /** Callback action fired immediately when the user requests a new verification payload */
  onResendClick: () => void;
  /** Callback utility triggered instantly when the countdown drops to exactly zero */
  onTimerEnd?: () => boolean | void;
}

export const OtpTimer: React.FC<OtpTimerProps> = ({
  minutes,
  onResendClick,
  onTimerEnd
}) => {
  // Convert incoming minute criteria parameter straight into working tracking integer
  const initialSeconds = Math.max(0, Math.round(minutes * 60));
  
  const [secondsLeft, setSecondsLeft] = useState<number>(initialSeconds);
  const [isExpired, setIsExpired] = useState<boolean>(initialSeconds === 0);
  
  // Keep track of total time for the circular progress calculation
  const totalDurationRef = useRef<number>(initialSeconds);

  useEffect(() => {
    // If the timer is initialized with 0, terminate tracking immediately
    if (secondsLeft <= 0) {
      setIsExpired(true);
      if (onTimerEnd) onTimerEnd();
      return;
    }

    const timerInterval = setInterval(() => {
      setSecondsLeft((prevSeconds) => {
        if (prevSeconds <= 1) {
          clearInterval(timerInterval);
          setIsExpired(true);
          if (onTimerEnd) onTimerEnd();
          return 0;
        }
        return prevSeconds - 1;
      });
    }, 1000);

    // Dynamic garbage cleaning to eliminate concurrent memory leaks
    return () => clearInterval(timerInterval);
  }, [secondsLeft, onTimerEnd]);

  // Formatting utility converting mathematical integers to explicit MM:SS layout
  const formatTime = (totalSecs: number): string => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Reset function if user hits resend
  const handleResendAction = (): void => {
    const refreshedSeconds = Math.max(0, Math.round(minutes * 60));
    totalDurationRef.current = refreshedSeconds;
    setSecondsLeft(refreshedSeconds);
    setIsExpired(false);
    onResendClick();
  };

  // SVG Configuration calculations for the ring
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = totalDurationRef.current > 0 
    ? circumference - (secondsLeft / totalDurationRef.current) * circumference 
    : circumference;

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col items-center justify-center p-6 bg-transparent rounded-2xl shadow-xl transition-all duration-500 ease-in-out">
      
      {!isExpired ? (
        /* --- VISUAL TICKING COUNTER STATE --- */
        <div className="flex flex-col items-center space-y-4 animate-[fadeIn_0.4s_ease-out_forwards]">
          
          {/* Animated Progress Ring Structure Container */}
          <div className="relative flex items-center justify-center h-24 w-24">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
              {/* Background Circular Path Track */}
              <circle
                cx="40"
                cy="40"
                r={radius}
                className="stroke-slate-800 fill-none"
                strokeWidth="4"
              />
              {/* Animated Accent Time Drain Track */}
              <circle
                cx="40"
                cy="40"
                r={radius}
                className="stroke-cyan-500 fill-none transition-all duration-1000 ease-linear"
                strokeWidth="4"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            
            {/* Live Text Clock Rendering */}
            <span className="absolute text-xl font-mono font-bold tracking-tight text-white drop-shadow">
              {formatTime(secondsLeft)}
            </span>
          </div>

          <div className="text-center">
            <p className="text-sm font-semibold text-slate-200">Validating OTP Security Window</p>
            <p className="text-xs text-slate-400 mt-1">Please insert the verification code received on your phone.</p>
          </div>

        </div>
      ) : (
        /* --- TIMER EXPIRED ACTION STATE --- */
        <div className="w-full flex flex-col items-center space-y-4 animate-[scaleUp_0.3s_ease-out_forwards]">
          
          <div className="text-center space-y-1">
            <p className="text-sm font-semibold text-slate-300">Didn't receive your code?</p>
            <p className="text-xs text-rose-400/80">The initial entry passcode window has officially expired.</p>
          </div>

          <button
            onClick={handleResendAction}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm font-bold tracking-wide text-white bg-linear-to-r from-slate-600 to-cyan-600 hover:from-cyan-500 hover:to-cyan-500 border border-indigo-500/30 shadow-lg shadow-indigo-600/20 active:scale-95 hover:scale-[1.02] transition-all duration-200"
          >
            Resend OTP
          </button>

        </div>
      )}

    </div>
  );
};