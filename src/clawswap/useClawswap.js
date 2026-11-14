import { useCallback, useEffect, useState } from "react";

// This project's page and API on the clawswap daemon: /p/<id>, the id being the session's name (the repo
// folder's name, "pic", as clawswap.exs sets none). Override with REACT_APP_CLAWSWAP_URL in .env.local.
export const CLAWSWAP_URL = process.env.REACT_APP_CLAWSWAP_URL || "http://localhost:27390/p/pic";

// Follows GET /state: every 2 s while a switch runs, every 10 s otherwise. A switch restarts the dev
// server, so failed fetches are expected for a moment and only show as "unreachable".
export function useClawswap() {
  const [state, setState] = useState(null);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`${CLAWSWAP_URL}/state`);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      setState(await res.json());
      setError(null);
    } catch (e) {
      setError(e.message || String(e));
    }
  }, []);

  const running = state?.switch?.phase === "running";

  useEffect(() => {
    load();
    const id = setInterval(load, running ? 2000 : 10000);
    return () => clearInterval(id);
  }, [load, running]);

  const post = useCallback(async (path, body) => {
    const res = await fetch(`${CLAWSWAP_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body || {}),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.error || `${res.status} ${res.statusText}`);
    if (json.branches) setState(json);
    return json;
  }, []);

  return {
    state,
    error,
    switchTo: (branch) => post("/switch", { branch }),
    pull: () => post("/pull"),
  };
}
