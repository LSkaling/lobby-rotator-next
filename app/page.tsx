"use client";

import { useEffect, useRef, useState } from "react";

const IMAGES = [
  "https://lobby-rotator-next.vercel.app/couch.png",
  "https://lobby-rotator-next.vercel.app/hootow.png",
  "https://lobby-rotator-next.vercel.app/jd.png",
  "https://lobby-rotator-next.vercel.app/CHIP.png",
  "https://lobby-rotator-next.vercel.app/solarcar.png",    
];

const PERIOD_MS = 10000;

export default function Page() {
  const [idx, setIdx] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      setIdx((i) => (i + 1) % IMAGES.length);
    }, PERIOD_MS);
    return () => { if (timerRef.current) window.clearInterval(timerRef.current); };
  }, []);

  useEffect(() => {
    // keep screen awake if supported (kiosk friendliness)
    const nav = navigator as any;
    let lock: any;
    const request = async () => { try { lock = await nav.wakeLock?.request("screen"); } catch {} };
    request();
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") request();
    });
    return () => { try { lock?.release?.(); } catch {} };
  }, []);

  return (
    <div style={{
      position: "fixed", inset: 0, background: "#000", display: "grid", placeItems: "center", overflow: "hidden", cursor: "none"
    }}>
      {IMAGES.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={`Slide ${i + 1}`}
          style={{
            position: "absolute",
            maxWidth: "100vw",
            maxHeight: "100vh",
            objectFit: "contain",
            opacity: i === idx ? 1 : 0,
            transition: "opacity 600ms ease",
          }}
        />
      ))}
      <div style={{ position: "fixed", right: 12, bottom: 8, color: "#888", font: "12px system-ui" }}>
        Press F11 for full screen
      </div>
    </div>
  );
}
