export const isLocal = (): boolean =>
  new URL(import.meta.env.VITE_API_URL).hostname === 'localhost';
