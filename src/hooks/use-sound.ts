"use client";

import { useRef, useCallback, useState, useEffect } from "react";

interface UseSoundReturn {
  play: () => void;
  stop: () => void;
  isPlaying: boolean;
}

export function useSound(url?: string): UseSoundReturn {
  const [isPlaying, setIsPlaying] = useState(false);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const play = useCallback(() => {
    if (url) {
      console.log("sound would play:", url);
      setIsPlaying(true);
      return;
    }

    console.log("sound would play");
    setIsPlaying(true);

    try {
      audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(440, audioContextRef.current.currentTime);
      gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 1);

      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      oscillator.start();
      oscillator.stop(audioContextRef.current.currentTime + 1);

      oscillatorRef.current = oscillator;

      oscillator.onended = () => {
        setIsPlaying(false);
        oscillatorRef.current = null;
      };
    } catch {
      setIsPlaying(false);
    }
  }, [url]);

  const stop = useCallback(() => {
    try {
      oscillatorRef.current?.stop();
    } catch {
      // already stopped
    }
    audioContextRef.current?.close();
    oscillatorRef.current = null;
    audioContextRef.current = null;
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return { play, stop, isPlaying };
}
