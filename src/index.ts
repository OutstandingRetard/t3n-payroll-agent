import { connect } from "./client.js";

/**
 * Payroll-boundary demo in the TEE.
 *
 * This is the *shape* of a real enterprise agent: the agent only ever sees a
 * placeholder reference (e.g. account:emp-4827), never the raw account number.
 * Inside the TEE, T3N resolves the placeholder to the real destination,
 * applies the transfer, and writes a signed audit row to the ledger. The model
 * context never contains PII/account numbers.
 *
 * NOTE: In the sandbox this resolves to a Stripe test merchant / test amounts.
 * Swap `runPayrollTest()` for your own protected action via client + ADK MCP.
 */
async function main() {
  const client = await connect();

  const payroll = [
    { employeeRef: "account:emp-4827", amountUsd: 4250, note: "Sep base payroll" },
    { employeeRef: "account:emp-1130", amountUsd: 5320, note: "Sep bonus cycle" },
  ];

  console.log("🔐 Authenticated DID session open in TEE");
  console.log("📋 Commencing protected payroll run (sandbox / test values)\n");

  for (const p of payroll) {
    // In production, this is the ADK protected action:
    //   await actionbank.transfer(p.employeeRef, p.amountUsd);
    // The destination is resolved ONLY inside the TEE from the placeholder.
    console.log(
      `→ ${p.employeeRef}  ${p.note}  [$ ${p.amountUsd.toLocaleString("en-US")}]`
    );
    console.log("    resolved_in_tee               = false (demo stub)");
    console.log("    audit_row_signed              = pending-real-client");
  }

  console.log("\n✅ Demo complete. Replace the stub with a real ADK protected action.");
  console.log("   client session:", client ? "open" : "closed");
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});