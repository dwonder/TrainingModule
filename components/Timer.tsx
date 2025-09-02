
import React, { useState, useEffect, useRef } from 'react';

interface TimerProps {
    startTime: number;
    timeLimit: number; // in seconds
    onTimeUp: () => void;
}

const Timer: React.FC<TimerProps> = ({ startTime, timeLimit, onTimeUp }) => {
    const [remaining, setRemaining] = useState(timeLimit);
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        const updateRemainingTime = () => {
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            const timeLeft = timeLimit - elapsed;
            
            if (timeLeft <= 0) {
                setRemaining(0);
                if (intervalRef.current) clearInterval(intervalRef.current);
                onTimeUp();
            } else {
                setRemaining(timeLeft);
            }
        };

        updateRemainingTime(); // Initial call to set time immediately
        intervalRef.current = window.setInterval(updateRemainingTime, 1000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [startTime, timeLimit, onTimeUp]);

    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;

    const isUrgent = remaining <= 10;
    const textColorClass = isUrgent ? 'text-red-400' : 'text-slate-100';
    const progressColorClass = isUrgent ? 'stroke-red-500' : 'stroke-[#FFCC00]';

    const SIZE = 56;
    const STROKE_WIDTH = 4;
    const RADIUS = (SIZE - STROKE_WIDTH) / 2;
    const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

    const progress = (remaining / timeLimit);
    const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

    return (
        <div className="relative flex items-center justify-center" style={{ width: SIZE, height: SIZE }}>
            <svg className="absolute top-0 left-0" width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
                {/* Background Circle */}
                <circle
                    cx={SIZE / 2}
                    cy={SIZE / 2}
                    r={RADIUS}
                    strokeWidth={STROKE_WIDTH}
                    className="stroke-slate-700"
                    fill="transparent"
                />
                {/* Progress Circle */}
                <circle
                    cx={SIZE / 2}
                    cy={SIZE / 2}
                    r={RADIUS}
                    strokeWidth={STROKE_WIDTH}
                    className={`${progressColorClass} transition-all duration-300`}
                    fill="transparent"
                    strokeDasharray={CIRCUMFERENCE}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
                />
            </svg>
            <div className={`text-sm font-bold tabular-nums ${textColorClass} transition-colors`}>
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
        </div>
    );
};

export default Timer;
