import Link from "next/link";
import { Cpu, CircuitBoard, MemoryStick, Wallet, ArrowUpRight } from "lucide-react";
import type { DashboardData } from "@/types/hpc";
import { credits } from "@/lib/format";

export default function ResourceCards({ data }: { data: DashboardData }) {
  const { resources: r, credits: c } = data;
  const cards = [
    { label: "Available CPU cores", value: r.cpu.available, unit: "cores", note: `${r.cpu.total} total cluster cores`, icon: Cpu, tone: "" },
    { label: "Available GPUs", value: r.gpu.available, unit: "GPUs", note: `${r.gpu.total} simulated accelerators`, icon: CircuitBoard, tone: "cyan" },
    { label: "Available RAM", value: r.ramGb.available, unit: "GB", note: `${r.ramGb.total} GB total memory`, icon: MemoryStick, tone: "violet" },
    { label: "Credit balance", value: credits(c.available), unit: "credits", note: "Ready to use", icon: Wallet, tone: "green" },
  ];
  return <div className="resource-grid">{cards.map(({ label, value, unit, note, icon: Icon, tone }) => <article className="resource-card" key={label}><div className="resource-card-top"><p>{label}</p><span className={`resource-icon ${tone}`}><Icon size={17} /></span></div><div className="resource-value"><strong>{value}</strong><span>{unit}</span></div><div className="resource-card-foot"><span className="dot" />{note}{unit === "credits" && <Link href="/credits" className="text-link">Top up <ArrowUpRight size={11} /></Link>}</div></article>)}</div>;
}
