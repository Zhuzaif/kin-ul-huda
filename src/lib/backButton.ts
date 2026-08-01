// Central registry for the Android hardware back button.
//
// This app navigates entirely through React state (no router / no browser
// history), so inside the Capacitor WebView the hardware back button has
// nothing to "go back" to and Android exits the app on the very first press.
//
// Screens register a handler here while they are open. On a back press we run
// the most relevant handler (highest priority, then most recently opened) so
// the back button closes the top-most screen instead of quitting the app.

type BackHandlerEntry = {
  id: number;
  priority: number;
  handler: () => void;
};

let entries: BackHandlerEntry[] = [];
let nextId = 1;

// Higher priority wins. Deep overlays/modals sit above tab-level navigation.
export const BACK_PRIORITY = {
  tab: 1, // switching a bottom-nav tab back to home
  screen: 10, // a detail / reading screen pushed on top of a tab
  modal: 20, // a modal / dialog on top of everything
};

export function registerBackHandler(priority: number, handler: () => void): () => void {
  const id = nextId++;
  entries.push({ id, priority, handler });
  return () => {
    entries = entries.filter((entry) => entry.id !== id);
  };
}

// Runs the top-most handler. Returns true when a handler consumed the press,
// false when there is nothing left to close (caller may then exit the app).
export function runBackHandlers(): boolean {
  if (entries.length === 0) return false;
  const [top] = [...entries].sort(
    (a, b) => b.priority - a.priority || b.id - a.id
  );
  top.handler();
  return true;
}
