"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowRight, CheckCircle2, Info, Plus, Wallet, AlertCircle } from "lucide-react";
import { useHPC } from "./HPCProvider";
import { Loading, PageHeading, Panel } from "./ui";
import { hpcService } from "@/services/mock-hpc-service";
import { estimateCredits, LIMITS, RATES, validateSubmission, type SubmissionErrors } from "@/lib/scheduler";
import { credits } from "@/lib/format";
import { WORKLOADS, type HPCJob, type JobSubmission } from "@/types/hpc";

const initialForm = { name: "", workload: "", cpu: "4", gpu: "0", ramGb: "8", runtimeMinutes: "60", description: "", simulateFailure: false };
export default function SubmitJob() {
  const { data, refresh } = useHPC();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<SubmissionErrors>({});
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [created, setCreated] = useState<HPCJob | null>(null);
  const submitting = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);
  const submission: JobSubmission = { ...form, workload: form.workload as JobSubmission["workload"], cpu: form.cpu === "" ? NaN : Number(form.cpu), gpu: form.gpu === "" ? NaN : Number(form.gpu), ramGb: form.ramGb === "" ? NaN : Number(form.ramGb), runtimeMinutes: form.runtimeMinutes === "" ? NaN : Number(form.runtimeMinutes) };
  const rawEstimate = estimateCredits(submission);
  const validNumbers = Object.keys(LIMITS).every(key => { const k = key as keyof typeof LIMITS; return Number.isInteger(submission[k]) && submission[k] >= (k === "gpu" ? 0 : 1) && submission[k] <= LIMITS[k]; });
  const estimate = validNumbers && Number.isFinite(rawEstimate) ? rawEstimate : null;
  function update(key: keyof typeof form, value: string | boolean) { setForm(current => ({ ...current, [key]: value })); setErrors(current => ({ ...current, [key]: undefined, balance: undefined })); setMessage(""); }
  async function submit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!data || submitting.current) return;
    const nextErrors = validateSubmission(submission, data.credits.available);
    setErrors(nextErrors); setMessage("");
    if (Object.keys(nextErrors).length) { requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>("[aria-invalid='true']")?.focus()); return; }
    submitting.current = true; setBusy(true);
    try { const job = await hpcService.submitJob(submission); await refresh(); setCreated(job); }
    catch (e) { setMessage(e instanceof Error ? e.message : "Submission failed. Please try again."); }
    finally { submitting.current = false; setBusy(false); }
  }
  if (!data) return <Loading />;
  if (created) return <><PageHeading title="Job submitted" description="Your research workload has been added to the mock queue." /><div className="notice success" role="status"><CheckCircle2 size={21} /><div><strong>{created.name} was submitted successfully.</strong><p>Job ID: <span className="mono break-word">{created.id}</span></p><p>{credits(created.estimatedCredits)} credits reserved. Track the live simulated status in Job Details.</p><div className="hero-actions"><Link className="button primary" href={`/jobs/${created.id}`}>View Job Details <ArrowRight size={15} /></Link><Link className="button" href="/jobs">My Jobs</Link></div></div></div><button className="button" onClick={() => { setCreated(null); setForm(initialForm); setErrors({}); }}><Plus size={15} /> Submit another job</button></>;
  const numericFields = [{ key: "cpu", label: "CPU cores", help: "1–64 cores per job" }, { key: "gpu", label: "GPUs", help: "0–4 GPUs; choose 0 for CPU-only jobs" }, { key: "ramGb", label: "Memory (GB)", help: "1–256 GB per job" }, { key: "runtimeMinutes", label: "Wall time (minutes)", help: "1–1,440 minutes (24 hours maximum)" }] as const;
  return <>
    <PageHeading title="Submit HPC Job" description="Configure your workload. We’ll take care of the queue." />
    <div className="notice"><Info size={17} /><p><strong>You’re in the Mock Slurm environment.</strong> Jobs queue for at least 8 seconds, then simulate execution in 45 seconds. Requested wall time is used for the credit estimate; no real computing takes place.</p></div>
    {(message || errors.balance) && <div className="notice error" role="alert"><AlertCircle size={17} />{message || errors.balance}</div>}
    <form noValidate onSubmit={submit} ref={formRef} className="split-layout">
      <div className="stack">
        <Panel title="Job configuration" description="Tell us what you want to compute"><div className="panel-body"><h3 className="form-section-title"><span className="step-number">1</span> Workload details</h3><div className="form-grid">
          <div className="field full"><label htmlFor="job-name">Job name <span className="muted">*</span></label><input id="job-name" value={form.name} onChange={e => update("name", e.target.value)} placeholder="e.g. Protein folding simulation" maxLength={80} required aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} />{errors.name && <small id="name-error" className="field-error">{errors.name}</small>}</div>
          <div className="field full"><label htmlFor="workload">Workload type <span className="muted">*</span></label><select id="workload" value={form.workload} onChange={e => update("workload", e.target.value)} required aria-invalid={!!errors.workload} aria-describedby={errors.workload ? "workload-error" : undefined}><option value="">Select your workload</option>{WORKLOADS.map(w => <option key={w}>{w}</option>)}</select>{errors.workload && <small id="workload-error" className="field-error">{errors.workload}</small>}</div>
          <div className="field full"><label htmlFor="description">Description <span className="muted">(optional)</span></label><textarea id="description" value={form.description} onChange={e => update("description", e.target.value)} placeholder="A short note about your experiment…" maxLength={500} /><small>{form.description.length}/500 characters</small></div>
        </div></div></Panel>
        <Panel title="Resource allocation" description="Choose the resources your workload needs"><div className="panel-body"><h3 className="form-section-title"><span className="step-number">2</span> Compute requirements</h3><div className="form-grid">{numericFields.map(({ key, label, help }) => <div className="field" key={key}><label htmlFor={key}>{label} <span className="muted">*</span></label><input id={key} type="number" min={key === "gpu" ? 0 : 1} max={LIMITS[key]} step={1} value={form[key]} onChange={e => update(key, e.target.value)} required aria-invalid={!!errors[key]} aria-describedby={`${key}-hint`} /><small id={`${key}-hint`} className={errors[key] ? "field-error" : ""}>{errors[key] ?? help}</small></div>)}</div><hr className="rule" /><label className="check-field"><input type="checkbox" checked={form.simulateFailure} onChange={e => update("simulateFailure", e.target.checked)} /><span>Simulate a failed job <span className="muted">(optional demo scenario: stops halfway and releases unused credits)</span></span></label><div className="form-actions"><small>Credits are reserved when you submit.</small><button className="button primary" type="submit" disabled={busy}>{busy ? "Submitting…" : "Submit Job"}<ArrowRight size={16} /></button></div></div></Panel>
      </div>
      <aside className="estimate-panel"><Panel title="Estimated cost" description="Pay only for the resources you request" action={<Wallet size={18} />}><div className="panel-body"><p className="muted">Estimated credit consumption</p><p className="estimate-total">{estimate === null ? "—" : credits(estimate)} <small>credits</small></p><div className="cluster-rows"><div className="cluster-row"><span>CPU core / hour</span><strong>{RATES.cpu.toFixed(2)} cr</strong></div><div className="cluster-row"><span>GPU / hour</span><strong>{RATES.gpu.toFixed(2)} cr</strong></div><div className="cluster-row"><span>GB RAM / hour</span><strong>{RATES.ramGb.toFixed(2)} cr</strong></div></div><hr className="rule" /><div className="cluster-row"><span>Available balance</span><strong>{credits(data.credits.available)} cr</strong></div><div className="cluster-row"><span>After reservation</span><strong className={estimate !== null && estimate > data.credits.available ? "field-error" : ""}>{estimate === null ? "—" : `${credits(data.credits.available - estimate)} cr`}</strong></div><hr className="rule" /><div className="info-note"><Info size={14} /><span>Demo rates only. Completed jobs consume their estimate. Pending cancellations cost nothing; running cancellations are prorated.</span></div><Link className="text-link wallet-link" href="/credits">Open Credit Wallet <ArrowRight size={13} /></Link></div></Panel></aside>
    </form>
  </>;
}
