import { useEffect, useRef, useState } from "react";
import { CLAWSWAP_URL, useClawswap } from "./useClawswap";
import "./ClawswapBar.css";

// The panel's size, which its handles change and localStorage keeps. Above 480px wide clawswap's page
// switches from its compact list to its full layout.
const SIZE_KEY = "clawswap-panel-size";
const DEFAULT_SIZE = { width: 340, height: 440 };
const MIN = { width: 260, height: 200 };
const clampSize = ({ width, height }) => ({
  width: Math.round(Math.min(Math.max(width, MIN.width), window.innerWidth - 16)),
  height: Math.round(Math.min(Math.max(height, MIN.height), window.innerHeight - 70)),
});
const savedSize = () => {
  try {
    const s = JSON.parse(localStorage.getItem(SIZE_KEY));
    if (s?.width && s?.height) return clampSize(s);
  } catch {}
  return clampSize(DEFAULT_SIZE);
};

// clawswap's controls in a bar fixed to the bottom of the page, shown only by the dev server (see
// index.js): the branch you're on and a Pull button on the API, and a Branches button that opens
// clawswap's own page, to switch branch, in a panel above the bar. Based on clawswap's examples/react-embed.
export default function ClawswapBar() {
  const { state, error, pull } = useClawswap();
  const [message, setMessage] = useState(null);
  // A Pull click until clawswap answers it: the answer waits for a fetch from GitHub, which takes a moment.
  const [asking, setAsking] = useState(false);
  const [open, setOpen] = useState(false);
  const [frameKey, setFrameKey] = useState(0);
  const menu = useRef(null);
  const [size, setSize] = useState(savedSize);
  const [resizing, setResizing] = useState(false);

  // The panel hangs from the bar's right end, so its left edge sets the width and its top the height.
  // A drag follows the pointer (captured, and the frame ignores it meanwhile so it can't swallow the
  // moves); a double-click puts the default size back.
  const startResize = (e, dx, dy) => {
    e.preventDefault();
    const handle = e.currentTarget;
    handle.setPointerCapture(e.pointerId);
    const start = { x: e.clientX, y: e.clientY, ...size };
    let last = size;
    setResizing(true);
    const onMove = (m) => {
      last = clampSize({ width: start.width + dx * (start.x - m.clientX), height: start.height + dy * (start.y - m.clientY) });
      setSize(last);
    };
    const onUp = () => {
      handle.removeEventListener("pointermove", onMove);
      handle.removeEventListener("pointerup", onUp);
      handle.removeEventListener("pointercancel", onUp);
      setResizing(false);
      try {
        localStorage.setItem(SIZE_KEY, JSON.stringify(last));
      } catch {}
    };
    handle.addEventListener("pointermove", onMove);
    handle.addEventListener("pointerup", onUp);
    handle.addEventListener("pointercancel", onUp);
  };
  const resetSize = () => {
    const s = clampSize(DEFAULT_SIZE);
    setSize(s);
    try {
      localStorage.removeItem(SIZE_KEY);
    } catch {}
  };
  const handle = (cls, dx, dy, title) => (
    <div className={`cs-resize ${cls}`} title={title} onPointerDown={(e) => startResize(e, dx, dy)} onDoubleClick={resetSize} />
  );

  // Keep the panel inside the window when the window shrinks.
  useEffect(() => {
    const onResize = () => setSize((s) => clampSize(s));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

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

  // A Pull's answer ("Already up to date", or why it was refused) goes after a while.
  useEffect(() => {
    if (!message) return;
    const id = setTimeout(() => setMessage(null), 8000);
    return () => clearTimeout(id);
  }, [message]);

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

  const current = state?.current?.branch || "";
  const sw = state?.switch;
  const phase = sw?.phase;
  const behind = state?.upstream?.behind;
  const pulling = asking || (phase === "running" && sw.pull);

  // A pull with nothing new is done at once and reloads nothing, so say so; a refusal says why.
  const onPull = () => {
    setAsking(true);
    setMessage(null);
    pull()
      .then(
        (json) => setMessage(json.switch?.phase === "done" && !json.switch.doneAt ? (json.switch.notes || []).join(" ") || null : null),
        (e) => setMessage(e.message)
      )
      .finally(() => setAsking(false));
  };

  return (
    <div className={`cs-bar ${phase || ""}`}>
      <strong className="cs-name">clawswap</strong>

      {!state ? (
        <span className={error ? "cs-off" : "cs-muted"} title={error || ""}>
          {error ? "unreachable (is `clawswap up` running?)" : "connecting…"}
        </span>
      ) : (
        <>
          <span>{current || "detached HEAD"}</span>
          {phase === "running" && <span className="cs-status">→ {sw.target}: {sw.step || "starting"}</span>}
          {phase === "failed" && <span className="cs-status">{sw.error}</span>}
          {state.dirty && <span className="cs-muted">uncommitted changes</span>}
          {(message || error) && <span className="cs-status">{message || error}</span>}
        </>
      )}

      <div className="cs-actions">
        {state && (
          <button className={behind && !pulling ? "cs-behind" : ""} disabled={pulling || phase === "running"} onClick={onPull} aria-busy={pulling}>
            {pulling && <span className="cs-spinner" aria-hidden="true" />}
            {pulling ? "Pulling…" : `Pull${behind ? ` (${behind})` : ""}`}
          </button>
        )}
        <div className="cs-menu" ref={menu}>
          <button className={open ? "cs-on" : ""} aria-expanded={open} onClick={() => setOpen(!open)}>
            ⎇ Branches ▴
          </button>
          {/* Loaded with the page and only hidden while closed, so it keeps following a switch. */}
          <div className={`cs-panel${resizing ? " cs-resizing" : ""}`} hidden={!open} style={size}>
            {handle("cs-resize-left", 1, 0, "Drag to resize, double-click to reset")}
            {handle("cs-resize-top", 0, 1, "Drag to resize, double-click to reset")}
            {handle("cs-resize-corner", 1, 1, "Drag to resize, double-click to reset")}
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
    </div>
  );
}
