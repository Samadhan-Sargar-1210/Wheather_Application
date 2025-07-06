/**
 * Input validation utilities for security
 */

// City name validation
export const validateCityName = (city) => {
  if (!city || typeof city !== 'string') {
    throw new Error('City name is required');
  }

  const sanitized = city.trim();
  
  // Length validation
  if (sanitized.length === 0) {
    throw new Error('City name cannot be empty');
  }
  
  if (sanitized.length > 50) {
    throw new Error('City name is too long (maximum 50 characters)');
  }

  // Character validation - only letters, spaces, hyphens, apostrophes
  if (!/^[a-zA-Z\s\-']+$/.test(sanitized)) {
    throw new Error('City name contains invalid characters');
  }

  // Prevent common injection patterns
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /data:text\/html/i,
    /vbscript:/i
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(sanitized)) {
      throw new Error('City name contains potentially dangerous content');
    }
  }

  return sanitized;
};

// Coordinate validation
export const validateCoordinates = (lat, lon) => {
  if (typeof lat !== 'number' || typeof lon !== 'number') {
    throw new Error('Coordinates must be numbers');
  }

  if (isNaN(lat) || isNaN(lon)) {
    throw new Error('Invalid coordinates');
  }

  if (lat < -90 || lat > 90) {
    throw new Error('Latitude must be between -90 and 90');
  }

  if (lon < -180 || lon > 180) {
    throw new Error('Longitude must be between -180 and 180');
  }

  return { lat, lon };
};

// Language code validation
export const validateLanguageCode = (lang) => {
  const validLanguages = ['en', 'hi', 'mr', 'ta', 'te', 'kn', 'gu', 'pa', 'bn', 'ml', 'ur'];
  
  if (!validLanguages.includes(lang)) {
    throw new Error('Invalid language code');
  }

  return lang;
};

// User group validation
export const validateUserGroup = (group) => {
  const validGroups = [
    'city_residents',
    'farmers', 
    'small_children',
    'animals_livestock',
    'commuters',
    'elderly',
    'athletes'
  ];

  if (!validGroups.includes(group)) {
    throw new Error('Invalid user group');
  }

  return group;
};

// Weather condition validation
export const validateWeatherCondition = (condition) => {
  const validConditions = ['rain', 'sunny', 'cold', 'snow', 'storm', 'fog'];
  
  if (!validConditions.includes(condition)) {
    throw new Error('Invalid weather condition');
  }

  return condition;
};

// Rate limiting utility
class RateLimiter {
  constructor(maxRequests = 10, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = new Map();
  }

  isAllowed(key) {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    if (!this.requests.has(key)) {
      this.requests.set(key, []);
    }
    
    const requests = this.requests.get(key);
    
    // Remove old requests outside the window
    const validRequests = requests.filter(timestamp => timestamp > windowStart);
    this.requests.set(key, validRequests);
    
    if (validRequests.length >= this.maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    return true;
  }

  reset(key) {
    this.requests.delete(key);
  }
}

export const rateLimiter = new RateLimiter(10, 60000); // 10 requests per minute

// Sanitize HTML content
export const sanitizeHtml = (html) => {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
};

// Validate and sanitize user input
export const sanitizeUserInput = (input) => {
  if (typeof input !== 'string') {
    return '';
  }
  
  // Remove potentially dangerous characters
  return input
    .replace(/[<>\"'&]/g, '')
    .trim()
    .substring(0, 1000); // Limit length
}; 