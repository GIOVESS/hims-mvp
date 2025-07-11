"use client"

import { useTheme } from "next-themes"

export function resolvedTheme() {
  const { theme, systemTheme } = useTheme()
  return theme === "system" ? systemTheme : theme
} 