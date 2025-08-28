'use client';

import { Button } from '@/components/ui/button';
import { useAudio } from '@/lib/useAudio';
import { Play, Square } from 'lucide-react';

interface AudioPlayerProps {
  audioUrl: string;
  size?: 'sm' | 'md';
  className?: string;
}

export function AudioPlayer({ audioUrl, size = 'sm', className = '' }: AudioPlayerProps) {
  const { isPlaying, currentAudio, play, stop } = useAudio();
  
  const isCurrentAudio = currentAudio === audioUrl;
  const isCurrentlyPlaying = isPlaying && isCurrentAudio;

  const handleClick = () => {
    if (isCurrentlyPlaying) {
      stop();
    } else {
      play(audioUrl);
    }
  };

  const buttonSize = size === 'sm' ? 'h-8 w-8' : 'h-10 w-10';
  const iconSize = size === 'sm' ? 16 : 20;

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClick}
      className={`${buttonSize} p-0 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 ${className}`}
      aria-label={isCurrentlyPlaying ? 'Stop audio' : 'Play audio'}
    >
      {isCurrentlyPlaying ? (
        <Square size={iconSize} className="text-slate-700 dark:text-slate-300" />
      ) : (
        <Play size={iconSize} className="text-slate-700 dark:text-slate-300 ml-0.5" />
      )}
    </Button>
  );
}
