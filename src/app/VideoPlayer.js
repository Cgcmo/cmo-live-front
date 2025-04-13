'use client';
import { useEffect, useRef, useState } from 'react';

export default function VideoPlayer({
  src,
  title,
  aspect = 'aspect-video',
  variant = 'small',
  onClick,
  autoPlay = false,
}) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  useEffect(() => {
    setIsPlaying(autoPlay); // reset play state when src changes
    if (variant === 'main' && autoPlay && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [src, autoPlay, variant]);

  const titleStyles =
    variant === 'main'
      ? 'absolute bottom-2 left-2 text-md sm:text-sm font-normal px-3 py-2'
      : 'absolute bottom-2 left-2 text-xs sm:text-sm font-bold px-2 py-1';

  return (
    <div
      className={`relative group rounded-2xl overflow-hidden shadow-lg w-full ${aspect} ${
        variant !== 'main' ? 'cursor-pointer' : ''
      }`}
      onClick={variant !== 'main' ? onClick : undefined}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-cover rounded-2xl"
        controls={variant === 'main'}
        muted={variant !== 'main'}
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => {
            if (variant === 'main' && videoRef.current) {
              videoRef.current.currentTime = 0;
              videoRef.current.play().catch(() => {});
            }
          }}
      >
        <source src={src} type="video/mp4" />
      </video>

      {/* Play Button Overlay for Small Thumbnails */}
      {variant !== 'main' && !isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 hover:bg-opacity-50 transition">
          <svg className="w-10 h-10 text-white" viewBox="0 0 68 48">
            <path
              d="M66.52 7.85a8.27 8.27 0 00-5.82-5.83C55.38 0 34 0 34 0S12.62 0 7.3 2.02a8.27 8.27 0 00-5.82 5.83A85.11 85.11 0 000 24a85.11 85.11 0 001.48 16.15 8.27 8.27 0 005.82 5.83C12.62 48 34 48 34 48s21.38 0 26.7-2.02a8.27 8.27 0 005.82-5.83A85.11 85.11 0 0068 24a85.11 85.11 0 00-1.48-16.15z"
              fill="#f00"
            />
            <path d="M45 24L27 14v20z" fill="#fff" />
          </svg>
        </div>
      )}

      {/* Title - Hidden when playing */}
      <div
         className={`z-10 text-white bg-black bg-opacity-40 rounded-md transition-opacity duration-200 pointer-events-none ${titleStyles}`}
        style={{ opacity: isPlaying ? 0 : 1 }}
      >
        {title}
      </div>
    </div>
  );
}
