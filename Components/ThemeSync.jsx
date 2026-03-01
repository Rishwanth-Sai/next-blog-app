"use client";

import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { useEffect } from "react";

export default function ThemeSync() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const dbTheme = session?.user?.theme;
    if (!dbTheme || !theme) return;
    
    if (dbTheme !== theme) {
      setTheme(dbTheme);
    }
  }, [session?.user?.theme, theme, setTheme]);

  return null;
}