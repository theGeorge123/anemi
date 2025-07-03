import { config } from './config.js';

// Logger utility
export class Logger {
  private static getLogLevel(): number {
    const levels = { debug: 0, info: 1, warn: 2, error: 3 };
    return levels[config.LOG_LEVEL] || 1;
  }

  static debug(message: string, ...args: any[]): void {
    if (this.getLogLevel() <= 0) {
      console.error(`[DEBUG] ${message}`, ...args);
    }
  }

  static info(message: string, ...args: any[]): void {
    if (this.getLogLevel() <= 1) {
      console.error(`[INFO] ${message}`, ...args);
    }
  }

  static warn(message: string, ...args: any[]): void {
    if (this.getLogLevel() <= 2) {
      console.error(`[WARN] ${message}`, ...args);
    }
  }

  static error(message: string, ...args: any[]): void {
    if (this.getLogLevel() <= 3) {
      console.error(`[ERROR] ${message}`, ...args);
    }
  }
}

// Validation utilities
export const validateId = (id: string): boolean => {
  return typeof id === 'string' && id.length > 0;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateDate = (date: string): boolean => {
  const dateObj = new Date(date);
  return !isNaN(dateObj.getTime());
};

// Data transformation utilities
export const sanitizeInput = (input: any): any => {
  if (typeof input === 'string') {
    return input.trim();
  }
  if (Array.isArray(input)) {
    return input.map(sanitizeInput);
  }
  if (typeof input === 'object' && input !== null) {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(input)) {
      sanitized[key] = sanitizeInput(value);
    }
    return sanitized;
  }
  return input;
};

export const formatResponse = (data: any, success: boolean = true): any => {
  return {
    success,
    data,
    timestamp: new Date().toISOString(),
  };
};

export const formatError = (error: Error, context?: string): any => {
  return {
    success: false,
    error: {
      message: error.message,
      context,
      timestamp: new Date().toISOString(),
    },
  };
};

// Database utilities
export const buildWhereClause = (filters: Record<string, any>): Record<string, any> => {
  const where: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null) {
      where[key] = value;
    }
  }
  
  return where;
};

export const paginateResults = <T>(results: T[], page: number = 1, limit: number = 10): {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
} => {
  const total = results.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const data = results.slice(startIndex, endIndex);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
};

// Time utilities
export const generateExpiryDate = (daysFromNow: number = 7): string => {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + daysFromNow);
  return expiryDate.toISOString();
};

export const isExpired = (expiryDate: string): boolean => {
  return new Date(expiryDate) < new Date();
};

// Token utilities
export const generateToken = (length: number = 32): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Price range utilities
export const validatePriceRange = (priceRange: string): boolean => {
  const validRanges = ['BUDGET', 'MODERATE', 'EXPENSIVE', 'LUXURY'];
  return validRanges.includes(priceRange);
};

// Status utilities
export const validateStatus = (status: string): boolean => {
  const validStatuses = ['pending', 'confirmed', 'expired'];
  return validStatuses.includes(status);
}; 