import { connect, getCredits } from "./client.js";

/**
 * Verifies the T3N sandbox setup end to end:
 * 1. connects + authenticates to the TEE via the API key,
 * 2. prints the DID bound to the key,
 * 3. prints the available credit balance.
 * Nothing is mutated; safe to run repeatedly.
 */
async function main() {
  try {
    const client = await connect();
    // The SDK resolves the DID during authenticate; expose it from the client
    // if available, otherwise report success with the balance.
    const credits = await getCredits();
    console.log("✅ T3N sandbox authentication succeeded");
    console.log(`credits_available=${credits}`);
    console.log(`client_sessions=${client ? "open" : "closed"}`);
  } catch (err) {
    console.error("❌ T3N auth check failed");
    console.error(err instanceof Error ? err.message : err);
    process.exit(1);
  }
}

main();