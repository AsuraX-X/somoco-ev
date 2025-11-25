"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import Find from "./Find";

const Hero = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [active, setActive] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }
    setActive(true);
    timeoutRef.current = window.setTimeout(() => setActive(false), 1000);
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [isPlaying]);

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
    <div>
      <section className="w-screen aspect-video sticky top-[54px] sm-top-[74px] -z-1 flex justify-center h-screen overflow-hidden group">
        <video
          ref={videoRef}
          src="/yuanplus.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover object-center"
        ></video>

        {/* Play/Pause overlay button */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className={`${
              active ? "opacity-100" : "opacity-0"
            } transition-opacity duration-300`}
          >
            {isPlaying ? (
              <motion.div className="bg-black/50 rounded-full p-4">
                <Play className="w-12 h-12 text-white" />
              </motion.div>
            ) : (
              <motion.div className="bg-black/50 rounded-full p-4">
                <Pause className="w-12 h-12 text-white" />
              </motion.div>
            )}
          </div>
        </div>
      </section>
      <div
        onClick={togglePlayPause}
        className="w-screen absolute cursor-pointer h-screen left-0 top-[74px] flex items-end justify-center"
      >
        <Link href={"/products"}>
          <motion.button
            initial={{ y: 50, opacity: 0, background: "#00101466" }}
            animate={{ y: 0, opacity: 1 }}
            whileHover={{
              backgroundColor: "#001014",
              transition: { duration: 0.3 },
            }}
            transition={{ ease: "easeInOut" }}
            className="border-secondary mb-40  backdrop-blur-xs text-2xl z-1 shadow-2xs cursor-pointer border rounded-full px-8 py-2"
          >
            Find Your Car
          </motion.button>
        </Link>
      </div>
      <Find />
    </div>
  );
};

export default Hero;
