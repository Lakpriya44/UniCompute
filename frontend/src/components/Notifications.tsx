"use client";

import Link from "next/link";
import { Bell, ArrowRight, Gift } from "lucide-react";
import { useHPC } from "./HPCProvider";
import { Loading, PageHeading, Panel, StatusBadge } from "./ui";
import { dateTime } from "@/lib/format";

export default function Notifications() {
  const { data } = useHPC();
  if (!data) return <Loading />;
  const jobs = [...data.jobs].sort((a, b) => (b.finishedAt ?? b.startedAt ?? b.submittedAt).localeCompare(a.finishedAt ?? a.startedAt ?? a.submittedAt));
  return <><PageHeading title="Notification Center" description="The latest activity from your local research workspace." /><Panel title="Workspace activity" description="Live demo updates · Notifications are generated from your job history">{jobs.map(job => <article className="activity-item" key={job.id}><span className="resource-icon"><Bell size={17} /></span><div><h3>{job.name} <StatusBadge status={job.status} /></h3><p>{dateTime(job.finishedAt ?? job.startedAt ?? job.submittedAt)} SLST · Mock scheduler event</p></div><Link className="text-link" href={`/jobs/${job.id}`}>View job <ArrowRight size={13} /></Link></article>)}<article className="activity-item"><span className="resource-icon green"><Gift size={17} /></span><div><h3>Your research starts here</h3><p>Your workspace received 250 starter credits. Explore the docs for a quick walkthrough.</p></div><Link href="/docs" className="text-link">Read the guide <ArrowRight size={13} /></Link></article></Panel></>;
}
