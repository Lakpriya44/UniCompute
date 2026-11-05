import { createDemoState } from "../data/mock-data";
import { advanceScheduler, cancelInScheduler, creditBalance, resourceAvailability, submitToScheduler, validateSubmission } from "../lib/scheduler";
import { JOB_STATUSES, type DemoState, type HPCJob, type HPCService, type JobSubmission } from "../types/hpc";

export const STORAGE_KEY = "unicompute.demo.v1";
const validDate = (value: unknown): value is string => typeof value === "string" && Number.isFinite(Date.parse(value));
export function isDemoState(value: unknown): value is DemoState {
  if (!value || typeof value !== "object") return false;
  const s = value as DemoState;
  if (s.version !== 1 || !Number.isFinite(s.lastTick) || !s.user || typeof s.user.name !== "string" || typeof s.user.email !== "string" || typeof s.user.institution !== "string" || s.user.role !== "Researcher" || !Array.isArray(s.jobs) || !Array.isArray(s.grants)) return false;
  if (!s.grants.every(g => g && typeof g.id === "string" && Number.isFinite(g.amount) && g.amount > 0 && validDate(g.createdAt) && ["Starter credits", "Demo top-up"].includes(g.kind))) return false;
  if (!s.jobs.every(j => j && typeof j.id === "string" && typeof j.name === "string" && typeof j.description === "string" && typeof j.simulateFailure === "boolean" && Object.keys(validateSubmission(j, Infinity)).length === 0 && JOB_STATUSES.includes(j.status) && validDate(j.submittedAt) && (j.startedAt === null || validDate(j.startedAt)) && (j.finishedAt === null || validDate(j.finishedAt)) && Number.isFinite(j.estimatedCredits) && j.estimatedCredits >= 0 && Number.isFinite(j.chargedCredits) && j.chargedCredits >= 0 && j.chargedCredits <= j.estimatedCredits && Number.isFinite(j.progress) && j.progress >= 0 && j.progress <= 100 && (j.status !== "Running" || j.startedAt !== null))) return false;
  return new Set(s.jobs.map(j => j.id)).size === s.jobs.length && creditBalance(s).available >= 0;
}

/** Browser-only storage is accessed on demand, never during server rendering. */
export class MockHPCService implements HPCService {
  private memory: DemoState | null = null;
  private warning: string | null = null;
  private volatile = false;

  private read(): DemoState {
    if (typeof window === "undefined") throw new Error("The demo service is available in the browser only.");
    if (this.volatile && this.memory) return this.memory;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (isDemoState(parsed)) return parsed;
        this.warning = "Saved demo data is incompatible. A fresh demo workspace has been started.";
      }
    } catch {
      this.warning = "Browser storage is unavailable or unreadable. Changes are kept for this session only.";
      this.volatile = true;
    }
    return this.memory ?? createDemoState(Date.now());
  }
  private write(state: DemoState) {
    this.memory = state;
    if (this.volatile) return;
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
    catch { this.volatile = true; this.warning = "Browser storage is full or blocked. Changes are kept for this session only."; }
  }
  private async transaction<T>(fn: (state: DemoState, now: number) => { state: DemoState; value: T }): Promise<T> {
    const run = () => {
      const now = Date.now();
      const result = fn(this.read(), now);
      this.write(result.state);
      return result.value;
    };
    // Serialize wallet mutations across tabs when Web Locks is supported.
    if (typeof navigator !== "undefined" && navigator.locks) return navigator.locks.request(STORAGE_KEY, run);
    return run();
  }
  async getDashboard() {
    const state = await this.transaction((source, now) => { const state = advanceScheduler(source, now); return { state, value: state }; });
    return { user: state.user, jobs: state.jobs, grants: state.grants, credits: creditBalance(state), resources: resourceAvailability(state.jobs), updatedAt: new Date(state.lastTick).toISOString(), storageWarning: this.warning };
  }
  async submitJob(input: JobSubmission): Promise<HPCJob> {
    return this.transaction((source, now) => {
      const id = `UC-${crypto.randomUUID().toUpperCase()}`;
      const result = submitToScheduler(source, input, id, now);
      return { state: result.state, value: result.job };
    });
  }
  async cancelJob(id: string) { await this.transaction((source, now) => ({ state: cancelInScheduler(source, id, now), value: undefined })); }
  async addDemoCredits(amount: number) {
    if (![100, 250, 500].includes(amount)) throw new Error("Choose one of the available demo credit amounts.");
    await this.transaction((source, now) => ({ state: { ...advanceScheduler(source, now), grants: [...source.grants, { id: crypto.randomUUID(), amount, createdAt: new Date(now).toISOString(), kind: "Demo top-up" }] }, value: undefined }));
  }
}
export const hpcService: HPCService = new MockHPCService();
