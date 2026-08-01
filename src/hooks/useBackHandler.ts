import { useEffect, useRef } from 'react';
import { BACK_PRIORITY, registerBackHandler } from '../lib/backButton';

/**
 * Register an Android back-button handler while `active` is true.
 *
 * The handler typically closes the screen/overlay it belongs to (e.g.
 * `() => setSelectedChapterId(null)`). While no handler is active on the home
 * screen, the back press falls through and exits the app.
 *
 * @param active   whether this screen is currently open
 * @param handler  what to do when back is pressed (usually: go back one level)
 * @param priority higher runs first; defaults to a detail-screen level
 */
export function useBackHandler(
  active: boolean,
  handler: () => void,
  priority: number = BACK_PRIORITY.screen
) {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    if (!active) return;
    return registerBackHandler(priority, () => handlerRef.current());
  }, [active, priority]);
}
