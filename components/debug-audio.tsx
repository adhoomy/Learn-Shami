'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function DebugAudio() {
  const [isPlaying, setIsPlaying] = useState(false);

  const testAudio = async () => {
    try {
      console.log('🎵 Testing audio playback...');
      
      const audio = new Audio('/audio/greet_0001.mp3');
      
      audio.addEventListener('loadstart', () => console.log('📥 Audio loading started'));
      audio.addEventListener('canplay', () => console.log('✅ Audio can play'));
      audio.addEventListener('play', () => {
        console.log('▶️ Audio started playing');
        setIsPlaying(true);
      });
      audio.addEventListener('ended', () => {
        console.log('⏹️ Audio ended');
        setIsPlaying(false);
      });
      audio.addEventListener('error', (e) => {
        console.error('❌ Audio error:', e);
        setIsPlaying(false);
      });
      
      console.log('🎯 Attempting to play audio...');
      await audio.play();
      
    } catch (error) {
      console.error('💥 Failed to play audio:', error);
    }
  };

  const stopAudio = () => {
    const audio = document.querySelector('audio');
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-800">
      <h3 className="text-lg font-semibold mb-4">Audio Debug</h3>
      <div className="space-y-2">
        <Button 
          onClick={testAudio} 
          disabled={isPlaying}
          className="w-full"
        >
          {isPlaying ? 'Playing...' : 'Test Audio (greet_0001.mp3)'}
        </Button>
        
        {isPlaying && (
          <Button 
            onClick={stopAudio} 
            variant="outline"
            className="w-full"
          >
            Stop Audio
          </Button>
        )}
        
        <div className="text-sm text-slate-600 dark:text-slate-400">
          <p>Check browser console (F12) for debug info</p>
          <p>Audio file: /audio/greet_0001.mp3</p>
        </div>
      </div>
    </div>
  );
}
