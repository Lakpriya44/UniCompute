"use client";

import { Info } from "lucide-react";
import { useHPC } from "./HPCProvider";
import { Loading, PageHeading, Panel } from "./ui";
import { WORKLOADS } from "@/types/hpc";
import { credits } from "@/lib/format";

export default function Analytics() {
  const { data } = useHPC();
  if (!data) return <Loading />;
  const completed = data.jobs.filter(j => j.status === "Completed");
  const terminal = data.jobs.filter(j => ["Completed", "Failed"].includes(j.status));
  const groups = WORKLOADS.map(workload => ({ workload, count: data.jobs.filter(j => j.workload === workload).length, consumed: data.jobs.filter(j => j.workload === workload).reduce((n, j) => n + j.chargedCredits, 0) }));
  const max = Math.max(1, ...groups.map(g => g.consumed));
  return <><PageHeading title="Usage Analytics" description="Understand how your demo workloads use computing credits." /><div className="notice"><Info size={18} />All figures come from your local mock job history. These are demo estimates, not measured cluster utilization.</div><div className="resource-grid"><div className="resource-card"><p className="muted">Total jobs</p><div className="resource-value"><strong>{data.jobs.length}</strong></div></div><div className="resource-card"><p className="muted">Completed jobs</p><div className="resource-value"><strong>{completed.length}</strong></div></div><div className="resource-card"><p className="muted">Success rate</p><div className="resource-value"><strong>{terminal.length ? Math.round(completed.length / terminal.length * 100) : 0}%</strong></div><small className="muted">Completed ÷ completed and failed</small></div><div className="resource-card"><p className="muted">Credits consumed</p><div className="resource-value"><strong>{credits(data.credits.consumed)}</strong></div></div></div><div className="section-heading"><h2>Workload breakdown</h2><small>All-time local history</small></div><div className="split-layout"><Panel title="Credit consumption by workload" description="A lightweight view of your simulated usage"><div className="panel-body">{groups.map(g => <div className="analytics-row" key={g.workload}><div className="cluster-row"><span>{g.workload}</span><strong>{credits(g.consumed)} cr</strong></div><div className="progress-track" aria-hidden="true"><span style={{ width: `${g.consumed / max * 100}%` }} /></div></div>)}</div></Panel><Panel title="Job distribution"><div className="panel-body">{groups.map(g => <div className="cluster-row" key={g.workload}><span>{g.workload}</span><strong>{g.count} jobs</strong></div>)}<div className="info-note wallet-link"><Info size={15} />Cancelled jobs are excluded from success rate. Reserved credits are excluded from consumption.</div></div></Panel></div></>;
}
