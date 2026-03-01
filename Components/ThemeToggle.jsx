"use client";

import { useTheme } from "next-themes";
import { useSession } from "next-auth/react";
import axios from "axios";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const { data: session, update } = useSession();
  if (!session || !theme) return null;

  const toggleTheme = async () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    await axios.patch("/api/user/theme", { theme: newTheme });
    await update ({theme : newTheme});
  };

  return (
    <button
      onClick={toggleTheme}
      className="px-3 py-1 rounded bg-amber-600 dark:bg-gray-200 text-black dark:text-gray-900 transition-colors duration-200 cursor-pointer"
    >
      {theme === "dark" ? "Normal Mode" : "Reading Mode"}
    </button>
  );
}
