
import React, { useState, useEffect } from 'react';

interface Props {
  onComplete: (level: number) => void;
}

const CoolingOff: React.FC<Props> = ({ onComplete }) => {
  const [level, setLevel] = useState<number>(0);
  const [isBreathing, setIsBreathing] = useState(false);
  const [timer, setTimer] = useState(10); // Shortened for demo (actually 10 min)

  useEffect(() => {
    let interval: any;
    if (isBreathing && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    } else if (timer === 0) {
      onComplete(0); // Reset after break
    }
    return () => clearInterval(interval);
  }, [isBreathing, timer]);

  if (isBreathing) {
    return (
      <div className="flex flex-col items-center justify-center text-center space-y-6 h-full">
        <div className="w-32 h-32 rounded-full border-4 border-indigo-100 flex items-center justify-center animate-pulse">
          <span className="text-3xl font-bold text-indigo-600">{timer}s</span>
        </div>
        <h2 className="text-2xl font-bold">Taking a Breath</h2>
        <p className="text-slate-500 max-w-xs">
          Let's pause. A cool head leads to better results. Focus on your breathing until the timer reaches zero.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-slate-800">Check-in</h2>
        <p className="text-slate-500">Before we begin, how are you feeling in this moment?</p>
      </div>

      <div className="space-y-6">
        <label className="block text-sm font-medium text-slate-700">
          On a scale of 1–10, how frustrated are you?
        </label>
        
        <div className="flex justify-between items-center gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(val => (
            <button
              key={val}
              onClick={() => setLevel(val)}
              className={`w-10 h-10 rounded-full font-bold transition-all ${
                level === val 
                  ? 'bg-indigo-600 text-white scale-110 shadow-lg' 
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              {val}
            </button>
          ))}
        </div>

        <div className="pt-4 flex justify-center">
          <button
            disabled={level === 0}
            onClick={() => {
              if (level >= 8) {
                setIsBreathing(true);
              } else {
                onComplete(level);
              }
            }}
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 disabled:opacity-50 transition-all"
          >
            {level >= 8 ? 'Take a Breathing Break' : 'Start Independent Entry'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoolingOff;
