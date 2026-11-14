import { useEffect, useRef, useState } from "react";
import { CLAWSWAP_URL, useClawswap } from "./useClawswap";
import "./ClawswapBar.css";

// The dev-only bar at the bottom of the page (see index.js) with clawswap's Branches menu, a port of bmx's
// DevBranches (frontend/src/components/visualizer/DevBranches.tsx on bmx's claude-main) so the two look and
// work the same: the branch you're on as a button that opens the branch list, and Pull beside it. Picking a
// branch stops the dev server, checks it out, runs what it needs and starts it again; the page reloads.

// A row's merge status: a symbol, its colour and what it means.
const mergeStatus = (b, base, prsKnown) => {
  if (b.branch === base) return { symbol: "⎇", cls: "cs-muted", title: `${b.branch}, the branch the others merge into` };
  if (b.merged) return { symbol: "✓", cls: "cs-success", title: `Merged into ${base}` };
  if (b.pr?.draft) return { symbol: "◌", cls: "cs-faint", title: `Draft PR #${b.pr.number}, not merged yet` };
  if (b.pr) return { symbol: "●", cls: "cs-info", title: `Open PR #${b.pr.number}, not merged yet` };
  return { symbol: "○", cls: "cs-muted", title: prsKnown ? `Not merged into ${base}, and no open PR` : `Not merged into ${base}` };
};

const Spinner = ({ label }) => <span className="cs-spinner" aria-label={label} aria-hidden={label ? undefined : "true"} />;

