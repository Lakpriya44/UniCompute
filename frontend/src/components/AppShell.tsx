"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Bell, ChevronRight, Menu, FlaskConical, ShieldCheck, AlertCircle } from "lucide-react";
import Sidebar from "./Sidebar";
import { useHPC } from "./HPCProvider";

const titles: Record<string, string> = { "/": "Dashboard", "/jobs/new": "Submit Job", "/jobs": "My Jobs", "/resources": "Resources", "/credits": "Credit Wallet", "/analytics": "Usage Analytics", "/notifications": "Notifications", "/docs": "Documentation", "/support": "Support", "/profile": "Profile & Security", "/files": "Files & Storage" };
export default function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const { data, error, refresh } = useHPC();
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const user = data?.user;
  useEffect(() => {
    if (!open) return;
    const sidebar = document.getElementById("workspace-navigation");
    const trigger = menuButton.current;
    const focusable = () => Array.from(sidebar?.querySelectorAll<HTMLElement>("a[href], button") ?? []).filter(el => el.getClientRects().length);
    focusable()[0]?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key === "Tab") {
        const elements = focusable(); const first = elements[0]; const last = elements.at(-1);
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    const onResize = () => { if (window.innerWidth > 800) setOpen(false); };
    document.addEventListener("keydown", onKey); window.addEventListener("resize", onResize);
    const previous = document.body.style.overflow; document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); window.removeEventListener("resize", onResize); document.body.style.overflow = previous; trigger?.focus(); };
  }, [open]);
  return <div className="app-container">
    <a href="#main-content" className="skip-link">Skip to content</a>
    <Sidebar open={open} onNavigate={() => setOpen(false)} />
    <button className={`mobile-backdrop ${open ? "is-open" : ""}`} onClick={() => setOpen(false)} aria-label="Dismiss navigation" tabIndex={-1} />
    <div className="workspace" inert={open}>
      <header className="topbar">
        <button className="icon-button menu-toggle" aria-label="Open navigation" aria-controls="workspace-navigation" aria-expanded={open} ref={menuButton} onClick={() => setOpen(true)}><Menu size={18} /></button>
        <div className="breadcrumb"><span>Workspace</span><ChevronRight size={12} /><strong>{titles[path] ?? "Job Details"}</strong></div>
        <div className="topbar-actions"><span className="demo-pill"><FlaskConical size={12} /> Mock Slurm environment</span><Link href="/notifications" className="icon-button" aria-label="View notifications"><Bell size={17} /><span className="notification-dot" /></Link><Link href="/profile" className="profile-link" aria-label="View profile"><span className="avatar">{user?.name.split(" ").map(n => n[0]).slice(0, 2).join("") ?? "AM"}</span><span className="profile-copy"><strong>{user?.name ?? "Demo researcher"}</strong><small>Researcher</small></span></Link></div>
      </header>
      <main id="main-content" className="dashboard-main" tabIndex={-1}>
        {data?.storageWarning && <div className="notice" role="status"><AlertCircle size={17} />{data.storageWarning}</div>}
        {error ? <div className="notice error" role="alert"><div>{error}<br /><button className="button" onClick={() => void refresh()}>Retry loading workspace</button></div></div> : children}
        <footer className="workspace-footer"><span>© UniCompute · Research computing, simplified.</span><span><ShieldCheck size={12} /> Local demo workspace · No real cluster connection</span></footer>
      </main>
    </div>
  </div>;
}
