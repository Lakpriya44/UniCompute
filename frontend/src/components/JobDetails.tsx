"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Info, AlertCircle } from "lucide-react";
import { useHPC } from "./HPCProvider";
import { EmptyState, Loading, PageHeading, Panel, StatusBadge } from "./ui";
import { credits, dateTime, runtime } from "@/lib/format";
import { isActive } from "@/lib/scheduler";
import { hpcService } from "@/services/mock-hpc-service";

export default function JobDetails({ id }: { id: string }) {
  const { data, refresh } = useHPC();
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  if (!data) return <Loading />;
  const job = data.jobs.find(item => item.id === id);
  if (!job) return <EmptyState title="Job not found" description="This ID is not in this browser’s demo history. It may belong to a different local workspace." href="/jobs" action="Back to My Jobs" />;
  async function cancel() {
    if (busy) return;
    setBusy(true);
    try { await hpcService.cancelJob(id); await refresh(); setMessage("Job cancelled. Unused reserved credits have been released."); setError(false); }
    catch (e) { setMessage(e instanceof Error ? e.message : "Unable to cancel this job."); setError(true); }
    finally { setBusy(false); setConfirm(false); }
  }
  return <><Link href="/jobs" className="text-link back-link"><ArrowLeft size={14} /> Back to My Jobs</Link><PageHeading title={job.name} description={job.id}><StatusBadge status={job.status} /></PageHeading>
    <div className="notice"><Info size={18} /><p><strong>Simulated execution.</strong> This page shows mock scheduler events, not actual HPC logs or measurements. Execution is compressed into 45 seconds; the requested wall time determines the estimate.</p></div>
    {message && <div className={`notice ${error ? "error" : "success"}`} role={error ? "alert" : "status"}>{message}</div>}
    {confirm && <div className="notice" role="alert"><AlertCircle size={18} /><div><strong>Cancel this job?</strong><p>It cannot be resumed. Unused reserved credits will return to your wallet.</p><div className="hero-actions"><button className="button danger" disabled={busy} onClick={() => void cancel()}>Confirm cancellation</button><button className="button" disabled={busy} onClick={() => setConfirm(false)}>Keep job</button></div></div></div>}
    <div className="split-layout"><div className="stack"><Panel title="Job overview" description="Requested configuration"><div className="panel-body"><dl className="detail-list">{[["Workload type", job.workload], ["Partition", job.gpu ? "GPU compute (simulated)" : "CPU compute (simulated)"], ["CPU cores", job.cpu], ["GPUs", job.gpu], ["Memory", `${job.ramGb} GB`], ["Requested wall time", runtime(job.runtimeMinutes)], ["Submitted · SLST", dateTime(job.submittedAt)], ["Finished · SLST", job.finishedAt ? dateTime(job.finishedAt) : "Not finished"]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>{job.description && <><hr className="rule" /><p className="muted break-word">{job.description}</p></>}</div></Panel>
      <Panel title="Execution progress" description="Mock scheduler timeline"><div className="panel-body"><div className="cluster-row"><span>{job.status === "Pending" ? "Waiting for available resources" : `${job.status} · Simulated progress`}</span><strong>{job.progress}%</strong></div><div className="progress-track" role="progressbar" aria-label="Mock execution progress" aria-valuenow={job.progress} aria-valuemin={0} aria-valuemax={100}><span style={{ width: `${job.progress}%` }} /></div><ol className="timeline"><li className="done"><strong>Submitted to mock queue</strong><small>{dateTime(job.submittedAt)} SLST</small></li><li className={job.startedAt ? "done" : ""}><strong>{job.startedAt ? "Resources allocated · Execution started" : job.status === "Cancelled" ? "Execution skipped" : "Awaiting resources"}</strong><small>{job.startedAt ? `${dateTime(job.startedAt)} SLST` : "Jobs wait at least 8 seconds and start in queue order."}</small></li><li className={job.finishedAt ? "done" : ""}><strong>{job.finishedAt ? job.status : "Awaiting completion"}</strong><small>{job.finishedAt ? `${dateTime(job.finishedAt)} SLST` : "The scheduler updates automatically."}</small></li></ol>{job.status === "Failed" && <div className="info-note"><AlertCircle size={16} />The demo failure scenario stopped execution at 50%. Half of the estimated credits were consumed; the rest were released.</div>}</div></Panel></div>
      <div className="stack"><Panel title="Credit summary"><div className="panel-body"><div className="cluster-row"><span>Estimated credits</span><strong>{credits(job.estimatedCredits)} cr</strong></div><div className="cluster-row"><span>Currently reserved</span><strong>{credits(isActive(job) ? job.estimatedCredits : 0)} cr</strong></div><div className="cluster-row"><span>Credits consumed</span><strong>{credits(job.chargedCredits)} cr</strong></div><hr className="rule" /><Link href="/credits" className="text-link">View Credit Wallet</Link></div></Panel><Panel title="Job actions"><div className="panel-body">{isActive(job) ? <><p className="muted">You can cancel a pending or running job.</p><button className="button danger" disabled={busy} onClick={() => setConfirm(true)}>Cancel job</button></> : <><p className="muted">This job has finished. Start another workload when you’re ready.</p><Link href="/jobs/new" className="button primary">Submit a new job</Link></>}</div></Panel></div>
    </div>
  </>;
}
