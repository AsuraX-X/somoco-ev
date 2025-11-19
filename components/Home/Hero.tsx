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
      className="w-full relative flex items-end justify-center h-screen mt-[74px] overflow-hidden group cursor-pointer"
      onClick={togglePlayPause}
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="w-full absolute h-full object-cover"
      >
        <source src="/Tang.mp4" type="video/mp4" />
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
      <motion.button
        whileHover={{
          backgroundColor: "#ffffff",
          color: "#000000",
        }}
        whileTap={{
          backgroundColor: "#cecece",
          color: "#000000",
        }}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ease: "easeInOut" }}
        className="border-secondary mb-30 backdrop-blur-xs text-2xl z-1 shadow-2xs cursor-pointer border rounded-full px-8 py-2"
      >
        Find Your Car{" "}
      </motion.button>
    </section>
  );
};

export default Hero;
