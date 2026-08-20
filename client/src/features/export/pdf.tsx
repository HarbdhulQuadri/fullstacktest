import type { User } from '../users/types';

/**
 * Thin wrapper: the heavy `@react-pdf/renderer` bundle is loaded on demand
 * (only when a user actually exports a PDF) so it stays out of the main chunk.
 */
export async function exportUserPdf(user: User): Promise<void> {
  const { exportUserPdf: impl } = await import('./pdfRenderer');
  return impl(user);
}
