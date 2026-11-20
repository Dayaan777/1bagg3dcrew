'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function BackgroundAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element
    const audio = new Audio('/ambient-music.mp3');
    audio.loop = true;
    audio.volume = 0.35; // Comfortable background ambient volume
    audioRef.current = audio;

    // Check user preference if saved
    const savedMuted = localStorage.getItem('1bc_audio_muted');
    if (savedMuted === 'true') {
      setIsPlaying(false);
      return;
    }

    // Try autoplay immediately
    const startAudio = () => {
      if (!audioRef.current) return;
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setHasInteracted(true);
          cleanupListeners();
        })
        .catch(() => {
          // Browser prevented autoplay before user interaction
          setIsPlaying(false);
        });
    };

    startAudio();

    // Attach listeners for first user click / touch anywhere on the page
    const handleFirstInteraction = () => {
      const currentSavedMuted = localStorage.getItem('1bc_audio_muted');
      if (currentSavedMuted !== 'true' && audioRef.current && audioRef.current.paused) {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            setHasInteracted(true);
          })
          .catch(() => {});
      }
      cleanupListeners();
    };

    const cleanupListeners = () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction, { passive: true });
    window.addEventListener('keydown', handleFirstInteraction, { passive: true });
    window.addEventListener('touchstart', handleFirstInteraction, { passive: true });

    return () => {
      cleanupListeners();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      localStorage.setItem('1bc_audio_muted', 'true');
    } else {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          localStorage.setItem('1bc_audio_muted', 'false');
        })
        .catch(console.error);
    }
  };

  return (
    <div className="fixed bottom-5 left-5 z-50">
      <button
        onClick={toggleAudio}
        type="button"
        title={isPlaying ? 'Mute background sound' : 'Unmute background sound'}
        aria-label={isPlaying ? 'Mute background sound' : 'Unmute background sound'}
        className="group relative flex items-center justify-center w-10 h-10 rounded-full bg-zinc-950/90 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-500 shadow-xl shadow-black/80 backdrop-blur-md transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer"
      >
        {isPlaying ? (
          <>
            {/* Subtle pulsing sound ring */}
            <span className="absolute -inset-0.5 rounded-full bg-white/10 animate-ping pointer-events-none opacity-40" />
            <Volume2 className="w-4 h-4 text-white group-hover:text-amber-400 transition-colors" />
          </>
        ) : (
          <VolumeX className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
        )}
      </button>
    </div>
  );
}
