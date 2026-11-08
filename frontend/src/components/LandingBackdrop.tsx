"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Pause, Play } from "lucide-react";
import styles from "@/styles/landing.module.css";

type Connection = EventTarget & { saveData?: boolean; effectiveType?: string; downlink?: number };
type NavigatorWithConnection = Navigator & { connection?: Connection };
function allowMotion() {
  const connection = (navigator as NavigatorWithConnection).connection;
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches && !connection?.saveData && !["slow-2g", "2g", "3g"].includes(connection?.effectiveType ?? "") && !(connection?.downlink !== undefined && connection.downlink < 1.5);
}
function subscribeMotion(callback: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  const connection = (navigator as NavigatorWithConnection).connection;
  media.addEventListener("change", callback);
  connection?.addEventListener("change", callback);
  return () => { media.removeEventListener("change", callback); connection?.removeEventListener("change", callback); };
}
const staticServer = () => false;
const traces = [
  "M1600 110H1450L1350 210H1280L1220 270",
  "M1600 160H1470L1380 250H1320L1260 310",
  "M1600 490H1450L1350 390H1280L1240 350",
  "M1600 550H1440L1330 440H1260L1200 380",
  "M1250 0V90L1190 150V250",
  "M1340 0V100L1270 170V260",
  "M1130 0V100L1170 140V245",
  "M900 600V490L1020 370H1120",
  "M1100 600V510L1190 420V380",
  "M760 500H910L1040 370H1110",
  "M720 190H910L1040 290H1110",
];

/** Loaded exclusively by /landing. No video element or source is mounted before motion eligibility is known. */
export default function LandingBackdrop({ sources }: { sources: { src: string; type: string }[] }) {
  const onLanding = usePathname() === "/landing";
  const motionPreference = useSyncExternalStore(subscribeMotion, allowMotion, staticServer);
  const permitted = onLanding && motionPreference;
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);
  const [videoFailed, setVideoFailed] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const host = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const active = permitted && visible && pageVisible && !paused && !videoFailed;
  const useVideo = permitted && sources.length > 0 && !videoFailed;
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.05 });
    if (host.current) observer.observe(host.current);
    const onVisibility = () => setPageVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVisibility);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", onVisibility); };
  }, []);
  useEffect(() => {
    if (!useVideo) return;
    const element = video.current;
    if (!element) return;
    if (active) { void element.play().catch(() => setVideoFailed(true)); }
    else element.pause();
    // Next can retain a hidden route in an Activity boundary; pause during effect cleanup too.
    return () => element.pause();
  }, [active, useVideo]);
  useEffect(() => {
    if (!useVideo || videoReady) return;
    // Keep the static image if decoding or downloading cannot become ready promptly.
    const timer = window.setTimeout(() => setVideoFailed(true), 4500);
    return () => window.clearTimeout(timer);
  }, [useVideo, videoReady]);
  if (!onLanding) return null;
  return <>
    <div ref={host} className={styles.backdrop} aria-hidden="true" data-animate={active && sources.length === 0}>
      <Image src="/images/unicompute-landing-background.jpeg" alt="" fill preload sizes="100vw" className={styles.poster} />
      {useVideo && <video ref={video} className={`${styles.video} ${videoReady ? styles.videoReady : ""}`} autoPlay loop muted playsInline preload="none" poster="/images/unicompute-landing-background.jpeg" tabIndex={-1} disablePictureInPicture onPlaying={() => setVideoReady(true)} onError={() => setVideoFailed(true)}>{sources.map(source => <source key={source.src} {...source} />)}</video>}
      {sources.length === 0 && <div className={styles.circuitMotion}>
        <div className={styles.processorGlow} />
        <svg className={styles.traces} viewBox="0 0 1600 600" fill="none" preserveAspectRatio="xMidYMid slice" focusable="false">
          <defs><linearGradient id="signal-color"><stop stopColor="#1766d8" /><stop offset="1" stopColor="#72e4ff" /></linearGradient></defs>
          <g stroke="#1f79bd" strokeWidth="1" opacity=".3">{traces.map(d => <path key={d} d={d} />)}</g>
          <g stroke="url(#signal-color)" strokeWidth="2" strokeLinecap="round">{traces.map((d, index) => <path className={styles.signal} style={{ animationDelay: `${index * -1.3}s`, animationDuration: `${12 + index % 4 * 2}s` }} key={d} d={d} pathLength="100" />)}</g>
          <g fill="#65d6ff">{[[1250, 90], [1340, 100], [1130, 100], [1450, 490], [910, 500], [1020, 370], [1470, 160], [1100, 510]].map(([cx, cy], i) => <circle className={styles.node} key={`${cx}-${cy}`} cx={cx} cy={cy} r="2.5" style={{ animationDelay: `${-i * .9}s` }} />)}</g>
        </svg>
        <div className={styles.dataBeam} /><div className={`${styles.dataBeam} ${styles.beamTwo}`} />
      </div>}
      <div className={styles.overlay} />
    </div>
    {permitted && !videoFailed && <button type="button" className={styles.motionControl} aria-label={paused ? "Play background animation" : "Pause background animation"} onClick={() => setPaused(value => !value)}>{paused ? <Play size={12} /> : <Pause size={12} />}<span>{paused ? "Play motion" : "Pause motion"}</span></button>}
  </>;
}
