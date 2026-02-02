"use client";
import { useEffect } from "react";

export default function AppVersionCheck() {
  useEffect(() => {
    const CURRENT_VERSION = "1.0";
    const storedVersion = localStorage.getItem("appVersion");

    if (storedVersion !== CURRENT_VERSION) {
      localStorage.clear();
      localStorage.setItem("appVersion", CURRENT_VERSION);
    }
  }, []);

  return null;
}
