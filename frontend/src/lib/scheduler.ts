import { WORKLOADS, type CreditBalance, type DemoState, type HPCJob, type JobSubmission, type ResourceAvailability } from "../types/hpc";

export const LIMITS = { cpu: 64, gpu: 4, ramGb: 256, runtimeMinutes: 1440 } as const;
export const CAPACITY = { cpu: 128, gpu: 8, ramGb: 512 } as const;
export const RATES = { cpu: 0.5, gpu: 8, ramGb: 0.05 } as const;
export const QUEUE_DELAY_MS = 8_000;
export const EXECUTION_MS = 45_000;
export const STARTER_CREDITS = 250;
export const roundCredits = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;
export const isActive = (job: HPCJob) => job.status === "Pending" || job.status === "Running";
export function estimateCredits(input: Pick<JobSubmission, "cpu" | "gpu" | "ramGb" | "runtimeMinutes">): number {
  return roundCredits((input.cpu * RATES.cpu + input.gpu * RATES.gpu + input.ramGb * RATES.ramGb) * input.runtimeMinutes / 60);
}
export function creditBalance(state: DemoState): CreditBalance {
  const granted = roundCredits(state.grants.reduce((n, grant) => n + grant.amount, 0));
  const reserved = roundCredits(state.jobs.filter(isActive).reduce((n, job) => n + job.estimatedCredits, 0));
  const consumed = roundCredits(state.jobs.reduce((n, job) => n + job.chargedCredits, 0));
  return { granted, reserved, consumed, available: roundCredits(granted - reserved - consumed), starter: STARTER_CREDITS };
}
export function resourceAvailability(jobs: HPCJob[]): ResourceAvailability {
  const running = jobs.filter(job => job.status === "Running");
  const available = (key: keyof typeof CAPACITY) => ({ total: CAPACITY[key], available: CAPACITY[key] - running.reduce((n, job) => n + job[key], 0) });
  return { cpu: available("cpu"), gpu: available("gpu"), ramGb: available("ramGb"), cluster: "Operational", scheduler: "Mock Slurm", runningJobs: running.length, queuedJobs: jobs.filter(j => j.status === "Pending").length };
}
export type SubmissionErrors = Partial<Record<keyof JobSubmission | "balance", string>>;
export function validateSubmission(input: JobSubmission, balance: number): SubmissionErrors {
  const errors: SubmissionErrors = {};
  if (!input.name.trim() || input.name.trim().length > 80) errors.name = "Enter a job name between 1 and 80 characters.";
  if (!WORKLOADS.includes(input.workload)) errors.workload = "Select a workload type.";
  if (input.description.length > 500) errors.description = "Keep the description within 500 characters.";
  for (const key of Object.keys(LIMITS) as (keyof typeof LIMITS)[]) {
    const min = key === "gpu" ? 0 : 1;
    if (!Number.isInteger(input[key]) || input[key] < min || input[key] > LIMITS[key]) errors[key] = `Enter a whole number from ${min} to ${LIMITS[key]}.`;
  }
  if (Object.keys(errors).length === 0 && estimateCredits(input) > balance) errors.balance = "Insufficient credits. Reduce the requested resources or add demo credits in your wallet.";
  return errors;
}

/** Chronological event replay keeps queue capacity and billing correct even after the tab was closed. */
export function advanceScheduler(source: DemoState, now: number): DemoState {
  const state = { ...source, jobs: source.jobs.map(job => ({ ...job })), lastTick: Math.max(now, source.lastTick) };
  const end = state.lastTick;
  let eventTime = source.lastTick;
  for (;;) {
    for (const job of state.jobs) {
      if (job.status !== "Running" || !job.startedAt) continue;
      const finish = Date.parse(job.startedAt) + EXECUTION_MS * (job.simulateFailure ? 0.5 : 1);
      if (finish <= eventTime) {
        job.status = job.simulateFailure ? "Failed" : "Completed";
        job.finishedAt = new Date(finish).toISOString();
        job.progress = job.simulateFailure ? 50 : 100;
        job.chargedCredits = roundCredits(job.estimatedCredits * (job.simulateFailure ? 0.5 : 1));
      }
    }
    // History is newest first. Reverse before the stable sort so equal timestamps keep submission order.
    const pending = state.jobs.filter(j => j.status === "Pending").reverse().sort((a, b) => a.submittedAt.localeCompare(b.submittedAt));
    for (const job of pending) {
      if (Date.parse(job.submittedAt) + QUEUE_DELAY_MS > eventTime) break;
      const available = resourceAvailability(state.jobs);
      if (job.cpu > available.cpu.available || job.gpu > available.gpu.available || job.ramGb > available.ramGb.available) break;
      job.status = "Running";
      job.startedAt = new Date(eventTime).toISOString();
    }
    const futureEvents = state.jobs.flatMap(job => {
      if (job.status === "Running" && job.startedAt) return [Date.parse(job.startedAt) + EXECUTION_MS * (job.simulateFailure ? 0.5 : 1)];
      if (job.status === "Pending") return [Date.parse(job.submittedAt) + QUEUE_DELAY_MS];
      return [];
    }).filter(time => time > eventTime && time <= end);
    if (futureEvents.length === 0) break;
    eventTime = Math.min(...futureEvents);
  }
  for (const job of state.jobs) {
    if (job.status === "Running" && job.startedAt) job.progress = Math.min(99, Math.max(0, Math.floor((end - Date.parse(job.startedAt)) / EXECUTION_MS * 100)));
  }
  return state;
}
export function submitToScheduler(source: DemoState, input: JobSubmission, id: string, now: number): { state: DemoState; job: HPCJob } {
  const state = advanceScheduler(source, now);
  const errors = validateSubmission(input, creditBalance(state).available);
  if (Object.keys(errors).length) throw new Error(Object.values(errors)[0]);
  if (state.jobs.some(job => job.id === id)) throw new Error("Duplicate job ID. Please try again.");
  const job: HPCJob = { ...input, name: input.name.trim(), description: input.description.trim(), id, status: "Pending", submittedAt: new Date(state.lastTick).toISOString(), startedAt: null, finishedAt: null, estimatedCredits: estimateCredits(input), chargedCredits: 0, progress: 0 };
  return { state: { ...state, jobs: [job, ...state.jobs] }, job };
}
export function cancelInScheduler(source: DemoState, id: string, now: number): DemoState {
  const state = advanceScheduler(source, now);
  const job = state.jobs.find(item => item.id === id);
  if (!job) throw new Error("This job could not be found.");
  if (!isActive(job)) throw new Error("Only pending or running jobs can be cancelled.");
  const fraction = job.startedAt ? Math.min(1, Math.max(0, (state.lastTick - Date.parse(job.startedAt)) / EXECUTION_MS)) : 0;
  job.chargedCredits = roundCredits(job.estimatedCredits * fraction);
  job.progress = Math.floor(fraction * 100);
  job.status = "Cancelled";
  job.finishedAt = new Date(state.lastTick).toISOString();
  // Free resources immediately and admit the next eligible waiting job.
  return advanceScheduler(state, state.lastTick);
}
