export async function checkKimiClawHealth() {
  return {
    status: "healthy",
    timestamp: new Date().toISOString(),
    plugin: "kimi-claw",
    gateway: "wss://www.kimi.com/api-claw/bots/agent-ws"
  };
}
