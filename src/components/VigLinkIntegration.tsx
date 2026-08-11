'use client';

import { useEffect } from 'react';

/**
 * VigLink Integration Component
 * Loads the VigLink script for affiliate link conversion tracking
 * Used by Soven platform for monetization
 */
export function VigLinkIntegration() {
  useEffect(() => {
    // Ensure VigLink key is configured
    if (!process.env.NEXT_PUBLIC_VIGLINK_KEY) {
      console.warn('VigLink key not configured. Set NEXT_PUBLIC_VIGLINK_KEY in .env.local');
      return;
    }

    // Set up the VigLink configuration object
    (window as any).vglnk = {
      key: process.env.NEXT_PUBLIC_VIGLINK_KEY,
    };

    // Create and append the VigLink script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = '//cdn.viglink.com/api/vglnk.js';

    // Append to document head or after last script tag
    const scripts = document.getElementsByTagName('script');
    if (scripts.length > 0) {
      const lastScript = scripts[scripts.length - 1];
      lastScript.parentNode?.insertBefore(script, lastScript.nextSibling);
    } else {
      document.head.appendChild(script);
    }
  }, []);

  // This component doesn't render any UI
  // It only manages the VigLink script injection
  return null;
}