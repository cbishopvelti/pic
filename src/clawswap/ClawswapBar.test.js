import { act, fireEvent, render, screen } from "@testing-library/react";
import ClawswapBar from "./ClawswapBar";

const state = (sw, behind = 2) => ({ current: { branch: "master" }, upstream: { behind }, dirty: false, branches: [], switch: sw });
const answer = (body, ok = true) => Promise.resolve({ ok, status: ok ? 200 : 409, statusText: "", json: () => Promise.resolve(body) });

let reload;
let replies;
// What GET /state answers now.
let server;

beforeEach(() => {
  jest.useFakeTimers();
  reload = jest.fn();
  delete window.location;
  window.location = { reload };
  replies = [];
  server = state(null);
  global.fetch = jest.fn((url, opts) => {
    const next = opts?.method === "POST" && replies.shift();
    return next ? next(url, opts) : answer(server);
  });
});

afterEach(() => jest.useRealTimers());

const flush = () => act(() => Promise.resolve().then(() => {}));

test("Pull shows a spinner from the click until the pull is done, then reloads the page", async () => {
  let answerPull;
  server = state({ phase: "done", target: "master", doneAt: 1 });
  render(<ClawswapBar />);
  await flush();
  await flush();

  const button = screen.getByRole("button", { name: /Pull \(2\)/ });
  replies.push(() => new Promise((resolve) => (answerPull = resolve)));
  fireEvent.click(button);
  expect(button).toHaveAttribute("aria-busy", "true");
  expect(button).toHaveTextContent("Pulling…");
  expect(button.querySelector(".cs-spinner")).not.toBeNull();

  // clawswap answers once it has fetched: running, with no doneAt.
  server = state({ phase: "running", pull: true, target: "master", step: "Checking out master" });
  await act(async () => answerPull(await answer(server)));
  await flush();
  expect(button).toHaveTextContent("Pulling…");
  expect(reload).not.toHaveBeenCalled();

  // The next poll finds it done, with a new doneAt.
  server = state({ phase: "done", pull: true, target: "master", doneAt: 2 }, 0);
  await act(async () => jest.advanceTimersByTime(2000));
  await flush();
  expect(reload).toHaveBeenCalledTimes(1);
});

test("a pull with nothing new says so and doesn't reload", async () => {
  render(<ClawswapBar />);
  await flush();
  await flush();

  server = state({ phase: "done", pull: true, target: "master", notes: ["Already up to date"] }, 0);
  replies.push(() => answer(server));
  fireEvent.click(screen.getByRole("button", { name: /Pull/ }));
  await flush();
  await flush();
  expect(screen.getByText("Already up to date")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /^Pull$/ })).toHaveAttribute("aria-busy", "false");
  expect(reload).not.toHaveBeenCalled();
});
