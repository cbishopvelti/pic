import { useCallback, useEffect, useRef, useState } from "react";

// This project's API on the clawswap daemon: /p/<id>, the id being the session's name (the repo folder's
// name, "pic", as clawswap.exs sets none). Override with REACT_APP_CLAWSWAP_URL in .env.local.
export const CLAWSWAP_URL = process.env.REACT_APP_CLAWSWAP_URL || "http://localhost:27390/p/pic";

const POLL_OPEN_MS = 1000;
const POLL_MS = 5000;
// While clawswap isn't running, look less and less often, so the console isn't full of refused connections.
const POLL_DOWN_MAX_MS = 60000;

// Follows GET /state the way bmx's Branches menu does: every second while the list is open or a switch
// runs, every 5 s otherwise, backing off to a minute while clawswap is down, and again on window focus.
export function useClawswap(open) {
  const [state, setState] = useState(null);
  const [down, setDown] = useState(false);
  const live = useRef({ open, state: null, down: false, delay: POLL_MS, timer: null, disposed: false });
  live.current.open = open;

  const poll = useCallback(async () => {
    const l = live.current;
    clearTimeout(l.timer);
    try {
      const res = await fetch(`${CLAWSWAP_URL}/state`);
      // A 404 is a clawswap daemon that runs other projects but not pic: off, as far as this goes.
      if (!res.ok) throw new Error(`clawswap answered ${res.status}`);
      l.state = await res.json();
      l.down = false;
      l.delay = POLL_MS;
      setState(l.state);
      setDown(false);
    } catch {
      l.down = true;
      l.delay = Math.min(l.delay * 2, POLL_DOWN_MAX_MS);
      setDown(true);
    }
    if (l.disposed) return;
    const running = l.state?.switch?.phase === "running";
    l.timer = setTimeout(poll, l.down ? l.delay : l.open || running ? POLL_OPEN_MS : POLL_MS);
  }, []);

  useEffect(() => {
    const l = live.current;
    l.disposed = false;
    const onFocus = () => {
      l.delay = POLL_MS;
      poll();
    };
    poll();
    window.addEventListener("focus", onFocus);
    return () => {
      l.disposed = true;
      clearTimeout(l.timer);
      window.removeEventListener("focus", onFocus);
    };
  }, [poll]);

  // Returns the error clawswap gave, or null; the new state is applied either way.
  const post = useCallback(
    async (path, body) => {
      let error = null;
      try {
        const res = await fetch(`${CLAWSWAP_URL}${path}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body || {}),
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) error = json.error || `clawswap answered ${res.status}`;
        else {
          live.current.state = json;
          setState(json);
        }
      } catch {
        error = "clawswap isn't running";
      }
      poll();
      return { error, state: live.current.state };
    },
    [poll]
  );

  return { state, down, poll, post };
}
