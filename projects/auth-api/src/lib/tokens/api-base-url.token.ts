import { InjectionToken } from '@angular/core';

/**
 * InjectionToken for configuring the API base URL
 * This allows consumers of the library to provide their own base URL
 * instead of using the hardcoded environment value.
 * 
 * @example
 * ```typescript
 * providers: [
 *   { provide: API_BASE_URL, useValue: 'https://my-api.com/api/v1' }
 * ]
 * ```
 */
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  providedIn: 'root',
  factory: () => 'https://exam.elevateegy.com/api/v1' // Default fallback URL
});
