export const JOB_STATUSES = ["Pending", "Running", "Completed", "Failed", "Cancelled"] as const;
export type JobStatus = (typeof JOB_STATUSES)[number];
export const WORKLOADS = ["Machine learning", "Scientific simulation", "Data processing", "General computing"] as const;
export type WorkloadType = (typeof WORKLOADS)[number];

export interface User { id: string; name: string; email: string; role: "Researcher"; institution: string }
export interface JobSubmission {
  name: string;
  workload: WorkloadType;
  cpu: number;
  gpu: number;
  ramGb: number;
  runtimeMinutes: number;
  description: string;
  simulateFailure: boolean;
}
export interface HPCJob extends JobSubmission {
  id: string;
  status: JobStatus;
  submittedAt: string;
  startedAt: string | null;
  finishedAt: string | null;
  estimatedCredits: number;
  chargedCredits: number;
  progress: number;
}
export interface ResourceAvailability {
  cpu: { available: number; total: number };
  gpu: { available: number; total: number };
  ramGb: { available: number; total: number };
  cluster: "Operational";
  scheduler: "Mock Slurm";
  runningJobs: number;
  queuedJobs: number;
}
export interface CreditBalance { available: number; reserved: number; consumed: number; granted: number; starter: number }
export interface CreditGrant { id: string; amount: number; createdAt: string; kind: "Starter credits" | "Demo top-up" }
export interface DemoState { version: 1; user: User; jobs: HPCJob[]; grants: CreditGrant[]; lastTick: number }
export interface DashboardData {
  user: User;
  jobs: HPCJob[];
  resources: ResourceAvailability;
  credits: CreditBalance;
  grants: CreditGrant[];
  updatedAt: string;
  storageWarning: string | null;
}
/** Replace this adapter with authenticated NestJS REST calls; keep UI contracts stable. */
export interface HPCService {
  getDashboard(): Promise<DashboardData>;
  submitJob(submission: JobSubmission): Promise<HPCJob>;
  cancelJob(id: string): Promise<void>;
  addDemoCredits(amount: number): Promise<void>;
}
