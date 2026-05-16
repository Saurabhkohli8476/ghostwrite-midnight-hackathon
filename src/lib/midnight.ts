/**
 * Simulates storing a hash on the Midnight preprod network.
 * In production, this would call the Midnight SDK.
 */
export async function storeHash(hash: string): Promise<{ txId: string }> {
  // Simulate network latency for realism
  await new Promise((resolve) => setTimeout(resolve, 1200));
  
  // Generate a realistic fake transaction ID
  const txId = 'tx_' + Date.now() + '_' + Math.random().toString(36).substring(2, 10);
  
  return { txId };
}
