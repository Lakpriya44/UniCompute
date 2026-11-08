"use client";
import { ShieldCheck, UserRound, Info } from "lucide-react";
import { useHPC } from "./HPCProvider";
import { Loading, PageHeading, Panel } from "./ui";
export default function Profile() {
  const { data } = useHPC();
  if (!data) return <Loading />;
  return <><PageHeading title="Profile & Security" description="Your account information and workspace settings." /><div className="notice"><Info size={18} />This is a fictional demo profile. Authentication and profile editing will be connected to the NestJS account API.</div><div className="split-layout"><Panel title="Researcher profile" action={<UserRound size={18} />}><div className="panel-body"><dl className="detail-list">{[["Full name", data.user.name], ["Email address", data.user.email], ["Institution", data.user.institution], ["Role", data.user.role], ["Account ID", data.user.id], ["Billing model", "Starter credits + pay-as-you-go"]].map(([key, value]) => <div key={key}><dt>{key}</dt><dd>{value}</dd></div>)}</dl></div></Panel><Panel title="Security & storage" action={<ShieldCheck size={18} />}><div className="panel-body article"><h3>Local demonstration</h3><p>Job history and credits are saved in this browser. There is no real sign-in, password, or protected account in this demo.</p><h3>Planned account integration</h3><p>University sign-in, session management, password recovery, and server-side authorization belong to the future account service.</p><h3>Demo data</h3><p>Clearing this site’s browser storage removes its local job history. Do not enter confidential research information.</p></div></Panel></div></>;
}
