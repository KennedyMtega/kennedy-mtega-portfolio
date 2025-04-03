
/**
 * Utility functions for generating website previews
 */

/**
 * Generate a preview image URL from a website URL using a screenshot service
 * 
 * @param url The URL of the website to generate a preview for
 * @returns The URL of the generated preview image
 */
export const generatePreviewFromUrl = (url: string): string => {
  if (!url) return '';
  
  // Remove http/https protocol for compatibility with some services
  const cleanUrl = url.replace(/^https?:\/\//, '');
  
  // Use a screenshot service - several options:
  // 1. Microlink (limited free tier)
  // return `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url`;
  
  // 2. Screeenly (replace with your API key if using)
  // return `https://screeenly.com/api/v1/screenshot?url=${encodeURIComponent(url)}`;
  
  // 3. Urlbox (replace with your API key if using)
  // return `https://api.urlbox.io/v1/[YOUR_API_KEY]/png?url=${encodeURIComponent(url)}`;
  
  // 4. PageXray - Free and no API key required
  return `https://api.pagexray.io/v1/snapshot?url=${encodeURIComponent(cleanUrl)}&width=1280&height=800&device=desktop&scale=1&format=jpeg`;
}

/**
 * Validate if a URL is properly formatted
 * 
 * @param url The URL to validate
 * @returns True if the URL is valid, false otherwise
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}
