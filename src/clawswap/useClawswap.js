import { useCallback, useEffect, useRef, useState } from "react";

// This project's page and API on the clawswap daemon: /p/<id>, the id being the session's name (the repo
// folder's name, "pic", as clawswap.exs sets none). Override with REACT_APP_CLAWSWAP_URL in .env.local.
export const CLAWSWAP_URL = process.env.REACT_APP_CLAWSWAP_URL || "http://localhost:27390/p/pic";

// Follows GET /state: every 2 s while a switch runs, every 10 s otherwise. A switch restarts the dev
// server, so failed fetches are expected for a moment and only show as "unreachable".
//
// It also reloads the page when a switch or pull is done (a new switch.doneAt: its servers listen again),
// however it was started, as clawswap's docs/page.html#reload says. The framed page posts "switched" too,
// but only while its frame is loaded and connected, and CRA's dev server doesn't reload by itself.
export function useClawswap() {
  const [state, setState] = useState(null);
  const [error, setError] = useState(null);
  // The last finished switch's doneAt; undefined until the first state says where things stand.
  const doneAt = useRef(undefined);

  const follow = useCallback((next) => {
    const at = next?.switch?.doneAt ?? null;
    // A running switch drops doneAt, so only a new time counts, not it going away.
    if (doneAt.current !== undefined && at !== null && at !== doneAt.current) {
      window.location.reload();
      return;
    }
    if (doneAt.current === undefined || at !== null) doneAt.current = at;
    setState(next);
  }, []);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`${CLAWSWAP_URL}/state`);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      follow(await res.json());
      setError(null);
    } catch (e) {
      setError(e.message || String(e));
    }
  }, [follow]);

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
    if (json.branches) follow(json);
    return json;
  }, [follow]);

  return {
    state,
    error,
    pull: () => post("/pull"),
  };
}
