"use client";

import Link from "next/link";
import { ArrowRight, ChevronRight, Plus, ListTodo, Server, Wallet, CalendarDays, Info, RefreshCw, ShieldCheck } from "lucide-react";
import { useHPC } from "./HPCProvider";
import { Loading, PageHeading, Panel } from "./ui";
import ResourceCards from "./ResourceCards";
import JobsTable from "./JobsTable";
import { calendarDate } from "@/lib/format";

const actions = [
  { title: "Submit HPC Job", note: "Start your next computation", href: "/jobs/new", icon: Plus },
  { title: "My Jobs", note: "Track your workloads", href: "/jobs", icon: ListTodo },
  { title: "Available Resources", note: "Explore cluster capacity", href: "/resources", icon: Server },
  { title: "Credit Wallet", note: "Manage your balance", href: "/credits", icon: Wallet },
];
export default function Dashboard({ hero }: { hero: React.ReactNode }) {
  const { data } = useHPC();
  return <>
    <PageHeading title="Dashboard" description="Your research workspace, at a glance.">{data && <span className="date-label"><CalendarDays size={13} />{calendarDate(data.updatedAt)}</span>}</PageHeading>
    {hero}
    {!data ? <Loading /> : <>
      <div className="section-heading"><h2>Resource overview</h2><small><span className="dot" /> Simulated availability · Updates live</small></div>
      <ResourceCards data={data} />
      <div className="section-heading"><h2>Quick actions</h2></div>
      <div className="quick-grid">{actions.map(({ title, note, href, icon: Icon }) => <Link key={href} href={href} className="quick-action"><span className="resource-icon"><Icon size={17} /></span><div><strong>{title}</strong><small>{note}</small></div><ChevronRight size={14} /></Link>)}</div>
      <div className="dashboard-lower">
        <Panel title="Recent jobs" description="Your latest research workloads" action={<Link href="/jobs" className="text-link">View all jobs <ArrowRight size={13} /></Link>}><JobsTable jobs={data.jobs.slice(0, 4)} compact /><div className="panel-footer"><RefreshCw size={11} /> Automatically updated from the mock scheduler</div></Panel>
        <Panel title="Cluster status" action={<span className="status completed">Operational</span>}><div className="panel-body"><div className="cluster-summary"><span className="resource-icon"><Server size={21} /></span><div><h3>UniCompute Research Cluster</h3><p>Mock Slurm · Development</p></div></div><div className="cluster-rows"><div className="cluster-row"><span>Scheduler</span><strong>Online <span className="dot" /></strong></div><div className="cluster-row"><span>Running jobs</span><strong>{data.resources.runningJobs}</strong></div><div className="cluster-row"><span>Jobs in queue</span><strong>{data.resources.queuedJobs}</strong></div><div className="cluster-row"><span>Resource allocation</span><strong>First in, first out</strong></div></div><div className="info-note"><Info size={13} />Resources and execution are simulated for development and demonstration.</div></div><div className="panel-footer"><ShieldCheck size={12} /> No connection to a real HPC cluster</div></Panel>
      </div>
    </>}
  </>;
}
