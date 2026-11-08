import Link from "next/link";
import Image from "next/image";
import { Activity, ArrowLeft, ArrowUpRight, Cpu, Layers3, Zap } from "lucide-react";
import AuthForm from "./AuthForm";
import styles from "@/styles/auth.module.css";

export default function AuthPage({ mode }: { mode: "login" | "register" }) {
  const registering = mode === "register";

  return (
    <div className={styles.page}>
      <a href="#auth-main" className="skip-link">Skip to content</a>
      <header className={styles.header}>
        <Link href="/landing" className={styles.brand}><Cpu size={26} /> UniCompute<span>.</span></Link>
        <Link href="/landing" className={styles.backLink}><ArrowLeft size={15} /> Back to home</Link>
      </header>
      <main id="auth-main" className={styles.main}>
        <aside className={styles.story} aria-label="Your research workspace">
          <Image src="/images/unicompute-landing-background.jpeg" alt="" fill sizes="(max-width: 860px) 100vw, 50vw" className={styles.artwork} />
          <div className={styles.storyContent}>
            <span className={styles.eyebrow}><span /> BUILT FOR RESEARCHERS</span>
            <h2>Your next<br /> breakthrough<br /> <span>starts here.</span></h2>
            <p>More computing power. Less complexity. Give your ideas the resources they deserve.</p>
            <ul className={styles.benefits}>
              <li><Cpu size={19} /><div><strong>Powerful computing</strong><span>CPU, GPU, and memory for your workloads</span></div></li>
              <li><Layers3 size={19} /><div><strong>Simple job submission</strong><span>From configuration to execution in one place</span></div></li>
              <li><Activity size={19} /><div><strong>A clear view of every job</strong><span>Track progress and manage your resources</span></div></li>
            </ul>
          </div>
          <div className={styles.storyFooter}><Zap size={16} /><span>University high-performance computing</span><ArrowUpRight size={17} /></div>
        </aside>
        <section className={styles.formPanel} aria-labelledby="auth-title">
          <div className={styles.formContent}>
            <p className={styles.formEyebrow}>YOUR UNICOMPUTE WORKSPACE</p>
            <h1 id="auth-title">{registering ? "Create your account" : "Welcome back"}</h1>
            <p className={styles.subtitle}>{registering ? "Start your research computing journey." : "Sign in to continue your research."}</p>
            <AuthForm key={mode} mode={mode} />
            <p className={styles.switchPage}>
              {registering ? "Already have an account?" : "New to UniCompute?"}{" "}
              <Link href={registering ? "/login" : "/register"}>{registering ? "Log in" : "Create an account"}</Link>
            </p>
          </div>
        </section>
      </main>
      <footer className={styles.footer}><span>UniCompute · Research computing, simplified.</span><Link href="/support">Need help?</Link></footer>
    </div>
  );
}
