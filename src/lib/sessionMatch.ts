/**
 * The visitor's explicit choice in Section 02, read by Section 03.
 *
 * `null` (the default) means no choice: all four sessions in full colour.
 * Otherwise the named sessions are the matches and the others are greyed.
 * Only explicit actions call `chooseSessions`; hovering, focusing or opening
 * a mirror never does. A new choice replaces the previous one.
 */
import { useSyncExternalStore } from "react";

let matches: readonly string[] | null = null;
const listeners = new Set<() => void>();

/** An explicit choice in Section 02: set the matches and show Section 03. */
export function chooseSessions(next: readonly string[] | null) {
  matches = next;
  listeners.forEach((listener) => listener());
  window.dispatchEvent(new CustomEvent(SHOW_SESSIONS_EVENT, { detail: next?.[0] ?? null }));
}

/** The current matches, outside React (for scroll-driven code). */
export const getSessionMatches = () => matches;

/** Subscribe outside React; returns the unsubscribe function. */
export function subscribeSessionMatches(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useSessionMatches() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => matches,
  );
}

/** True when a choice exists and this session is not one of its matches. */
export const isMuted = (name: string, current: readonly string[] | null) =>
  current !== null && !current.includes(name);

/** Fired with the first match's name; Section 03 brings itself into view. */
export const SHOW_SESSIONS_EVENT = "komo:show-sessions";
