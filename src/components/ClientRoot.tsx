"use client";
import { Providers } from "@/components/providers";

export default function ClientRoot({ children }: { children: React.ReactNode }) {
  return <Providers>{children}</Providers>;
} 