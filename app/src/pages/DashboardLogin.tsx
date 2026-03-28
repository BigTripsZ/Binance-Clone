import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function DashboardLogin() {
  const navigate = useNavigate();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isScanning, setIsScanning] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Default admin access code
  const DEFAULT_CODE = 'COD410';

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  function checkComplete(newCode: string[]) {
    const fullCode = newCode.join('');
    const complete = fullCode.length === 6;
    setIsComplete(complete);
    return complete ? fullCode : null;
  }

  function handleInput(index: number, value: string) {
    if (!/^[a-zA-Z0-9]*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.toUpperCase();
    setCode(newCode);
    setError('');

    if (value) {
      if (index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }

    checkComplete(newCode);
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/[^a-zA-Z0-9]/g, '').slice(0, 6).toUpperCase();
    
    const newCode = [...code];
    pasteData.split('').forEach((char, i) => {
      if (inputRefs.current[i]) {
        newCode[i] = char;
      }
    });
    setCode(newCode);
    setError('');

    if (inputRefs.current[pasteData.length]) {
      inputRefs.current[pasteData.length]?.focus();
    } else if (pasteData.length === 6) {
      checkComplete(newCode);
    }
  }

  function handleFingerprintClick() {
    if (isScanning || isSuccess) return;
    
    const fullCode = code.join('');
    if (fullCode.length !== 6) {
      setError('Please enter complete code');
      inputRefs.current[0]?.focus();
      return;
    }

    setIsScanning(true);
    setError('');

    setTimeout(() => {
      if (fullCode === DEFAULT_CODE) {
        setIsScanning(false);
        setIsSuccess(true);
        
        setTimeout(() => {
          navigate('/dashboard');
        }, 800);
      } else {
        setIsScanning(false);
        setError('Invalid access code');
        setCode(['', '', '', '', '', '']);
        setIsComplete(false);
        inputRefs.current[0]?.focus();
      }
    }, 2500);
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ 
        background: 'linear-gradient(180deg, #0f172a 0%, #1e1b0f 50%, #0f172a 100%)',
        fontFamily: "'Inter', sans-serif"
      }}
    >
      {/* Background Grid */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(234, 179, 8, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(234, 179, 8, 0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      {/* Glow Effect */}
      <div 
        className="fixed pointer-events-none"
        style={{
          width: '100vw',
          height: '100vw',
          maxWidth: '500px',
          maxHeight: '500px',
          background: 'radial-gradient(circle, rgba(234, 179, 8, 0.12) 0%, transparent 70%)',
          borderRadius: '50%',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          animation: 'pulse-glow 4s ease-in-out infinite'
        }}
      />

      <style>{`
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.1); }
        }
        @keyframes scan-up-down {
          0% { top: 15%; opacity: 0; }
          10% { opacity: 1; }
          50% { top: 85%; }
          90% { opacity: 1; }
          100% { top: 15%; opacity: 0; }
        }
        @keyframes pulse-text {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        @keyframes draw-check {
          to { stroke-dashoffset: 0; }
        }
      `}</style>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-[380px] px-4">
        <div 
          className="w-full rounded-[20px] p-8"
          style={{
            background: 'rgba(30, 41, 59, 0.7)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(234, 179, 8, 0.15)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(234, 179, 8, 0.05) inset'
          }}
        >
          {/* Logo Section */}
          <div className="text-center mb-7">
            <div 
              className="w-14 h-14 rounded-[14px] flex items-center justify-center mx-auto mb-3"
              style={{
                background: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)',
                boxShadow: '0 8px 30px -8px rgba(234, 179, 8, 0.4)'
              }}
            >
              <svg className="w-7 h-7 text-[#0f172a]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-[#fef08a] text-xl font-bold tracking-tight">Admin Access</h1>
            <p className="text-[#a1a1aa] text-sm mt-1">Secure Entry Portal</p>
          </div>

          {/* Error Message */}
          {error && (
            <div 
              className="flex items-center justify-center gap-2 text-[#fca5a5] text-sm py-3 px-4 rounded-[10px] mb-4"
              style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Code Inputs */}
          <div className="mb-6">
            <label className="block text-[#eab308] text-xs font-semibold uppercase tracking-wider text-center mb-3">
              Enter Access Code
            </label>
            <div className="flex gap-1.5 justify-center">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInput(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className={`w-11 h-14 text-center text-lg font-semibold uppercase rounded-[10px] transition-all outline-none
                    ${digit 
                      ? 'border-[#eab308] bg-[rgba(234,179,8,0.1)] text-[#fefce8]' 
                      : 'border-[rgba(234,179,8,0.2)] bg-[rgba(15,23,42,0.8)] text-[#fef08a]'
                    }`}
                  style={{
                    border: `1px solid ${digit ? '#eab308' : 'rgba(234, 179, 8, 0.2)'}`,
                    caretColor: '#eab308'
                  }}
                  autoComplete="off"
                  autoCapitalize="off"
                />
              ))}
            </div>
          </div>

          {/* Fingerprint Section */}
          <div className="flex flex-col items-center mt-2">
            <span className="text-[#a1a1aa] text-xs uppercase tracking-wider mb-4">Tap to Authenticate</span>
            <button
              onClick={handleFingerprintClick}
              disabled={!isComplete}
              className={`relative w-[88px] h-[88px] rounded-full flex items-center justify-center transition-all overflow-hidden
                ${isComplete && !isScanning && !isSuccess ? 'border-[#eab308] shadow-[0_0_30px_rgba(234,179,8,0.3)]' : ''}
                ${isScanning ? 'border-[#ef4444] shadow-[0_0_30px_rgba(239,68,68,0.4)]' : ''}
                ${isSuccess ? 'border-[#eab308] shadow-[0_0_40px_rgba(234,179,8,0.5)]' : ''}
                ${!isComplete ? 'border-[rgba(234,179,8,0.3)]' : ''}
              `}
              style={{
                background: 'rgba(15, 23, 42, 0.9)',
                border: `2px solid ${isScanning ? '#ef4444' : isSuccess ? '#eab308' : isComplete ? '#eab308' : 'rgba(234, 179, 8, 0.3)'}`,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
              }}
            >
              {/* Fingerprint Icon */}
              <svg 
                className={`w-11 h-11 transition-all ${isComplete ? 'opacity-100' : 'opacity-70'}`}
                style={{
                  fill: isScanning ? '#ef4444' : '#eab308',
                  filter: isComplete && !isScanning ? 'drop-shadow(0 0 8px rgba(234, 179, 8, 0.5))' : 'none',
                  animation: isScanning ? 'pulse-icon 0.5s ease-in-out infinite' : 'none'
                }}
                viewBox="0 0 512 512"
              >
                <path d="M190.313,494.345c-2.116,0-4.242-0.759-5.935-2.293c-3.608-3.285-3.871-8.862-0.59-12.474 l35.474-39.026c32.569-35.819,50.505-82.216,50.505-130.63v-36.267c0-4.871-3.961-8.828-8.828-8.828s-8.828,3.957-8.828,8.828 v32.742c0,43.69-16.095,85.638-45.323,118.103l-36.392,40.439c-3.258,3.62-8.845,3.914-12.466,0.655 c-3.625-3.258-3.918-8.845-0.655-12.466l36.392-40.439c26.302-29.224,40.789-66.966,40.789-106.293v-32.742 c0-14.603,11.88-26.483,26.483-26.483s26.483,11.88,26.483,26.483v36.267c0,52.819-19.569,103.431-55.1,142.508l-35.474,39.026 C195.106,493.37,192.715,494.345,190.313,494.345z"/>
                <path d="M221.986,512c-2.116,0-4.242-0.759-5.935-2.293c-3.608-3.285-3.871-8.862-0.59-12.474l29.931-32.922 c38.487-42.345,59.686-97.173,59.686-154.388v-36.267c0-24.337-19.801-44.138-44.138-44.138s-44.138,19.801-44.138,44.138v32.742 c0,34.948-12.875,68.5-36.258,94.483l-25.87,28.75c-3.254,3.629-8.845,3.914-12.466,0.655c-3.625-3.258-3.918-8.845-0.655-12.466 l25.87-28.75c20.457-22.733,31.724-52.095,31.724-82.673v-32.742c0-34.069,27.72-61.793,61.793-61.793s61.793,27.724,61.793,61.793 v36.267c0,61.612-22.828,120.664-64.276,166.268l-29.935,32.922C226.779,511.026,224.387,512,221.986,512z"/>
              </svg>

              {/* Scan Line */}
              {isScanning && (
                <div 
                  className="absolute w-[80%] h-0.5 left-[10%]"
                  style={{
                    background: 'linear-gradient(90deg, transparent, #ef4444, transparent)',
                    boxShadow: '0 0 8px #ef4444, 0 0 16px #ef4444',
                    animation: 'scan-up-down 1.2s ease-in-out infinite'
                  }}
                />
              )}

              {/* Checkmark */}
              {isSuccess && (
                <svg 
                  className="absolute w-9 h-9"
                  viewBox="0 0 24 24"
                  style={{ animation: 'draw-check 0.5s ease forwards 0.15s' }}
                >
                  <path 
                    d="M4 12L9 17L20 6" 
                    stroke="#eab308" 
                    strokeWidth="3" 
                    fill="none" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    strokeDasharray="48"
                    strokeDashoffset="0"
                  />
                </svg>
              )}

              {/* Scan Text */}
              {isScanning && (
                <span 
                  className="absolute -bottom-7 text-xs font-semibold tracking-wider uppercase"
                  style={{ color: '#ef4444', animation: 'pulse-text 0.8s ease-in-out infinite' }}
                >
                  Scanning
                </span>
              )}
            </button>
          </div>

          {/* Hint Text */}
          <p className="text-center text-[#52525b] text-xs mt-8 leading-relaxed">
            Enter 6-character code<br />then tap fingerprint to authenticate
          </p>
        </div>
      </div>
    </div>
  );
}
