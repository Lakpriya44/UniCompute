import Link from "next/link";
import type { HPCJob } from "@/types/hpc";
import { credits, dateTime, runtime, shortId } from "@/lib/format";
import { isActive } from "@/lib/scheduler";
import { StatusBadge, EmptyState } from "./ui";

export default function JobsTable({ jobs, compact = false, onCancel, busy }: { jobs: HPCJob[]; compact?: boolean; onCancel?: (job: HPCJob) => void; busy?: boolean }) {
  if (!jobs.length) return <EmptyState title="No jobs to show" description="Try a different search or submit your first computing job." href="/jobs/new" action="Submit a job" />;
  return <div className="table-wrap" tabIndex={0} role="region" aria-label={compact ? "Recent jobs table" : "Job history table"}><table className="job-table"><thead><tr><th scope="col">Job name / ID</th><th scope="col">Status</th>{compact ? <th scope="col">Resources</th> : <><th scope="col">CPU</th><th scope="col">GPU</th><th scope="col">RAM</th><th scope="col">Wall time</th></>}<th scope="col">Submitted · SLST</th>{!compact && <><th scope="col">Estimate</th><th scope="col">Actions</th></>}</tr></thead><tbody>{jobs.map(job => <tr key={job.id}><td><Link className="job-name" href={`/jobs/${job.id}`}>{job.name}</Link><span className="subtext mono" title={job.id}>{shortId(job.id)}</span></td><td><StatusBadge status={job.status} /></td>{compact ? <td>{job.cpu} CPU · {job.gpu} GPU<span className="subtext">{job.ramGb} GB RAM</span></td> : <><td>{job.cpu}</td><td>{job.gpu}</td><td>{job.ramGb} GB</td><td>{runtime(job.runtimeMinutes)}</td></>}<td>{dateTime(job.submittedAt)}</td>{!compact && <><td>{credits(job.estimatedCredits)} cr</td><td><div className="inline-actions"><Link className="text-link" href={`/jobs/${job.id}`} aria-label={`View ${job.name}`}>Details</Link>{isActive(job) && onCancel && <button className="button small danger" onClick={() => onCancel(job)} disabled={busy} aria-label={`Cancel ${job.name}`}>Cancel</button>}</div></td></>}</tr>)}</tbody></table></div>;
}
