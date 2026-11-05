import type { Metadata } from "next";
import Link from "next/link";
import { Headphones, ArrowRight } from "lucide-react";
import { PageHeading, Panel } from "@/components/ui";
export const metadata: Metadata = { title: "Support" };
const questions = [
  ["Why is my job pending?", "The mock scheduler waits at least eight seconds before starting a job. It then waits until every requested resource is available. A larger job at the front of the queue may delay jobs behind it."],
  ["Why did my job finish earlier than its wall time?", "This demo compresses execution into 45 seconds. Wall time is your requested maximum runtime and is used for the credit estimate. The simulation does not execute your research code."],
  ["Where did my credits go?", "The full estimate is reserved on submission. It is consumed on completion. Unused credits are released after a cancellation or simulated failure. Check Credit Wallet for the ledger."],
  ["How do I try the failure state?", "Enable “Simulate a failed job” on the submission page. The mock job will stop halfway through execution and release half its reserved credits."],
  ["Where are my files and results?", "This prototype does not upload, execute, or generate files. Files & Storage explains the planned backend integration. There are no real logs or result downloads in the demo."],
  ["Why is my history different on another browser?", "Demo history is local to the browser and site origin. It is not synced to an account. The future backend will make your history available across devices."],
];
export default function Page() { return <><PageHeading title="Support" description="A little guidance to keep your research moving." /><div className="split-layout"><Panel title="Frequently asked questions" action={<Headphones size={18} />}><div className="panel-body">{questions.map(([question, answer]) => <details key={question} className="faq"><summary>{question}</summary><p>{answer}</p></details>)}</div></Panel><Panel title="Need a walkthrough?"><div className="panel-body article"><p>Our quick-start guide walks through resource selection, credit estimates, queueing, and job monitoring.</p><Link className="button primary" href="/docs">Read Documentation <ArrowRight size={14} /></Link><h3>Support tickets · Planned</h3><p>Ticket submission will be available once the team connects its support service. For a demo issue, record the job ID and the steps that produced it for your project team.</p></div></Panel></div></>; }
