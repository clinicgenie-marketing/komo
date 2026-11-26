/**
 * The outlet selected in Section 06 (Visit KOMO), read by Section 08
 * (Arrange your visit) to show that outlet's own action. Orchard by default.
 */
import { useSyncExternalStore } from "react";
import type { OutletId } from "@/content/outlets";

let outlet: OutletId = "orchard";
const listeners = new Set<() => void>();

export function setActiveOutlet(next: OutletId) {
  if (next === outlet) return;
  outlet = next;
  listeners.forEach((listener) => listener());
}

export function useActiveOutlet() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => outlet,
  );
}
