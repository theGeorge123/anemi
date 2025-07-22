// Centralized error handling service
export class ErrorService {
  static handleError(error: any, fallbackMessage: string = 'Er ging iets mis'): string {
    console.error('Application error:', error);
    // Extract meaningful error message
    if (error?.message) return error.message;
    if (error?.error_description) return error.error_description;
    return fallbackMessage;
  }

  static showToast(message: string, type: 'success' | 'error' | 'info' = 'error') {
    // Replace with your actual toast system
    if (typeof window !== 'undefined' && (window as any)['toast']) {
      (window as any)['toast']({ description: message, type });
    } else {
      // Fallback: log to console
      console.log(`[${type.toUpperCase()}]`, message);
    }
  }
} 