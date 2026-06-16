import { motion } from "framer-motion";
import { useTheme } from "../context/theme.context";
import AppImage from "../assets/app.png";
import Navbar from "./Navbar";
import Hero from "./Hero";
import Services from "./Services";
import Process from "./Process";
import Stats from "./Stats";
import Footer from "./Footer";
import Home from "./Home";

/**
 * LANDING PAGE
 * Replace:
 * /logo.png
 * /washer.png
 * /app-mockup.png
 */

export default function LandingPage() {
  const { dark, toggleTheme } = useTheme();

  return (
    <div
      className={`min-h-screen overflow-hidden transition-all duration-500 ${
        dark
          ? "bg-gradient-to-br  from-[#023B40] to-[#01BCBC] text-white"
          : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* NAVBAR */}
      <Navbar />
      <Home/>
      
          </div>
  );
}
