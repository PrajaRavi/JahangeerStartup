import Navbar from "./Navbar"
import Hero from "./Hero"
import Services from "./Services";
import Process from "./Process";
import Stats from "./Stats";
import AppSection from "./AppSection";
import {motion} from "framer-motion"
import AppImage from "../assets/app.png";

import Footer from "./Footer";
import { ThemeProvider, useTheme } from "../context/theme.context";

export default function Home() {
  const {dark}=useTheme();
  return (
    <main
      className={dark?"min-h-screen text-white bg-transparent overflow-hidden":"min-h-screen text-black bg-transparent overflow-hidden"}
    >
     
      {/* FLOATING BUBBLES */}
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
      <Hero />
      {/* SERVICES */}
      <Services />
      {/* PROCESS */}
      <Process />
      {/* STATS */}
      <Stats />
      {/* APP SECTION */}
      <section
        id="App"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <img src={AppImage} className="w-full max-w-md mx-auto" />

          <div>
            <h2 className="text-5xl font-black">
              Manage Laundry From Your Phone
            </h2>

            <p className="mt-6 opacity-80 text-lg">
              Schedule pickups, track orders, make payments and receive
              notifications in real-time.
            </p>

            <div className="mt-8 flex gap-4 flex-wrap">
              <button className="px-6 py-4 rounded-xl bg-black text-white">
                App Store
              </button>
              <button className="px-6 py-4 rounded-xl bg-black text-white">
                Play Store
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-white/10 text-black rounded-[40px] p-12 text-center">
          <h2 className="text-5xl font-black">Ready For Fresh Clothes?</h2>

          <p className="mt-4">Schedule your first pickup today.</p>

          <button className="mt-8 px-8 py-4 bg-black text-white rounded-2xl">
            Get Started
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />

      </main>
  );
}