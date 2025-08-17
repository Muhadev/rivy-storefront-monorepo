/**
 * Security Context and Hooks
 * Implements security best practices for enterprise applications
 */

import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import DOMPurify from 'dompurify';

interface SecurityContextType {
  sanitizeHtml: (html: string) => string;
  validateInput: (input: string, type: 'email' | 'text' | 'number') => boolean;
  isSecureContext: boolean;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

interface SecurityProviderProps {
  children: ReactNode;
}

export function SecurityProvider({ children }: SecurityProviderProps) {
  useEffect(() => {
    // Set security headers programmatically where possible
    const setSecurityHeaders = () => {
      // Content Security Policy (CSP) via meta tag
      if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
        const cspMeta = document.createElement('meta');
        cspMeta.httpEquiv = 'Content-Security-Policy';
        cspMeta.content = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.* wss: ws:";
        document.head.appendChild(cspMeta);
      }

      // X-Content-Type-Options
      if (!document.querySelector('meta[http-equiv="X-Content-Type-Options"]')) {
        const xContentType = document.createElement('meta');
        xContentType.httpEquiv = 'X-Content-Type-Options';
        xContentType.content = 'nosniff';
        document.head.appendChild(xContentType);
      }

      // X-Frame-Options
      if (!document.querySelector('meta[http-equiv="X-Frame-Options"]')) {
        const xFrameOptions = document.createElement('meta');
        xFrameOptions.httpEquiv = 'X-Frame-Options';
        xFrameOptions.content = 'DENY';
        document.head.appendChild(xFrameOptions);
      }

      // Referrer Policy
      if (!document.querySelector('meta[name="referrer"]')) {
        const referrerPolicy = document.createElement('meta');
        referrerPolicy.name = 'referrer';
        referrerPolicy.content = 'strict-origin-when-cross-origin';
        document.head.appendChild(referrerPolicy);
      }
    };

    setSecurityHeaders();

    // Disable right-click in production
    if (process.env.NODE_ENV === 'production') {
      const handleContextMenu = (e: MouseEvent) => {
        e.preventDefault();
        return false;
      };

      const handleKeyDown = (e: KeyboardEvent) => {
        // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
        if (
          e.key === 'F12' ||
          (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
          (e.ctrlKey && e.key === 'U')
        ) {
          e.preventDefault();
          return false;
        }
      };

      document.addEventListener('contextmenu', handleContextMenu);
      document.addEventListener('keydown', handleKeyDown);

      return () => {
        document.removeEventListener('contextmenu', handleContextMenu);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, []);

  const sanitizeHtml = (html: string): string => {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
      ALLOWED_ATTR: ['href', 'target'],
    });
  };

  const validateInput = (input: string, type: 'email' | 'text' | 'number'): boolean => {
    switch (type) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(input) && input.length <= 254;
      case 'text':
        // Check for potential XSS patterns
        const xssPattern = /<script|javascript:|on\w+\s*=|<iframe|<object|<embed/i;
        return !xssPattern.test(input) && input.length <= 1000;
      case 'number':
        return !isNaN(Number(input)) && isFinite(Number(input));
      default:
        return false;
    }
  };

  const isSecureContext = location.protocol === 'https:' || location.hostname === 'localhost';

  const value: SecurityContextType = {
    sanitizeHtml,
    validateInput,
    isSecureContext,
  };

  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  );
}

export function useSecurity() {
  const context = useContext(SecurityContext);
  if (context === undefined) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
}

// Secure Storage utilities
export const secureStorage = {
  setItem: (key: string, value: string, encrypt = true) => {
    try {
      const data = encrypt ? btoa(value) : value; // Simple encoding
      localStorage.setItem(key, data);
    } catch (error) {
      console.error('Failed to save to storage:', error);
    }
  },

  getItem: (key: string, decrypt = true) => {
    try {
      const data = localStorage.getItem(key);
      if (!data) return null;
      return decrypt ? atob(data) : data; // Simple decoding
    } catch (error) {
      console.error('Failed to read from storage:', error);
      return null;
    }
  },

  removeItem: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove from storage:', error);
    }
  },

  clear: () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  },
};

// Rate limiting utility
class RateLimiter {
  private attempts: Map<string, number[]> = new Map();

  isAllowed(key: string, maxAttempts: number, windowMs: number): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // Filter out attempts outside the time window
    const recentAttempts = attempts.filter(time => now - time < windowMs);
    
    if (recentAttempts.length >= maxAttempts) {
      return false;
    }

    // Add current attempt
    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);
    
    return true;
  }

  reset(key: string) {
    this.attempts.delete(key);
  }
}

export const rateLimiter = new RateLimiter();
