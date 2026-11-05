import type { Metadata } from "next";
import Link from "next/link";
import { FolderOpen, Info, ArrowRight } from "lucide-react";
import { PageHeading, Panel } from "@/components/ui";
export const metadata: Metadata = { title: "Files & Storage" };
export default function Page() { return <><PageHeading title="Files & Storage" description="A future home for your research inputs and results." /><div className="notice"><Info size={18} />Storage integration is planned. This demo does not upload files or generate real job outputs.</div><Panel title="Research storage" description="Backend integration required" action={<FolderOpen size={20} />}><div className="panel-body article"><h3>Inputs, outputs, and workspace files</h3><p>The future file service will handle authenticated uploads, per-user quotas, and authorized downloads of job results. The frontend will use the NestJS API rather than connecting directly to cluster storage.</p><h3>Keep exploring</h3><p>You can already submit a simulated workload and follow its status without a dataset or Slurm script.</p><Link href="/jobs/new" className="button primary">Submit a demo job <ArrowRight size={15} /></Link></div></Panel></>; }
