import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface PosterSliderProps {
  posters: string[];
  duration?: number; // milliseconds
}

export default function PosterSlider({
  posters,
  duration = 1000,
}: PosterSliderProps) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || posters.length <= 1) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % posters.length);
    }, duration);

    return () => clearInterval(interval);
  }, [duration, posters.length, paused]);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % posters.length);
  };

  const prevSlide = () => {
    setCurrent((prev) =>
      prev === 0 ? posters.length - 1 : prev - 1
    );
  };

  return (
    <section className="md:w-[80%] w-[98%]">
      <div
        className="relative w-full overflow-hidden rounded-3xl bg-transparent"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Height Responsive */}
        <div className="relative h-55 sm:h-75 md:h-100 lg:h-125">
          <AnimatePresence mode="wait">
            <motion.img
              key={current}
              src={posters[current]}
              alt="poster"
              className="absolute inset-0 h-full w-full object-contain"
              initial={{
                opacity: 0,
                scale: 1.1,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: 1.05,
              }}
              transition={{
                duration: 0.8,
              }}
            />
          </AnimatePresence>

          {/* Glass Overlay */}
          {/* <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" /> */}
        </div>

        {/* Previous Button */}
        <button
          onClick={prevSlide}
          className="
            absolute left-4 top-1/2
            -translate-y-1/2
            h-10 w-10
            rounded-full
            bg-white/10
            backdrop-blur-md
            text-white
            border border-white/20
            hover:bg-white/20
            transition
          "
        >
          ❮
        </button>

        {/* Next Button */}
        <button
          onClick={nextSlide}
          className="
            absolute right-4 top-1/2
            -translate-y-1/2
            h-10 w-10
            rounded-full
            bg-white/10
            backdrop-blur-md
            text-white
            border border-white/20
            hover:bg-white/20
            transition
          "
        >
          ❯
        </button>

        {/* Indicators */}
        <div
          className="
            absolute
            bottom-4
            left-1/2
            -translate-x-1/2
            flex gap-2
          "
        >
          {posters.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`
                h-2 rounded-full transition-all duration-300
                ${
                  current === index
                    ? "w-8 bg-white"
                    : "w-2 bg-white/40"
                }
              `}
            />
          ))}
        </div>
      </div>
    </section>
  );
}