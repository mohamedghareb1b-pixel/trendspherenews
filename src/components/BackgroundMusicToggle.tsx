"use client";

import { useRef, useState } from "react";

interface BackgroundMusicToggleProps {
  musicUrl?: string;
}

export function BackgroundMusicToggle({ musicUrl }: BackgroundMusicToggleProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  if (!musicUrl) return null;

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      audio.volume = 0.3;
      audio.play().catch(() => {});
    }
    setPlaying(!playing);
  };

  return (
    <>
      <audio ref={audioRef} src={musicUrl} loop preload="none" />
      <button
        onClick={toggle}
        className={`not-prose mb-4 ml-2 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
          playing
            ? "border-brand-300 bg-brand-50 text-brand-700"
            : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
        }`}
        title="Relaxing background music"
      >
        <span>{playing ? "🔊" : "🎵"}</span>
        {playing ? "Music: On" : "Play music"}
      </button>
    </>
  );
}