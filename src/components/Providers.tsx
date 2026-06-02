'use client';

import { SessionProvider } from "next-auth/react";
import OnboardingModal from "./OnboardingModal";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <OnboardingModal />
    </SessionProvider>
  );
}
