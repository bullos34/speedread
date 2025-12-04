"use client";

export function StoreHydration({ children }: { children: React.ReactNode }) {
  // This component just ensures we're on the client side
  // Zustand persist will handle hydration automatically
  return <>{children}</>;
}

