'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { Volume2, VolumeX } from 'lucide-react';

export default function BackgroundAudio() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // If in admin dashboard, do not initialize or play music
    if (isAdmin) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      return;
    }

    // Create audio element if not yet created
    if (!audioRef.current) {
      const audio = new Audio('/ambient-music.mp3');
      audio.loop = true;
      audio.volume = 0.35; // Comfortable background ambient volume
      audioRef.current = audio;
    }

    const audio = audioRef.current;

    // Check user preference
    const savedAudioState = localStorage.getItem('1bc_audio_enabled');

    // Attempt to start audio immediately
    const attemptPlay = () => {
      // If user explicitly muted previously, don't auto-play
      if (localStorage.getItem('1bc_audio_enabled') === 'false') {
        setIsPlaying(false);
        return;
      }

      audio.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          // Modern browsers block autoplay until user interacts with the page
          setIsPlaying(false);
        });
    };

    attemptPlay();

    // Browser autoplay policy handler:
    // As soon as user clicks / taps / interacts with the site, start playback immediately
    const handleFirstUserGesture = () => {
      if (localStorage.getItem('1bc_audio_enabled') === 'false') return;

      if (audio && audio.paused) {
        audio.play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch(() => {});
      }
      cleanup();
    };

    const cleanup = () => {
      window.removeEventListener('click', handleFirstUserGesture);
      window.removeEventListener('touchstart', handleFirstUserGesture);
      window.removeEventListener('keydown', handleFirstUserGesture);
    };

    window.addEventListener('click', handleFirstUserGesture, { passive: true });
    window.addEventListener('touchstart', handleFirstUserGesture, { passive: true });
    window.addEventListener('keydown', handleFirstUserGesture, { passive: true });

    return () => {
      cleanup();
    };
  }, [isAdmin]);

  // When navigating to admin, instantly stop the audio
  useEffect(() => {
    if (isAdmin && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [isAdmin]);

  // Stop and clean up on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) {
      const audio = new Audio('/ambient-music.mp3');
      audio.loop = true;
      audio.volume = 0.35;
      audioRef.current = audio;
    }

    const audio = audioRef.current;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      localStorage.setItem('1bc_audio_enabled', 'false');
    } else {
      audio.play()
        .then(() => {
          setIsPlaying(true);
          localStorage.setItem('1bc_audio_enabled', 'true');
        })
        .catch(console.error);
    }
  };

  // Completely omit audio controller inside admin dashboard
  if (isAdmin) {
    return null;
  }

  return (
    <div className="fixed bottom-5 left-5 z-50">
      <button
        onClick={toggleAudio}
        type="button"
        title={isPlaying ? 'Mute background sound' : 'Play background sound'}
        aria-label={isPlaying ? 'Mute background sound' : 'Play background sound'}
        className="group relative flex items-center justify-center w-10 h-10 rounded-full bg-zinc-950/90 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-500 shadow-xl shadow-black/80 backdrop-blur-md transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer"
      >
        {isPlaying ? (
          <>
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
