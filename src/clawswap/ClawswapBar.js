import { useEffect, useRef, useState } from "react";
import { CLAWSWAP_URL, useClawswap } from "./useClawswap";
import "./ClawswapBar.css";

// clawswap's controls in a bar fixed to the bottom of the page, shown only by the dev server (see
// index.js): the branch picker and Pull button on the API, and a Branches button that opens clawswap's
// own page in a panel above the bar. Based on clawswap's examples/react-embed.
export default function ClawswapBar() {
  const { state, error, switchTo, pull } = useClawswap();
  const [message, setMessage] = useState(null);
  const [open, setOpen] = useState(false);
  const [frameKey, setFrameKey] = useState(0);
  const menu = useRef(null);

  // Room for the bar, so it doesn't cover the end of the page.
  useEffect(() => {
    document.body.style.paddingBottom = "52px";
    return () => (document.body.style.paddingBottom = "");
  }, []);

  // The framed page says when a switch is done, and the app reloads on it.
  useEffect(() => {
    const onMessage = (e) =>
      e.origin === new URL(CLAWSWAP_URL).origin && e.data?.clawswap === "switched" && window.location.reload();
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  // A click outside the panel or Escape closes it.
  useEffect(() => {
    if (!open) return;
    const onMouseDown = (e) => menu.current && !menu.current.contains(e.target) && setOpen(false);
    const onKeyDown = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const act = (p) => p.then(() => setMessage(null), (e) => setMessage(e.message));
  const current = state?.current?.branch || "";
  const sw = state?.switch;
  const phase = sw?.phase;
  const behind = state?.upstream?.behind;

  return (
    <div className={`cs-bar ${phase || ""}`}>
      <strong className="cs-name">clawswap</strong>

      {!state ? (
        <span className={error ? "cs-off" : "cs-muted"} title={error || ""}>
          {error ? "unreachable (is `clawswap up` running?)" : "connecting…"}
        </span>
      ) : (
        <>
          <select value={current} disabled={phase === "running"} onChange={(e) => act(switchTo(e.target.value))}>
            {!state.branches.some((b) => b.branch === current) && (
              <option value={current}>{current || "detached HEAD"}</option>
            )}
            {state.branches.map((b) => (
              <option key={b.branch} value={b.branch}>
                {b.pr ? `#${b.pr.number} ${b.pr.title}` : b.short}
              </option>
            ))}
          </select>
          <button className={behind ? "cs-behind" : ""} disabled={phase === "running"} onClick={() => act(pull())}>
            Pull{behind ? ` (${behind})` : ""}
          </button>
          {phase === "running" && <span className="cs-status">→ {sw.target}: {sw.step || "starting"}</span>}
          {phase === "failed" && <span className="cs-status">{sw.error}</span>}
          {state.dirty && <span className="cs-muted">uncommitted changes</span>}
          {(message || error) && <span className="cs-status">{message || error}</span>}
        </>
      )}

      <div className="cs-menu" ref={menu}>
        <button className={open ? "cs-on" : ""} aria-expanded={open} onClick={() => setOpen(!open)}>
          ⎇ Branches ▴
        </button>
        {/* Loaded with the page and only hidden while closed, so it keeps following a switch. */}
        <div className="cs-panel" hidden={!open}>
          <div className="cs-panel-bar">
            <span>clawswap</span>
            <button title="Reload" onClick={() => setFrameKey((k) => k + 1)}>↻</button>
            <a href={CLAWSWAP_URL} target="_blank" rel="noreferrer" title="Open the full page">↗</a>
            <button title="Close" onClick={() => setOpen(false)}>✕</button>
          </div>
          <iframe key={frameKey} src={CLAWSWAP_URL} title="clawswap" />
        </div>
      </div>
    </div>
  );
}
