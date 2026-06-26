// Central API URL configuration.
// Change the value here to switch between local and deployed backends.

import { url } from "node:inspector";

// You can also override at runtime by setting `window.__env = { API_URL: '...' }` before the app loads.
export const API_URL: string = (typeof window !== 'undefined' && (window as any).__env && (window as any).__env.API_URL) || 'https://aeternus-works-back-end.onrender.com/api';

// live url
// https://aeternus-works-back-end.onrender.com/api
//local url
//http://localhost:8080/api