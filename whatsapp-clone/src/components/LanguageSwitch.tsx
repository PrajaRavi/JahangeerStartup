
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Languages, Check } from "lucide-react";
import { useTranslation } from "react-i18next";

type Language = {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
};

const LANGUAGES: Language[] = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
    flag: "🇬🇧",
  },
  {
    code: "hi",
    name: "Hindi",
    nativeName: "हिंदी",
    flag: "🇮🇳",
  },
  {
    code: "mr",
    name: "Marathi",
    nativeName: "मराठी",
    flag: "MR",
  },
];

export default function LanguageSelectorPage() {
  const { i18n } = useTranslation();
const {t}=useTranslation()
  const [selectedLanguage, setSelectedLanguage] =
    useState("en");

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    const savedLanguage =
      localStorage.getItem("language") ||
      "en";

    setSelectedLanguage(savedLanguage);

    i18n.changeLanguage(savedLanguage);
  }, []);

  const handleLanguageChange = async (
    lang: string
  ) => {
    try {
      setLoading(true);

      setSelectedLanguage(lang);

      i18n.changeLanguage(lang);

      localStorage.setItem(
        "language",
        lang
      );

      /*
      =====================================
      API PLACEHOLDER
      =====================================

      await fetch(
        `${BASE_URL}/user/language`,
        {
          method: "PATCH",
          headers: {
            Authorization:
              `Bearer ${token}`,
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            language: lang,
          }),
        }
      );

      =====================================
      */
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-[#023B40] to-[#01BCBC] text-white z-1">
      {/* Background Blur Effects */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-cyan-500/20 rounded-full blur-[120px]" />

      <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-500/20 rounded-full blur-[120px]" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
          }}
          className="w-full max-w-3xl"
        >
          {/* Header */}
          <div className="text-center mb-8 md:mb-12">
            <motion.div
              initial={{
                scale: 0,
              }}
              animate={{
                scale: 1,
              }}
              transition={{
                delay: 0.2,
              }}
              className="mx-auto mb-5 flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-3xl border border-cyan-400/20 bg-cyan-500/10 backdrop-blur-xl"
            >
              <Languages className="h-8 w-8 md:h-10 md:w-10 text-cyan-400" />
            </motion.div>

            <h1 className="text-3xl md:text-5xl font-bold text-white">
              {t("choose_language")}
            </h1>

            <p className="mt-3 text-sm md:text-lg text-slate-400">
              {t("select_preferred_language")}
            </p>
          </div>

          {/* Language Cards */}
          <div className="space-y-4">
            {LANGUAGES.map(
              (
                language,
                index
              ) => {
                const active =
                  selectedLanguage ===
                  language.code;

                return (
                  <motion.button
                    key={
                      language.code
                    }
                    initial={{
                      opacity: 0,
                      y: 30,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay:
                        index *
                        0.1,
                    }}
                    whileHover={{
                      scale: 1.02,
                    }}
                    whileTap={{
                      scale: 0.98,
                    }}
                    onClick={() =>
                      handleLanguageChange(
                        language.code
                      )
                    }
                    disabled={
                      loading
                    }
                    className={`
                      relative
                      w-full
                      overflow-hidden
                      rounded-3xl
                      border
                      p-4 md:p-6
                      text-left
                      backdrop-blur-xl
                      transition-all
                      duration-300

                      ${
                        active
                          ? `
                          border-cyan-400
                          bg-cyan-500/10
                          shadow-[0_0_40px_rgba(34,211,238,0.2)]
                        `
                          : `
                          border-white/10
                          bg-white/5
                          hover:border-cyan-500/30
                        `
                      }
                    `}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-4xl md:text-5xl">
                        {
                          language.flag
                        }
                      </div>

                      <div>
                        <h2 className="text-lg md:text-2xl font-semibold text-white">
                          {
                            language.name
                          }
                        </h2>

                        <p className="mt-1 text-sm md:text-base text-slate-400">
                          {
                            language.nativeName
                          }
                        </p>
                      </div>

                      <div className="ml-auto">
                        {active ? (
                          <motion.div
                            layoutId="selected-language"
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500"
                          >
                            <Check className="h-5 w-5 text-white" />
                          </motion.div>
                        ) : (
                          <div className="h-10 w-10 rounded-full border border-slate-600" />
                        )}
                      </div>
                    </div>
                  </motion.button>
                );
              }
            )}
          </div>

          {/* Footer */}
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              delay: 0.5,
            }}
            className="mt-8 text-center"
          >
            <p className="text-sm text-white">
              {t("current_language")}
            </p>

            <p className="mt-1 text-cyan-400 font-medium">
              {
                LANGUAGES.find(
                  (lang) =>
                    lang.code ===
                    selectedLanguage
                )?.name
              }
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

