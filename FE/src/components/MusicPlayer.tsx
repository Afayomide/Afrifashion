"use client";
import { useState, useRef } from "react";
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa6";

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="sound">
      <audio ref={audioRef} src="/afrosounds.mp3" />
      <div className="playmusic" onClick={togglePlayPause}>
        {isPlaying ? (
          <FaPause className="playmusic" />
        ) : (
          <FaPlay className="playmusic" />
        )}
      </div>
    </div>
  );
}
