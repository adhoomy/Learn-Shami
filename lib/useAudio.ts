import { useState, useRef, useCallback } from 'react';

interface UseAudioReturn {
  isPlaying: boolean;
  currentAudio: string | null;
  play: (audioUrl: string) => void;
  stop: () => void;
}

export function useAudio(): UseAudioReturn {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const play = useCallback((audioUrl: string) => {
    // Stop any currently playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // Create new audio element with proper path
    // If audioUrl already starts with /audio/, use it as is, otherwise add /audio/ prefix
    const fullAudioUrl = audioUrl.startsWith('/audio/') ? audioUrl : `/audio/${audioUrl}`;
    const audio = new Audio(fullAudioUrl);
    audioRef.current = audio;
    
    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      setCurrentAudio(null);
    });

    audio.addEventListener('error', (e) => {
      console.error('Audio playback error:', e, 'URL:', audioUrl);
      setIsPlaying(false);
      setCurrentAudio(null);
    });

    audio.play().then(() => {
      setIsPlaying(true);
      setCurrentAudio(audioUrl);
    }).catch((error) => {
      console.error('Failed to play audio:', error, 'URL:', audioUrl);
      setIsPlaying(false);
      setCurrentAudio(null);
    });
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentAudio(null);
  }, []);

  return { isPlaying, currentAudio, play, stop };
}