export default function ClawswapBar() {
  const [open, setOpen] = useState(false);
  const { state, down, poll, post } = useClawswap(open);
  const [error, setError] = useState(null);
  // What was just clicked (a branch, or "pull") until the watcher answers; then running takes over.
  const [pending, setPending] = useState(null);
  const [pullResult, setPullResult] = useState(null);
  const pullResultTimer = useRef(null);
  const ref = useRef(null);

  // Room for the bar, so it doesn't cover the end of the page.
  useEffect(() => {
    document.body.style.paddingBottom = "36px";
    return () => (document.body.style.paddingBottom = "");
  }, []);
  useEffect(() => () => clearTimeout(pullResultTimer.current), []);

  // A switch restarts the dev server: reload once it's done, so the page shows the new branch. A pull that
  // brought nothing in restarts nothing, so it stays.
  const lastSwitch = useRef(null);
  useEffect(() => {
    const s = state?.switch;
    const was = lastSwitch.current;
    lastSwitch.current = s;
    if (was?.phase === "running" && s?.phase === "done" && !(s.pull && s.notes?.length)) window.location.reload();
  }, [state]);

  // A click anywhere else, or Escape, closes the list. pointerdown in the capture phase, so a control that
  // stops mousedown doesn't keep it open.
  useEffect(() => {
    const onPointerDown = (e) => open && ref.current && !ref.current.contains(e.target) && setOpen(false);
    const onKeyDown = (e) => open && e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const send = async (path, body, what) => {
    setError(null);
    setPending(what);
    const result = await post(path, body);
    setError(result.error);
    setPending(null);
    return result;
  };
  const switchTo = (branch) => send("/switch", { branch }, branch);
  // Pulls the checkout's branch; the server restarts only if anything came in. What came of it shows on the
  // button for a few seconds, since the branch list may be closed.
  const pull = async () => {
    const { error: e, state: st } = await send("/pull", {}, "pull");
    const s = st?.switch;
    const result = e ? { text: "Pull failed", error: e } : s?.pull && s.phase === "done" && s.notes?.length ? { text: "✓ Up to date" } : null;
    if (!result) return;
    setPullResult(result);
    clearTimeout(pullResultTimer.current);
    pullResultTimer.current = setTimeout(() => setPullResult(null), 4000);
  };

  const current = state?.current?.branch;
  const behindBy = state?.upstream?.behind ?? 0;
  const sw = state?.switch;
  // A pull that failed after it started (a step, or a diverged branch), until the next one.
  const pullFailed = sw?.pull && sw.phase === "failed" && sw.target === current ? sw.error : undefined;
  const running = sw?.phase === "running" ? sw : undefined;
  const busy = !!pending || !!running;
  const pulling = pending === "pull" || !!running?.pull;
  // Which branch is being switched to, from the click on (a pull's spinner is on the Pull button).
  const target = pulling ? undefined : running?.target ?? pending;
  const label = down
    ? "clawswap off"
    : running && !running.pull
      ? `→ ${running.target}: ${running.step ?? "switching"}`
      : pending && pending !== "pull"
        ? `→ ${pending}`
        : current ?? "…";
  const pullError = pullResult?.error ?? pullFailed;

  // The badge's tooltip: how to set the webhook up, or why it isn't connected.
  const webhookHelp =
    state?.webhook === "off"
      ? [
          "GitHub can't tell clawswap about new branches, so this list only updates now and then and before each switch or pull. To turn the webhook on:",
          "1. Run clawswap smee in the repo (makes a smee.io channel and prints its URL).",
          "2. In GitHub, repo Settings > Webhooks > Add webhook: that URL as Payload URL, content type application/json, and the events it lists.",
        ].join("\n")
      : `Not connected to smee.io${state?.webhookError ? ` (${state.webhookError})` : ""}; clawswap keeps retrying. The clawswap pane in zellij has the details. Until it's back, the list updates now and then and before each switch or pull.`;

  const listError = error ?? (sw?.phase === "failed" ? sw.error : undefined);
  const note = !error && sw?.phase === "done" ? sw.notes?.join(" ") : undefined;
  const base = state?.branches?.[0]?.branch;

  return (
    <div className="cs-bar">
      <div ref={ref} className="cs-branches">
        <button
          className={`cs-current${down ? " cs-down" : ""}${busy && !pulling ? " cs-busy" : ""}`}
          title={down ? "Run clawswap up in the repo to switch branches from here." : `On ${current}${state?.dirty ? " (uncommitted changes)" : ""}. Click to switch branch.`}
          onClick={() => {
            setOpen(!open);
            poll();
          }}
        >
          {busy && !pulling ? <Spinner label="Switching" /> : <span aria-hidden="true">⎇</span>}
          <span className="cs-truncate">{label}</span>
        </button>

        {!down && (
          <button
            className={`cs-pull ${pullError ? "cs-error" : behindBy > 0 ? "cs-info" : ""}`}
            disabled={busy || !state?.upstream}
            title={
              pullError ??
              (!state?.upstream
                ? `${current} isn't on GitHub`
                : behindBy
                  ? `Pull ${behindBy} new commit${behindBy === 1 ? "" : "s"} into ${current} and restart the dev server`
                  : `${current} is up to date with GitHub`)
            }
            onClick={pull}
          >
            {pulling ? (
              <span className="cs-pulling">
                <Spinner />
                {running?.step ? `Pulling: ${running.step}` : "Pulling"}
              </span>
            ) : (
              pullResult?.text ?? (pullFailed ? "Pull failed" : `↓ Pull${behindBy ? ` (${behindBy})` : ""}`)
            )}
          </button>
        )}

        {open && (
          <div className="cs-menu">
            <div className="cs-menu-head">
              <span className="cs-menu-title">
                Branches
                {!down && state && state.webhook !== "connected" && (
                  <span className="cs-badge" title={webhookHelp}>
                    {state.webhook === "off" ? "webhook off" : "webhook down"}
                  </span>
                )}
              </span>
              <span className="cs-menu-tools">
                {/* clawswap's own page: walkthroughs, the config editor, every project. */}
                {!down && (
                  <a href={CLAWSWAP_URL} target="_blank" rel="noopener noreferrer" title="Open clawswap's page">
                    ↗
                  </a>
                )}
                <button aria-label="Close" onClick={() => setOpen(false)}>
                  ✕
                </button>
              </span>
            </div>
            {down ? (
              <p className="cs-hint">
                Run <code>clawswap up</code> in the repo to switch branches from here.
              </p>
            ) : (
              <>
                <ul>
                  {(state?.branches ?? []).map((b) => {
                    const isCurrent = current === b.branch;
                    const behind = isCurrent && !!b.sha && state?.current?.sha !== b.sha;
                    const status = mergeStatus(b, base, !!state?.prs);
                    return (
                      <li key={b.branch}>
                        <button
                          className={`cs-row${isCurrent ? " cs-row-current" : ""}${target === b.branch ? " cs-row-target" : ""}`}
                          disabled={busy || (isCurrent && !behind)}
                          title={b.branch}
                          onClick={() => switchTo(b.branch)}
                        >
                          <span className={`cs-status ${status.cls}`} title={status.title} aria-label={status.title}>
                            {status.symbol}
                          </span>
                          {b.pr && <span className="cs-pr">#{b.pr.number}</span>}
                          <span className="cs-row-text">
                            <span className="cs-row-title">{b.pr?.title ?? b.branch}</span>
                            {isCurrent && (
                              <span className="cs-row-sub cs-success">
                                {behind ? "Current · new commits, click to update" : state?.dirty ? "Current · uncommitted changes" : "Current"}
                              </span>
                            )}
                            {running?.target === b.branch && <span className="cs-row-sub cs-warning">{running.step}</span>}
                          </span>
                          {target === b.branch && <Spinner />}
                        </button>
                      </li>
                    );
                  })}
                </ul>
                {listError && <p className="cs-foot cs-error">{listError}</p>}
                {note && <p className="cs-foot cs-muted">{note}</p>}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
