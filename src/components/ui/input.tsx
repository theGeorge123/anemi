"use client";
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        'w-full rounded-xl border-2 border-amber-200 bg-white px-4 py-3 text-base shadow-sm transition-all duration-300',
        'focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:ring-offset-2',
        'placeholder:text-muted-foreground/60',
        'hover:border-amber-300',
        className
      )}
      {...props}
    />
  )
);
Input.displayName = 'Input'; 