import React, { useState } from 'react';
import axios from 'axios';

interface ProgressiveReceiverImageProps {
  highResUrl: string; // The real cloud image URL (e.g. from Cloudinary/S3)
  placeholderUrl?: string; // Random image to show initially
}

type DownloadStatus = 'idle' | 'downloading' | 'completed';

export const ProgressiveReceiverImage: React.FC<ProgressiveReceiverImageProps> = ({
  highResUrl,
  placeholderUrl = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&q=40"
}) => {
  const [status, setStatus] = useState<DownloadStatus>('idle');
  const [progress, setProgress] = useState<number>(0);
  const [displaySrc, setDisplaySrc] = useState<string>(placeholderUrl);

  const startDownload = async () => {
    if (status !== 'idle') return;
    setStatus('downloading');
    setProgress(0);

    try {
      // Fetch the image data manually as a binary Blob
      const response = await axios.get(highResUrl, {
        responseType: 'blob', // Tells Axios to treat the data as raw file bytes
        onDownloadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            console.log(percentage)
            setProgress(percentage);
          }
        }
      });

      // Convert the downloaded raw binary Blob into a local browser URL string
      const downloadedBlob = response.data;
      const localImageObjectUrl = URL.createObjectURL(downloadedBlob);

      // Swap the random placeholder with our fully downloaded local file
      setDisplaySrc(localImageObjectUrl);
      setStatus('completed');

    } catch (error) {
      console.error("Image download failed:", error);
      alert("Could not download image.");
      setStatus('idle');
    }
  };

  return (
    <div className="relative w-75 h-75 overflow-hidden rounded-xl bg-[#1f2c34] shadow-md select-none">
      {/* The main image asset (Swaps from placeholder to high-res on complete) */}
      <img
        src={status==="completed"?highResUrl:""}
        alt="Chat attachment"
        className={`w-full h-full block object-cover transition-opacity duration-300 ${
          status !== 'completed' ? 'opacity-50' : 'opacity-100'
        }`}
      />

      {/* OVERLAY 1: Idle state (Click to download button) */}
      {status === 'idle' && (
        <div 
          onClick={startDownload}
          className="absolute top-10 w inset-0 bg-black/40 flex flex-col items-center justify-center text-white text-sm font-medium cursor-pointer transition-colors duration-200 hover:bg-black/50"
        >
          <div className="bg-black/70 border-2 border-white w-11 h-11 rounded-full flex items-center justify-center text-xl font-bold mb-2 transition-transform duration-200 transform hover:scale-105">
            ↓
          </div>
          <span>Download Media</span>
        </div>
      )}

      {/* OVERLAY 2: Downloading state (Live progress percentage ring & text) */}
      {status === 'downloading' && (
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white cursor-default">
          
          {/* Animated custom SVG loading progress ring */}
          <div className="relative flex items-center justify-center w-14 h-14">
            {/* Spinning background accent track */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="28"
                cy="28"
                r="24"
                className="stroke-white/20 fill-none"
                strokeWidth="3"
              />
              <circle
                cx="28"
                cy="28"
                r="24"
                className="stroke-[#00a884] fill-none transition-all duration-100" // WhatsApp green line
                strokeWidth="3"
                strokeDasharray={`${2 * Math.PI * 24}`}
                strokeDashoffset={`${2 * Math.PI * 24 * (1 - progress / 100)}`}
              />
            </svg>
            
            {/* Centered Percentage text inside the loader ring */}
            <span className="absolute text-xs font-bold">{progress}%</span>
          </div>
          
          <span className="text-xs font-semibold tracking-wide text-gray-300 mt-2">
            Downloading...
          </span>
        </div>
      )}
    </div>
  );
};