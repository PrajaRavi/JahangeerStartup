import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";

interface GlassCopyInputProps {
  value: string;
  label?: string;
}

export default function GlassCopyInput({
  value,
  label = "Referral Code",
}: GlassCopyInputProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-full md:max-w-50 max-w-25">
      {label && (
        <label
          className="
          block
          mb-2

          md:text-sm
          text-xs
          md:font-medium


          text-white/80
        "
        >
          {label}
        </label>
      )}

      <motion.div
        whileHover={{
          scale: 1.01,
        }}
        className="
        flex
        items-center

        overflow-hidden

        md:rounded-2xl
        rounded-md

        border
        border-white/20

        bg-white/10

        backdrop-blur-xl

        shadow-lg
      "
      >
        {/* INPUT */}

        <input
          readOnly
          value={value}
          className="
          flex-1
          w-[60%]

          bg-transparent

          px-2
          py-1
          md:text-sm text-xs

          text-white

          outline-none

          placeholder:text-white/40
        "
        />

        {/* COPY BUTTON */}

        <motion.button
          whileTap={{
            scale: 0.95,
          }}
          onClick={handleCopy}
          className="
          flex
          items-center
          gap-2

          px-1
          py-1

          border-l
          border-white/10

          bg-cyan-400/10

          text-cyan-300

          hover:bg-cyan-400/20

          transition-all
        "
        >
          {copied ? (
            <>
              <Check className="md:text-sm text-xs"  />
              <span className="hidden md:text-sm text-xs sm:block">
                Copied
              </span>
            </>
          ) : (
            <>
              <Copy size={18} />
              <span className="hidden sm:block md:text-sm text-xs">
                Copy
              </span>
            </>
          )}
        </motion.button>
      </motion.div>
    </div>
  );
}