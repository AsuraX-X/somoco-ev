"use client";

import { useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

const Hero = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <section
      className="w-screen aspect-video sticky top-[54px] sm-top-[74px] -z-1 flex justify-center h-screen overflow-hidden group cursor-pointer"
      onClick={togglePlayPause}
    >
      <video
        ref={videoRef}
        src="/Tang.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full object-cover object-center"
      >
        {/* <source src="/Tang.mp4" type="video/mp4" /> */}
      </video>
      <div className="absolute inset-0 bg-black/10"></div>

      {/* Play/Pause overlay button */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="opacity-0 group-active:opacity-100 transition-opacity duration-300">
          <AnimatePresence mode="wait">
            {isPlaying ? (
              <motion.div
                key="pause"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-black/50 rounded-full p-4"
              >
                <Pause className="w-12 h-12 text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="play"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-black/50 rounded-full p-4"
              >
                <Play className="w-12 h-12 text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default Hero;
