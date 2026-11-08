"use client";

import Link from "next/link";
import { Info, Plus } from "lucide-react";
import { useHPC } from "./HPCProvider";
import { PageHeading, Loading, Panel } from "./ui";
import ResourceCards from "./ResourceCards";
import { LIMITS } from "@/lib/scheduler";

export default function Resources() {
  const { data } = useHPC();
  if (!data) return <Loading />;
  return <><PageHeading title="Available Resources" description="Find the right compute capacity for your next experiment."><Link href="/jobs/new" className="button primary"><Plus size={16} /> Submit Job</Link></PageHeading><div className="notice"><Info size={18} />All capacity shown is simulated. Running jobs reduce availability; queued jobs wait for resources.</div><ResourceCards data={data} /><div className="section-heading"><h2>Compute partitions</h2><span className="status completed">Operational</span></div><Panel title="Mock research cluster" description="A shared pool of 128 CPU cores, 8 GPUs, and 512 GB RAM"><div className="table-wrap" tabIndex={0} role="region" aria-label="Compute partitions"><table className="job-table"><thead><tr><th scope="col">Partition</th><th scope="col">Workloads</th><th scope="col">Per-job limit</th><th scope="col">Maximum wall time</th></tr></thead><tbody><tr><td className="job-name">CPU compute</td><td>Simulation, data processing</td><td>{LIMITS.cpu} cores · {LIMITS.ramGb} GB RAM</td><td>24 hours</td></tr><tr><td className="job-name">GPU compute</td><td>Machine learning, accelerated simulation</td><td>{LIMITS.gpu} GPUs · {LIMITS.cpu} cores · {LIMITS.ramGb} GB RAM</td><td>24 hours</td></tr></tbody></table></div><div className="panel-footer">Partitions share the same simulated capacity. Selecting GPUs automatically chooses GPU compute.</div></Panel><div className="section-heading"><h2>Scheduler information</h2></div><div className="split-layout"><Panel title="Queue policy"><div className="panel-body article"><p>Jobs enter a first-in, first-out queue. After an eight-second preparation delay, the first job starts when its complete resource request can be satisfied. Large jobs can hold up smaller jobs behind them.</p><p>The mock execution clock runs for 45 seconds, regardless of the wall time requested. Refreshing or reopening the page reconstructs the simulated queue from saved timestamps.</p></div></Panel><Panel title="Current activity"><div className="panel-body"><div className="cluster-row"><span>Running jobs</span><strong>{data.resources.runningJobs}</strong></div><div className="cluster-row"><span>Queued jobs</span><strong>{data.resources.queuedJobs}</strong></div><Link href="/jobs" className="text-link wallet-link">Open My Jobs</Link></div></Panel></div></>;
}
