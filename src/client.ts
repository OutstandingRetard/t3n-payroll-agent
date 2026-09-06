import {
  T3nClient,
  loadWasmComponent,
  setEnvironment,
  createEthAuthInput,
  eth_get_address,
  metamask_sign,
  fetchTrustedManifest,
} from "@terminal3/t3n-sdk";

// Load .env natively (Node ≥ 20.12 has process.loadEnvFile; ignore if absent).
try {
  (process as any).loadEnvFile?.();
} catch {
  /* .env optional in CI */
}

const KEY = process.env.T3N_API_KEY ?? "";
let _client: T3nClient | null = null;

/**
 * Creates (lazily) an authenticated T3N client in the sandbox environment.
 * All crypto runs inside the WASM component; the API key never leaves the box.
 */
export async function connect(): Promise<T3nClient> {
  setEnvironment("sandbox");
  if (!KEY) {
    throw new Error(
      "T3N_API_KEY is not set. Get a sandbox key at https://www.terminal3.io/claim-page and save it to .env"
    );
  }
  if (_client) return _client;

  const wasmComponent = await loadWasmComponent();
  const address = eth_get_address(KEY);

  _client = new T3nClient({
    trustAnchor: await fetchTrustedManifest("sandbox"),
    wasmComponent,
    handlers: {
      EthSign: metamask_sign(address, undefined, KEY),
    },
  });

  // open an encrypted session in the TEE
  await _client.handshake();
  // prove your wallet -> your did:t3n:...
  await _client.authenticate(createEthAuthInput(address));
  return _client;
}

export async function getCredits(): Promise<string> {
  const c = await connect();
  const { balance } = await c.getUsage();
  return String(balance.available);
}