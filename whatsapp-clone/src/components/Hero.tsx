import { motion } from "framer-motion";
import WashingMachine from "../assets/washing_machine.png"

export default function Hero() {
  return (
    <>
    {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-white/20"
          style={{
            width: 30 + i * 5,
            height: 30 + i * 5,
            left: `${(i * 8) % 100}%`,
            top: `${(i * 7) % 100}%`,
          }}
          animate={{ y: [0, -25, 0] }}
          transition={{ repeat: Infinity, duration: 4 + i }}
        />
      ))}

      {/* HERO */}
      <section id="Home" className="max-w-7xl  mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="px-4 py-2 rounded-full bg-white/20">
              Fast • Fresh • Reliable
            </span>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mt-6 leading-tight">
              Laundry Done
              <br />
              Right Every Time.
            </h1>

            <p className="mt-6 text-lg opacity-80 max-w-xl">
              Professional laundry and dry-cleaning service with free pickup,
              tracking, and doorstep delivery.
            </p>

            <div className="flex flex-wrap gap-4 mt-8">
              <button className="px-8 py-4 rounded-2xl bg-cyan-400 text-black font-bold">
                Book Now
              </button>

              <button className="px-8 py-4 rounded-2xl border">
                Learn More
              </button>
            </div>
          </div>

          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            <img
              src={WashingMachine}
              className="w-full z-1 max-w-xl mx-auto drop-shadow-2xl"
            />
          </motion.div>
        </div>
      </section>

    </>
  );
}