"use client";

import { useEffect } from "react";
import { store, hydrateCart } from "@/redux/store";

export default function ReduxProvider({ children }) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("cart");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        store.dispatch(hydrateCart(parsed));
      } catch (error) {
        console.warn("Unable to parse saved cart:", error);
      }
    }
  }, []);

  return <>{children}</>;
}
