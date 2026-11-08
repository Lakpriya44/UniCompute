
import type { Metadata } from "next";
import Link from "next/link";
import LandingBackdrop from "@/components/LandingBackdrop";
import { getHeroVideoSources } from "@/lib/hero-media";

import {
  ArrowRight,
  Cpu,
  CircuitBoard,
  Layers3,
  Activity,
  ArrowUpRight,
  Zap,
  ShieldCheck,
} from "lucide-react";

import styles from "@/styles/landing.module.css";

export const metadata: Metadata = {
  title: "Power Your Research",
  description:
    "Access university HPC resources, submit jobs, and manage computing workloads with UniCompute.",
};

const features = [
  {
    icon: CircuitBoard,
    title: "Computing Resources",
    text: "Choose the CPU, GPU, and memory resources your research needs.",
    href: "/resources",
    label: "Explore resources",
  },
  {
    icon: Layers3,
    title: "Simple Job Submission",
    text: "Configure and submit HPC workloads without complex commands.",
    href: "/jobs/new",
    label: "Submit a demo job",
  },
  {
    icon: Activity,
    title: "Job Monitoring",
    text: "Track job progress, view history, and manage resource usage.",
    href: "/",
    label: "View dashboard",
  },
];

export default function LandingPage() {
  return (
    <div className={styles.landing}>
      <a href="#landing-main" className="skip-link">
        Skip to content
      </a>

      {/* Navigation */}
      <header className={styles.header}>
        <Link className={styles.brand} href="/landing">
          <span>
            <Cpu size={27} />
          </span>
          UniCompute
          <span className={styles.brandDot}>.</span>
        </Link>

        <nav aria-label="Landing navigation">
          <a href="#capabilities">Capabilities</a>

          <Link href="/docs">
            Documentation
          </Link>

          <Link href="/login" className={styles.navLogin}>
            Login <ArrowUpRight size={14} />
          </Link>
        </nav>
      </header>

      <main id="landing-main">
        {/* Hero with circuit-board background */}
        <section
          className={`${styles.hero} ${styles.photoHero}`}
          aria-labelledby="landing-title"
        >
          <LandingBackdrop sources={getHeroVideoSources()} />
          <div className={styles.heroInner}>
            <div className={styles.heroCopy}>
              <div className={styles.kicker}>
                <span />
                UNIVERSITY HIGH-PERFORMANCE COMPUTING
              </div>

              <h1 id="landing-title">
                Power Your Research
                <br />
                with <span>UniCompute</span>
              </h1>

              <p>
                Access powerful computing resources,
                submit HPC jobs, and track your workloads
                through one simple university platform.
              </p>

              <div className={styles.actions}>
                <Link
                  href="/register"
                  className={styles.getStarted}
                >
                  Get Started
                  <ArrowRight size={18} />
                </Link>

                <Link
                  href="/login"
                  className={styles.loginButton}
                >
                  Login
                  <ArrowUpRight size={16} />
                </Link>
              </div>

              <div className={styles.heroNote}>
                <ShieldCheck size={15} />
                <span>
                  Explore the demo · 250 starter credits
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Platform Features */}
        <section
          id="capabilities"
          className={styles.capabilities}
        >
          <div className={styles.sectionIntro}>
            <p>WHAT YOU CAN DO</p>

            <h2>Everything you need to get computing.</h2>

            <span>
              Access, manage, and monitor HPC resources
              from one platform.
            </span>
          </div>

          <div className={styles.features}>
            {features.map(
              ({ icon: Icon, title, text, href, label }, i) => (
                <article key={title}>
                  <div className={styles.featureTop}>
                    <Icon size={23} />
                    <span>0{i + 1}</span>
                  </div>

                  <h3>{title}</h3>
                  <p>{text}</p>

                  <Link href={href}>
                    {label}
                    <ArrowRight size={14} />
                  </Link>
                </article>
              )
            )}
          </div>
        </section>

        {/* Mock Environment Notice */}
        <section className={styles.demoNote}>
          <Zap size={18} />

          <p>
            <strong>Built for research.</strong>{" "}
            UniCompute currently uses a Mock Slurm
            scheduler. Resources, execution, and
            credits are simulated.
          </p>

          <Link href="/docs">
            Learn more
            <ArrowUpRight size={15} />
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <Link className={styles.brand} href="/landing">
          <Cpu size={20} />
          UniCompute
        </Link>

        <span>Research computing, simplified.</span>

        <Link href="/support">
          Support
          <ArrowUpRight size={12} />
        </Link>
      </footer>
    </div>
  );
}
