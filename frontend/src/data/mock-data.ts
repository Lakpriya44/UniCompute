import type { DemoState, HPCJob, JobSubmission } from "../types/hpc";
import { estimateCredits, STARTER_CREDITS } from "../lib/scheduler";

export const DEMO_USER = { id: "demo-researcher", name: "Alex Morgan", email: "alex.morgan@example.edu", role: "Researcher" as const, institution: "University Research Lab" };
export function createDemoState(now: number): DemoState {
  const workloads: JobSubmission[] = [
    { name: "Molecular dynamics simulation", workload: "Scientific simulation", cpu: 16, gpu: 1, ramGb: 32, runtimeMinutes: 60, description: "Sample molecular dynamics workload for the demo workspace.", simulateFailure: false },
    { name: "Neural network training", workload: "Machine learning", cpu: 8, gpu: 2, ramGb: 64, runtimeMinutes: 90, description: "Sample training workload. No actual model is executed.", simulateFailure: false },
    { name: "Genome sequence analysis", workload: "Data processing", cpu: 32, gpu: 0, ramGb: 128, runtimeMinutes: 45, description: "Completed example for job-history demonstrations.", simulateFailure: false },
    { name: "Climate model experiment", workload: "Scientific simulation", cpu: 16, gpu: 0, ramGb: 32, runtimeMinutes: 30, description: "Example of a simulated execution failure.", simulateFailure: true },
  ];
  const jobs: HPCJob[] = workloads.map((input, index) => {
    const submitted = now - (index + 1) * 3_600_000;
    const estimatedCredits = estimateCredits(input);
    return { ...input, id: `UC-DEMO-${1042 - index}`, status: input.simulateFailure ? "Failed" : "Completed", submittedAt: new Date(submitted).toISOString(), startedAt: new Date(submitted + 8000).toISOString(), finishedAt: new Date(submitted + (input.simulateFailure ? 30500 : 53000)).toISOString(), estimatedCredits, chargedCredits: input.simulateFailure ? estimatedCredits / 2 : estimatedCredits, progress: input.simulateFailure ? 50 : 100 };
  });
  return { version: 1, user: { ...DEMO_USER }, jobs, grants: [{ id: "starter", amount: STARTER_CREDITS, kind: "Starter credits", createdAt: new Date(now - 86_400_000).toISOString() }], lastTick: now };
}
