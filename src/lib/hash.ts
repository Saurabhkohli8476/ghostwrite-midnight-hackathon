/**
 * Generates a SHA-256 hex hash of the given text using the Web Crypto API.
 * This runs natively in the browser without any external dependencies.
 * Used to create a content fingerprint for Midnight blockchain receipts
 * without exposing the actual cover letter content.
 */
export async function generateHash(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}
