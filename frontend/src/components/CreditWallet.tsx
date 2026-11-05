"use client";

import { useState } from "react";
import Link from "next/link";
import { Wallet, Info, ArrowRight, Plus, CheckCircle2 } from "lucide-react";
import { useHPC } from "./HPCProvider";
import { Loading, PageHeading, Panel } from "./ui";
import { credits, dateTime } from "@/lib/format";
import { hpcService } from "@/services/mock-hpc-service";

export default function CreditWallet() {
  const { data, refresh } = useHPC();
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<{ text: string; error: boolean } | null>(null);
  async function topUp(amount: number) {
    if (busy) return;
    setBusy(true); setFeedback(null);
    try { await hpcService.addDemoCredits(amount); await refresh(); setFeedback({ text: `${amount} demo credits added. No payment was taken.`, error: false }); }
    catch (e) { setFeedback({ text: e instanceof Error ? e.message : "Could not add demo credits.", error: true }); }
    finally { setBusy(false); }
  }
  if (!data) return <Loading />;
  const transactions = [
    ...data.grants.map(g => ({ id: g.id, name: g.kind, date: g.createdAt, amount: g.amount, href: null })),
    ...data.jobs.filter(j => j.finishedAt).map(j => ({ id: j.id, name: `${j.name} · ${j.status}`, date: j.finishedAt!, amount: -j.chargedCredits, href: `/jobs/${j.id}` })),
  ].sort((a, b) => b.date.localeCompare(a.date));
  return <><PageHeading title="Credit Wallet" description="A little credit. A lot of possibility. Pay as you compute." />
    {feedback && <div className={`notice ${feedback.error ? "error" : "success"}`} role={feedback.error ? "alert" : "status"}><CheckCircle2 size={18} />{feedback.text}</div>}
    <div className="split-layout"><div className="stack"><section className="wallet-banner"><Wallet size={25} /><p>Available to compute</p><div className="estimate-total">{credits(data.credits.available)} <small>credits</small></div><div className="wallet-stats"><div><small>Reserved for active jobs</small><strong>{credits(data.credits.reserved)} cr</strong></div><div><small>Consumed to date</small><strong>{credits(data.credits.consumed)} cr</strong></div><div><small>Starter grant</small><strong>{data.credits.starter} cr</strong></div></div></section>
      <Panel title="Add demo credits" description="One-time top-ups. No subscriptions."><div className="panel-body"><div className="credit-options">{[100, 250, 500].map(amount => <div className="credit-option" key={amount}><div><strong>{amount}</strong><p>demo credits</p></div><button className="button" disabled={busy} onClick={() => void topUp(amount)}><Plus size={13} /> Add {amount}</button></div>)}</div><div className="info-note wallet-link"><Info size={15} />These buttons simulate a credit purchase locally. Real payments, currency pricing, and receipts require the future billing API.</div></div></Panel></div>
      <Panel title="How credits work"><div className="panel-body article"><h3>Start with 250 credits</h3><p>Your demo workspace includes a starter grant and four example jobs. Their consumption is shown in the activity below.</p><h3>Reserve, then consume</h3><p>The full estimate is reserved when you submit. Completed jobs consume it. Cancelling before execution releases the entire reservation; running cancellations are prorated.</p><h3>Top up when you need to</h3><p>There is no monthly subscription. In the live platform, you’ll purchase more credits when your balance runs low.</p><Link className="text-link" href="/jobs/new">Put your credits to work <ArrowRight size={14} /></Link></div></Panel>
    </div>
    <div className="section-heading"><h2>Credit activity</h2><small>Local demo ledger</small></div><div className="panel"><div className="table-wrap" tabIndex={0} role="region" aria-label="Credit activity"><table className="job-table"><thead><tr><th scope="col">Activity</th><th scope="col">Date · SLST</th><th scope="col">Credits</th></tr></thead><tbody>{transactions.map(t => <tr key={t.id}><td>{t.href ? <Link className="job-name" href={t.href}>{t.name}</Link> : t.name}</td><td>{dateTime(t.date)}</td><td className={t.amount > 0 ? "positive" : ""}>{t.amount > 0 ? "+" : ""}{credits(t.amount)} cr</td></tr>)}</tbody></table></div><div className="panel-footer">Active job reservations appear in the wallet totals. Final consumption appears here when a job ends.</div></div>
  </>;
}
