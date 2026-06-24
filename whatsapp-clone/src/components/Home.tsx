import { lazy, Suspense } from "react";
import {motion} from "framer-motion"
import AppImage from "../assets/app.png";
import Hero from "./Hero"
import {useTheme } from "../context/theme.context";
import PosterSlider from "../utils/Poster";
import poster from "../assets/poster/poster1.png"
import { useTranslation } from "react-i18next";
/**
 * 
import Services from "./Services";
import Process from "./Process";
import Stats from "./Stats";
import Footer from "./Footer";

*/
const posters=[poster,poster,poster]
const Services=lazy(()=>import("./Services"))
const Stats=lazy(()=>import("./Stats"))
const Footer=lazy(()=>import("./Footer"))
const Process=lazy(()=>import("./Process"))
const LoadingComp=()=>{
  return (
    <div className="w-full font-bold text-xl text-center">
<h1>Loading your component....</h1>
    </div>
  )
}

export default function Home() {
  const {dark}=useTheme();
 const { t } =
     useTranslation();
  
  return (
    <main
      className={`min-h-screen  w-125 sm:w-full transition-all duration-500 ${
        dark
        ? "bg-linear-to-br  from-[#023B40] to-[#01BCBC] text-white"
        : "bg-slate-50 text-slate-900"
        }`}
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



      {/* heavy component */}

      <Suspense fallback={<LoadingComp/>}>
      {/* SERVICES */}
      <div className="w-full flex justify-center bg-transparent">

      <PosterSlider duration={1} posters={posters} />
      </div>
      </Suspense>
      <Suspense fallback={<LoadingComp/>}>
      {/* SERVICES */}
      <Services />
      </Suspense>
      <Suspense fallback={<LoadingComp/>} >

      {/* PROCESS */}
      <Process />
      </Suspense >
      {/* STATS */}
      <Suspense fallback={<LoadingComp/>}>

      <Stats />
      </Suspense>
      {/* APP SECTION */}

      <section
        id="App"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <img src={AppImage} className="w-full max-w-md mx-auto" />

          <div>
            <h2 className="text-5xl font-black">
              {t("manage_laundry")}
            </h2>

            <p className="mt-6 opacity-80 text-lg">
              {t("laundry_app_description")}
            </p>

            <div className="mt-8 flex gap-4 flex-wrap">
              <button className="px-6 py-4 rounded-xl bg-black text-white">
                {t("app_store")}
              </button>
              <button className="px-6 py-4 rounded-xl bg-black text-white">
                {t("play_store")}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-white/10 text-black rounded-[40px] p-12 text-center">
          <h2 className="text-5xl font-black">{t("delivery_ready")}</h2>

          <p className="mt-4">{t("schedule_pickup")}.</p>

          <button className="mt-8 px-8 py-4 bg-black text-white rounded-2xl">
            {t("get_started")}
          </button>
        </div>
      </section>
<Suspense fallback={<LoadingComp/>}>
      {/* FOOTER */}
      <Footer />
</Suspense>


      </main>
  );
}