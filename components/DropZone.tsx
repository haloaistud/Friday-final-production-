
import React, { useCallback, useState } from 'react';

interface DropZoneProps {
  onFileAccepted: (file: File) => void;
  isProcessing?: boolean;
  children: React.ReactNode;
}

const DropZone: React.FC<DropZoneProps> = ({ onFileAccepted, isProcessing = false, children }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isProcessing) setIsDragging(true);
  }, [isProcessing]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (isProcessing) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      // Accept images and PDFs
      if (file.type.startsWith('image/') || file.type === 'application/pdf') {
        onFileAccepted(file);
      } else {
        alert("PROTOCOL MISMATCH: Only Visual Data (Images) or Document Feeds (PDF) accepted.");
      }
    }
  }, [onFileAccepted, isProcessing]);

  return (
    <div 
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="relative w-full h-full"
    >
      {children}
      
      {/* Dynamic Keyframes for advanced visuals */}
      <style>{`
        @keyframes customPulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.05); opacity: 0.8; }
        }
        @keyframes scan {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100%); }
        }
        @keyframes shimmerLine {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(300%); }
        }
        @keyframes bgShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
      `}</style>

      {/* Drag Overlay */}
      {isDragging && !isProcessing && (
        <div className="absolute inset-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-sm flex flex-col items-center justify-center border-2 border-dashed border-[#ffcc00] m-4 rounded-3xl animate-in fade-in duration-200 shadow-[0_0_50px_rgba(255,204,0,0.1)]">
           <div className="w-24 h-24 bg-[#ffcc00]/10 rounded-full flex items-center justify-center mb-6 animate-pulse border border-[#ffcc00]/30 shadow-[0_0_30px_rgba(255,204,0,0.2)]">
              <span className="text-4xl">📥</span>
           </div>
           <h3 className="text-2xl font-bold text-[#ffcc00] tracking-[0.2em] uppercase">Data Ingestion</h3>
           <p className="text-white/60 font-mono mt-2">Release to upload to Neural Buffer</p>
           
           <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-[#ffcc00]/50" style={{ animation: 'scan 2s linear infinite' }}></div>
           </div>
        </div>
      )}

      {/* Advanced Processing Overlay */}
      {isProcessing && (
        <div className="absolute inset-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-md flex flex-col items-center justify-center m-4 rounded-3xl animate-in fade-in zoom-in-[0.98] duration-300 border-2 border-[#00d4ff]/50 shadow-[0_0_60px_rgba(0,212,255,0.2)] overflow-hidden">
           
           {/* Subtle continuous background animation */}
           <div 
              className="absolute inset-0 opacity-30 pointer-events-none bg-gradient-to-tr from-[#00d4ff]/5 via-transparent to-[#00d4ff]/20 bg-[length:200%_200%]" 
              style={{ animation: 'bgShift 3s ease-in-out infinite' }}
           ></div>

           {/* Ambient Rotation Ray */}
           <div className="absolute top-0 left-0 w-full h-[150%] bg-gradient-to-b from-transparent via-[#00d4ff]/10 to-transparent animate-[spin_4s_linear_infinite_reverse] opacity-60 origin-bottom pointer-events-none"></div>
           
           {/* Scan Overlay */}
           <div className="absolute inset-0 bg-[linear-gradient(transparent_95%,rgba(0,212,255,0.1)_100%)] bg-[length:100%_4px] pointer-events-none" style={{ animation: 'scan 3s linear infinite' }}></div>

           {/* Complex Spinner */}
           <div className="relative w-36 h-36 flex items-center justify-center mb-8 z-10" style={{ animation: 'customPulse 2s infinite ease-in-out' }}>
              <div className="absolute inset-0 border-[6px] border-[#00d4ff]/10 rounded-full"></div>
              <div className="absolute inset-0 border-[6px] border-t-[#00d4ff] border-r-[#00d4ff]/50 border-b-transparent border-l-transparent rounded-full animate-[spin_1s_linear_infinite]"></div>
              <div className="absolute inset-4 border-[4px] border-b-[#00d4ff] border-l-[#00d4ff]/50 border-t-transparent border-r-transparent rounded-full animate-[spin_1.5s_linear_infinite_reverse]"></div>
              <div className="absolute inset-8 border border-[#00d4ff]/30 rounded-full border-dashed animate-[spin_4s_linear_infinite]"></div>
              <span className="text-4xl animate-pulse drop-shadow-[0_0_15px_#00d4ff]">⚙️</span>
           </div>
           
           <h3 className="text-2xl font-bold text-[#00d4ff] tracking-[0.3em] uppercase animate-pulse drop-shadow-[0_0_10px_#00d4ff] z-10">
              Analyzing Data
           </h3>
           
           <div className="flex items-center gap-2 mt-4 z-10">
               <div className="w-1.5 h-1.5 rounded-full bg-[#00d4ff] animate-ping"></div>
               <p className="text-[#00d4ff]/80 font-mono uppercase tracking-widest text-[10px]">Integrating into Memory Core</p>
               <div className="w-1.5 h-1.5 rounded-full bg-[#00d4ff] animate-ping" style={{ animationDelay: '0.2s' }}></div>
           </div>
           
           <div className="w-64 h-1.5 bg-[#00d4ff]/10 border border-[#00d4ff]/20 rounded-full mt-8 overflow-hidden z-10 relative">
              <div className="absolute top-0 left-0 h-full bg-[#00d4ff] w-1/4 rounded-full shadow-[0_0_10px_#00d4ff]" style={{ animation: 'shimmerLine 1.5s infinite linear' }}></div>
           </div>
        </div>
      )}
    </div>
  );
};

export default DropZone;
