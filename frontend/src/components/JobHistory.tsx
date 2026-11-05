"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, AlertCircle, CheckCircle2 } from "lucide-react";
import { useHPC } from "./HPCProvider";
import { Loading, PageHeading, Panel } from "./ui";
import JobsTable from "./JobsTable";
import { hpcService } from "@/services/mock-hpc-service";
import { JOB_STATUSES, type HPCJob } from "@/types/hpc";

export default function JobHistory() {
  const { data, refresh } = useHPC();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All statuses");
  const [target, setTarget] = useState<HPCJob | null>(null);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; error: boolean } | null>(null);
  async function cancel() {
    if (!target || busy) return;
    setBusy(true); setFeedback(null);
    try { await hpcService.cancelJob(target.id); await refresh(); setFeedback({ message: `${target.name} was cancelled. Unused reserved credits have been released.`, error: false }); }
    catch (e) { setFeedback({ message: e instanceof Error ? e.message : "Could not cancel the job.", error: true }); }
    finally { setTarget(null); setBusy(false); }
  }
  if (!data) return <Loading />;
  const jobs = data.jobs.filter(job => (status === "All statuses" || job.status === status) && `${job.name} ${job.id}`.toLowerCase().includes(query.toLowerCase().trim()));
  return <><PageHeading title="My Jobs" description="Track, manage, and revisit your computing workloads."><Link className="button primary" href="/jobs/new"><Plus size={16} /> Submit Job</Link></PageHeading>
    <div className="stats-strip">{JOB_STATUSES.map(s => <div className="mini-stat" key={s}><small>{s}</small><strong>{data.jobs.filter(j => j.status === s).length}</strong></div>)}</div>
    {feedback && <div className={`notice ${feedback.error ? "error" : "success"}`} role={feedback.error ? "alert" : "status"}>{feedback.error ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}{feedback.message}</div>}
    {target && <div className="notice" role="alert"><AlertCircle size={18} /><div><strong>Cancel {target.name}?</strong><p>This stops the demo job and releases unused reserved credits. This job cannot be resumed.</p><div className="hero-actions"><button className="button danger" disabled={busy} onClick={() => void cancel()}>{busy ? "Cancelling…" : "Confirm cancellation"}</button><button className="button" disabled={busy} onClick={() => setTarget(null)}>Keep job</button></div></div></div>}
    <Panel title="Job history" description="All jobs in your local demo workspace"><div className="filter-bar"><div className="search-box"><Search size={15} /><label className="sr-only" htmlFor="job-search">Search jobs</label><input className="search-input" id="job-search" placeholder="Search by job name or ID…" value={query} onChange={e => setQuery(e.target.value)} /></div><label><span className="sr-only">Filter by status</span><select className="filter-select" value={status} onChange={e => setStatus(e.target.value)}><option>All statuses</option>{JOB_STATUSES.map(s => <option key={s}>{s}</option>)}</select></label></div><JobsTable jobs={jobs} onCancel={setTarget} busy={busy} /><div className="panel-footer">Showing {jobs.length} of {data.jobs.length} jobs · Times shown in Sri Lanka Standard Time · Simulated data</div></Panel>
  </>;
}
