"use client";

import { cn } from '@/lib/utils';

export interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'simple';
  className?: string;
  showText?: boolean;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-20 h-20',
};

const textSizes = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
};

export function Logo({ 
  size = 'md', 
  variant = 'default', 
  className,
  showText = false 
}: LogoProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className={cn('flex-shrink-0', sizeClasses[size])}>
        {variant === 'simple' ? (
          <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M12 16C12 14 14 12 16 12H20C22 12 24 14 24 16V24C24 26 22 28 20 28H16C14 28 12 26 12 24V16Z" className="fill-amber-500"/>
            <path d="M24 18C26 18 28 20 28 22C28 24 26 26 24 26" className="stroke-amber-600" strokeWidth="2" fill="none" strokeLinecap="round"/>
            <path d="M16 10C16 10 17 9 18 9C19 9 20 10 20 10" className="stroke-gray-400" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            <path d="M18 9C18 9 19 8 20 8C21 8 22 9 22 9" className="stroke-gray-400" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            <circle cx="14" cy="34" r="1.5" className="fill-blue-500"/>
            <circle cx="24" cy="36" r="1.5" className="fill-blue-500"/>
            <circle cx="34" cy="34" r="1.5" className="fill-blue-500"/>
            <path d="M15.5 34L32.5 34" className="stroke-blue-500" strokeWidth="1" opacity="0.6"/>
            <path d="M14 35.5L24 37.5" className="stroke-blue-500" strokeWidth="1" opacity="0.6"/>
            <path d="M24 37.5L34 35.5" className="stroke-blue-500" strokeWidth="1" opacity="0.6"/>
          </svg>
        ) : (
          <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <circle cx="60" cy="60" r="55" className="fill-slate-50 stroke-slate-300" strokeWidth="2"/>
            <path d="M35 45C35 40 40 35 45 35H55C60 35 65 40 65 45V65C65 70 60 75 55 75H45C40 75 35 70 35 65V45Z" className="fill-amber-100 stroke-amber-600" strokeWidth="1.5"/>
            <path d="M65 50C70 50 75 55 75 60C75 65 70 70 65 70" className="stroke-amber-600" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            <path d="M45 30C45 30 47 28 50 28C53 28 55 30 55 30" className="stroke-gray-300" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.7"/>
            <path d="M50 28C50 28 52 26 55 26C58 26 60 28 60 28" className="stroke-gray-300" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.5"/>
            <circle cx="45" cy="85" r="3" className="fill-blue-500"/>
            <circle cx="60" cy="90" r="3" className="fill-blue-500"/>
            <circle cx="75" cy="85" r="3" className="fill-blue-500"/>
            <path d="M48 85L72 85" className="stroke-blue-500" strokeWidth="1" opacity="0.6"/>
            <path d="M45 88L60 93" className="stroke-blue-500" strokeWidth="1" opacity="0.6"/>
            <path d="M60 93L75 88" className="stroke-blue-500" strokeWidth="1" opacity="0.6"/>
            <text x="60" y="110" textAnchor="middle" fontFamily="system-ui, -apple-system, sans-serif" fontSize="12" fontWeight="600" className="fill-slate-700">ANEMI</text>
          </svg>
        )}
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={cn('font-bold text-primary leading-none', textSizes[size])}>
            Anemi
          </span>
          <span className={cn('text-muted-foreground leading-none', textSizes[size])}>
            Meets
          </span>
        </div>
      )}
    </div>
  );
} 