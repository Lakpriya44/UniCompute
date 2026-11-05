"use client";

import { createContext, useCallback, useContext, useEffect, useState, useSyncExternalStore } from "react";
import type { DashboardData } from "@/types/hpc";
import { hpcService } from "@/services/mock-hpc-service";

const HPCContext = createContext<{ data: DashboardData | null; error: string | null; refresh: () => Promise<void> } | null>(null);
const subscribeHydration = () => () => {};
const clientHydrated = () => true;
const serverHydrated = () => false;
export function HPCProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const refresh = useCallback(async () => {
    try { setData(await hpcService.getDashboard()); setError(null); }
    catch (e) { setError(e instanceof Error ? e.message : "Unable to load the demo workspace."); }
  }, []);
  useEffect(() => {
    let active = true;
    let busy = false;
    const poll = async () => {
      if (busy) return;
      busy = true;
      try { const next = await hpcService.getDashboard(); if (active) { setData(next); setError(null); } }
      catch (e) { if (active) setError(e instanceof Error ? e.message : "Unable to load the demo workspace."); }
      finally { busy = false; }
    };
    void poll();
    const timer = window.setInterval(() => { void poll(); }, 1000);
    return () => { active = false; window.clearInterval(timer); };
  }, []);
  return <HPCContext.Provider value={{ data, error, refresh }}>{children}</HPCContext.Provider>;
}
export function useHPC() {
  const context = useContext(HPCContext);
  // Each streamed Suspense boundary must hydrate with the same empty snapshot as the server,
  // even if the provider has already loaded localStorage while that boundary was deferred.
  const hydrated = useSyncExternalStore(subscribeHydration, clientHydrated, serverHydrated);
  if (!context) throw new Error("useHPC must be used within HPCProvider.");
  return { ...context, data: hydrated ? context.data : null, error: hydrated ? context.error : null };
}
