import Link from "next/link";
import { ArrowRight, Inbox } from "lucide-react";
import type { JobStatus } from "@/types/hpc";

export function PageHeading({ title, description, children }: { title: string; description: string; children?: React.ReactNode }) {
  return <div className="page-heading"><div><h1>{title}</h1><p>{description}</p></div>{children}</div>;
}
export function StatusBadge({ status }: { status: JobStatus }) { return <span className={`status ${status.toLowerCase()}`}>{status}</span>; }
export function Loading() { return <div className="loading" role="status">Loading your research workspace…</div>; }
export function EmptyState({ title, description, href, action }: { title: string; description: string; href?: string; action?: string }) {
  return <div className="empty-state"><Inbox size={32} /><h2>{title}</h2><p>{description}</p>{href && <Link className="button primary" href={href}>{action} <ArrowRight size={15} /></Link>}</div>;
}
export function Panel({ title, description, action, children, className = "" }: { title: string; description?: string; action?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return <section className={`panel ${className}`}><div className="panel-head"><div><h2>{title}</h2>{description && <p>{description}</p>}</div>{action}</div>{children}</section>;
}
