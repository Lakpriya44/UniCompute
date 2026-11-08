import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Plus, Zap } from "lucide-react";

export default function Hero() {
  return (
    <section className="circuit-hero" aria-labelledby="hero-title">
      <Image src="/images/circuit-hero.png" alt="" fill preload sizes="(max-width: 800px) 100vw, 80vw" className="hero-image" />
      <div className="hero-content">
        <p className="eyebrow"><Zap size={14} /> HIGH-PERFORMANCE COMPUTING</p>
        <h2 id="hero-title">Welcome to <span>UniCompute</span></h2>
        <p className="hero-description">Manage computing resources, submit HPC jobs, monitor execution, and track your research computing usage from one intelligent platform.</p>
        <div className="hero-actions">
          <Link href="/jobs/new" className="button primary"><Plus size={17} /> Submit Job</Link>
          <Link href="/jobs" className="button ghost">View My Jobs <ArrowRight size={16} /></Link>
        </div>
      </div>
      <span className="hero-caption">BUILT FOR YOUR NEXT BREAKTHROUGH</span>
    </section>
  );
}
