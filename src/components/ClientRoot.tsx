"use client";
import { Providers } from "@/components/providers";
import '@/i18n';

export default function ClientRoot({ children }: { children: React.ReactNode }) {
  return <Providers>{children}</Providers>;
} 