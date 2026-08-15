"use client";

import { useEffect, useState } from "react";

export function MotionExperience() {
  const [introVisible, setIntroVisible] = useState(true);

  useEffect(() => {
    const root = document.documentElement;
    const updateMotion = (event?: MouseEvent) => {
      root.style.setProperty("--page-shift", `${Math.min(window.scrollY * -0.08, 0)}px`);
      if (event) {
        root.style.setProperty("--cursor-x", `${event.clientX}px`);
        root.style.setProperty("--cursor-y", `${event.clientY}px`);
      }
    };
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add("is-revealed"); });
    }, { threshold: 0.12 });
    document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((item) => revealObserver.observe(item));
    updateMotion();
    const onScroll = () => updateMotion();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", updateMotion);
    const intro = window.setTimeout(() => setIntroVisible(false), 1150);
    return () => {
      window.clearTimeout(intro);
      revealObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", updateMotion);
    };
  }, []);

  return <>
    <div className="site-grain" aria-hidden="true" />
    <div className="cursor-orbit" aria-hidden="true"><span /></div>
    {introVisible && <div className="cinematic-intro" aria-label="Sanskriti Mall"><div className="intro-line" /><p>BETUL · MADHYA PRADESH</p><strong>SANSKRITI</strong><small>MALL / 2026 EDIT</small><i /></div>}
  </>;
}
