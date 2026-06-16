import { useTheme } from "../context/theme.context";

export default function ThemeToggle() {
  const { dark, setDark } = useTheme();

  return (
    <button
      onClick={() => {
        
        setDark(!dark)}}
      className="
      cursor-pointer
      bg-black/30
      px-5
      py-2
      rounded-full
      flex gap-2"
    >
      {dark ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}