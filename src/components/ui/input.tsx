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
        'w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm',
        'focus:border-emerald-500 focus:outline-none focus:ring-emerald-500',
        className
      )}
      {...props}
    />
  )
);
Input.displayName = 'Input'; 