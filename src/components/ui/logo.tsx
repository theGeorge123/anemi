import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'simple' | 'text-only';
  className?: string;
  showText?: boolean;
}

export function Logo({ 
  size = 'md', 
  variant = 'default', 
  className,
  showText = false 
}: LogoProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  if (variant === 'text-only') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <span className={cn('font-bold text-primary', textSizes[size])}>
          Anemi
        </span>
        {showText && (
          <span className={cn('text-muted-foreground', textSizes[size])}>
            Meets
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className={cn('flex-shrink-0', sizeClasses[size])}>
        {variant === 'simple' ? (
          <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M12 16C12 14 14 12 16 12H20C22 12 24 14 24 16V24C24 26 22 28 20 28H16C14 28 12 26 12 24V16Z" fill="#f59e0b"/>
            <path d="M24 18C26 18 28 20 28 22C28 24 26 26 24 26" stroke="#d97706" strokeWidth="2" fill="none" strokeLinecap="round"/>
            <path d="M16 10C16 10 17 9 18 9C19 9 20 10 20 10" stroke="#9ca3af" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            <path d="M18 9C18 9 19 8 20 8C21 8 22 9 22 9" stroke="#9ca3af" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            <circle cx="14" cy="34" r="1.5" fill="#3b82f6"/>
            <circle cx="24" cy="36" r="1.5" fill="#3b82f6"/>
            <circle cx="34" cy="34" r="1.5" fill="#3b82f6"/>
            <path d="M15.5 34L32.5 34" stroke="#3b82f6" strokeWidth="1" opacity="0.6"/>
            <path d="M14 35.5L24 37.5" stroke="#3b82f6" strokeWidth="1" opacity="0.6"/>
            <path d="M24 37.5L34 35.5" stroke="#3b82f6" strokeWidth="1" opacity="0.6"/>
          </svg>
        ) : (
          <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <circle cx="60" cy="60" r="55" fill="url(#gradient)" stroke="url(#strokeGradient)" strokeWidth="2"/>
            <path d="M35 45C35 40 40 35 45 35H55C60 35 65 40 65 45V65C65 70 60 75 55 75H45C40 75 35 70 35 65V45Z" fill="url(#cupGradient)" stroke="url(#cupStroke)" strokeWidth="1.5"/>
            <path d="M65 50C70 50 75 55 75 60C75 65 70 70 65 70" stroke="url(#cupStroke)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            <path d="M45 30C45 30 47 28 50 28C53 28 55 30 55 30" stroke="url(#steamGradient)" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.7"/>
            <path d="M50 28C50 28 52 26 55 26C58 26 60 28 60 28" stroke="url(#steamGradient)" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.5"/>
            <circle cx="45" cy="85" r="3" fill="url(#dotGradient)"/>
            <circle cx="60" cy="90" r="3" fill="url(#dotGradient)"/>
            <circle cx="75" cy="85" r="3" fill="url(#dotGradient)"/>
            <path d="M48 85L72 85" stroke="url(#connectionGradient)" strokeWidth="1" opacity="0.6"/>
            <path d="M45 88L60 93" stroke="url(#connectionGradient)" strokeWidth="1" opacity="0.6"/>
            <path d="M60 93L75 88" stroke="url(#connectionGradient)" strokeWidth="1" opacity="0.6"/>
            <text x="60" y="110" textAnchor="middle" fontFamily="system-ui, -apple-system, sans-serif" fontSize="12" fontWeight="600" fill="url(#textGradient)">ANEMI</text>
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: '#f8fafc', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: '#e2e8f0', stopOpacity: 1}} />
              </linearGradient>
              <linearGradient id="strokeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: '#cbd5e1', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: '#94a3b8', stopOpacity: 1}} />
              </linearGradient>
              <linearGradient id="cupGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: '#fef3c7', stopOpacity: 1}} />
                <stop offset="50%" style={{stopColor: '#fde68a', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: '#f59e0b', stopOpacity: 1}} />
              </linearGradient>
              <linearGradient id="cupStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: '#d97706', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: '#b45309', stopOpacity: 1}} />
              </linearGradient>
              <linearGradient id="steamGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: '#e5e7eb', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: '#d1d5db', stopOpacity: 1}} />
              </linearGradient>
              <radialGradient id="dotGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" style={{stopColor: '#3b82f6', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: '#1d4ed8', stopOpacity: 1}} />
              </radialGradient>
              <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: '#3b82f6', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: '#1d4ed8', stopOpacity: 1}} />
              </linearGradient>
              <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: '#475569', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: '#1e293b', stopOpacity: 1}} />
              </linearGradient>
            </defs>
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