"use client";

import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
export default function WeddingInvitation() {
  const [phase, setPhase] = useState<"video" | "transition" | "invitation">("video");
  const [revealed, setRevealed] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const scratchRef = useRef<HTMLCanvasElement>(null);
  const particleRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const revealedRef = useRef(false);
  const scratchCountRef = useRef(0);
  const animIdRef = useRef<number | null>(null);
  const particlesRef = useRef<any[]>([]);
 const [videoReady, setVideoReady] = useState(false);
  /* ── VIDEO ── */
  const handleStart = () => videoRef.current?.play();

  const handleVideoEnd = () => {
    // Start smooth zoom-out transition
    setPhase("transition");
    // After transition animation completes, show invitation
    setTimeout(() => setPhase("invitation"), 900);
  };

  /* ── DRAW GOLD SCRATCH LAYER ── */
  useEffect(() => {
    if (phase !== "invitation" || !scratchRef.current) return;
    const canvas = scratchRef.current;
    const ctx = canvas.getContext("2d")!;
    const W = 160, H = 160;
    canvas.width = W; canvas.height = H;

    ctx.save();
    heartPath(ctx);
    ctx.clip();

    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, "#fbe29c");
    g.addColorStop(0.25, "#E8B84B");
    g.addColorStop(0.55, "#C49A0E");
    g.addColorStop(0.8, "#A07800");
    g.addColorStop(1, "#7a5c00");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    for (let i = 0; i < 800; i++) {
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.6})`;
      ctx.beginPath();
      ctx.arc(Math.random() * W, Math.random() * H, Math.random() * 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
    ctx.globalCompositeOperation = "destination-out";
  }, [phase]);

 function heartPath(ctx: CanvasRenderingContext2D) {
  ctx.beginPath();
  ctx.moveTo(80, 140);
  ctx.bezierCurveTo(80, 140, 0, 95, 0, 50);
  ctx.arc(40, 50, 40, Math.PI, 0, false);
  ctx.arc(120, 50, 40, Math.PI, 0, false);
  ctx.bezierCurveTo(160, 95, 80, 140, 80, 140);
  ctx.closePath();
}
  /* ── SCRATCH LOGIC ── */
  function doScratch(x: number, y: number) {
    const canvas = scratchRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    ctx.globalCompositeOperation = "destination-out";
    const rad = ctx.createRadialGradient(x, y, 0, x, y, 22);
    rad.addColorStop(0, "rgba(0,0,0,1)");
    rad.addColorStop(0.6, "rgba(0,0,0,0.8)");
    rad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = rad;
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();
    scratchCountRef.current++;
    checkReveal(ctx);
  }

  function checkReveal(ctx: CanvasRenderingContext2D) {
    if (revealedRef.current || scratchCountRef.current < 35) return;
    const d = ctx.getImageData(0, 0, 160, 160).data;
    let total = 0, clear = 0;
    for (let i = 3; i < d.length; i += 4) { total++; if (d[i] < 100) clear++; }
    if (clear / total > 0.45) triggerReveal();
  }

  /* ── REVEAL ── */
  function triggerReveal() {
    revealedRef.current = true;
    setRevealed(true);

    const canvas = scratchRef.current!;
    const ctx = canvas.getContext("2d")!;
    let p = 0;
    const wipe = () => {
      p += 0.04;
      ctx.globalCompositeOperation = "destination-out";
      ctx.globalAlpha = 0.12;
      ctx.fillStyle = "#000";
      heartPath(ctx);
      ctx.fill();
      ctx.globalAlpha = 1;
      if (p < 1) requestAnimationFrame(wipe);
      else ctx.clearRect(0, 0, 160, 160);
    };
    wipe();

    setTimeout(() => setShowCongrats(true), 700);
    spawnParticles();
  }

function spawnParticles() {
  const canvas = particleRef.current;
  if (!canvas) return;

  const ctx = canvas.getContext("2d")!;

  const width = window.innerWidth;
  const height = window.innerHeight;

  canvas.width = width;
  canvas.height = height;

  const colors = ["#FFD700", "#E8B84B", "#fff", "#ffe066"];

  particlesRef.current = [];

  // LEFT EDGE
  for (let i = 0; i < 100; i++) {
    particlesRef.current.push({
      x: 0,
      y: height - 50 + Math.random() * 50,

      vx: 1 + Math.random() * 2,
      vy: -(4 + Math.random() * 5),

      size: 2 + Math.random() * 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      gravity: 0.08,
      decay: 0.008
    });
  }

  // RIGHT EDGE
  for (let i = 0; i < 100; i++) {
    particlesRef.current.push({
      x: width,
      y: height - 50 + Math.random() * 50,

      vx: -(1 + Math.random() * 2),
      vy: -(4 + Math.random() * 5),

      size: 2 + Math.random() * 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      gravity: 0.08,
      decay: 0.008
    });
  }

  if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
  animateConfetti();
}

  function animParticles() {
    const pCanvas = particleRef.current;
    if (!pCanvas) return;
    const pCtx = pCanvas.getContext("2d")!;
    pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
    let alive = false;

    for (const p of particlesRef.current) {
      if (p.alpha <= 0) continue;
      alive = true;
      p.vy += p.gravity; p.x += p.vx; p.y += p.vy;
      p.alpha -= p.decay; p.rot += p.rotSpeed; p.vx *= 0.99;

      pCtx.save();
      pCtx.globalAlpha = Math.max(0, p.alpha);
      if (p.type === "spark") {
        if (p.trail) { p.trail.push({ x: p.x, y: p.y }); if (p.trail.length > 8) p.trail.shift(); }
        pCtx.strokeStyle = p.color; pCtx.lineWidth = p.size; pCtx.lineCap = "round";
        pCtx.beginPath();
        if (p.trail.length > 1) {
          pCtx.moveTo(p.trail[0].x, p.trail[0].y);
          p.trail.forEach((t: any) => pCtx.lineTo(t.x, t.y));
        }
        pCtx.stroke();
      } else if (p.type === "star") {
        pCtx.fillStyle = p.color;
        pCtx.save(); pCtx.translate(p.x, p.y); pCtx.rotate(p.rot); pCtx.beginPath();
        for (let i = 0; i < 5; i++) {
          const a = (i * 4 * Math.PI) / 5 - Math.PI / 2;
          const a2 = ((i * 4 + 2) * Math.PI) / 5 - Math.PI / 2;
          if (i === 0) pCtx.moveTo(Math.cos(a) * p.size, Math.sin(a) * p.size);
          else pCtx.lineTo(Math.cos(a) * p.size, Math.sin(a) * p.size);
          pCtx.lineTo(Math.cos(a2) * p.size * 0.4, Math.sin(a2) * p.size * 0.4);
        }
        pCtx.closePath(); pCtx.fill(); pCtx.restore();
      } else {
        pCtx.fillStyle = p.color;
        pCtx.beginPath(); pCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2); pCtx.fill();
      }
      pCtx.restore();
    }
    if (alive) animIdRef.current = requestAnimationFrame(animParticles);
  }

const animateConfetti = () => {
  const duration = 2000;
  const end = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0 }
    });

    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1 }
    });

    if (Date.now() < end) {
      animIdRef.current = requestAnimationFrame(frame);
    }
  };

  frame();
};





  /* ── POINTER EVENTS ── */
  function getPos(e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = 160 / rect.width;
    const scaleY = 160 / rect.height;
    if ("touches" in e) return { x: (e.touches[0].clientX - rect.left) * scaleX, y: (e.touches[0].clientY - rect.top) * scaleY };
    return { x: ((e as React.MouseEvent).clientX - rect.left) * scaleX, y: ((e as React.MouseEvent).clientY - rect.top) * scaleY };
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Cormorant+Garamond:wght@400;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { width: 100%; height: 100%; overflow: hidden; background: #fdf6ec; }

        /* ── VIDEO PHASE ── */
        .video-wrapper {
          position: fixed; inset: 0; background: #000; z-index: 100;
          display: flex; align-items: center; justify-content: center;
        }
        .video-wrapper video {
          width: 100%; height: 100%; object-fit: cover;
          transform-origin: center center;
        }

        /* Zoom-out exit: video scales UP (appears to zoom out / pull back) and fades */
        .video-wrapper.exiting video {
          animation: videoZoomOut 0.9s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .video-wrapper.exiting {
          animation: wrapperFadeOut 0.9s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        @keyframes videoZoomOut {
          0%   { transform: scale(1); }
          100% { transform: scale(1.18); }
        }
        @keyframes wrapperFadeOut {
          0%   { opacity: 1; }
          60%  { opacity: 1; }
          100% { opacity: 0; }
        }

        /* ── INVITATION PHASE ── */
       /* Wrapper */
.invitation-wrapper {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fdf6ec; /* side background */
}

/* Center container */
.center-container {
  position: relative;
  width: 100%;
  height: 100%;
  max-width: 420px;   /* 👈 mobile width */
  overflow: hidden;
  box-shadow: 0 0 40px rgba(0,0,0,0.1);
}

/* Image */
.bg-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
  @media (min-width: 768px) {
  .center-container {
    width: 400px;
    height: 100vh;
    border-radius: 10px;
  }
}
.center-container {
  background: white;
  border-radius: 12px;
  overflow: hidden;
}

        /* ── HEART OVERLAY ── */
        /* Positioned absolutely so it sits exactly where the bg.png heart area is.
           Adjust top/left percentages to match your bg.png's heart position. */
        .heart-overlay {
          position: absolute;
          /* These values place the 160×160 heart centred horizontally
             and ~62% down the image — tune top to match your bg.png */
          top: 62%;
          left: 50%;
          transform: translate(-50%, -50%);
           margin-top: 50px;
        }

        .heart-stage {
          position: relative; width: 190px; height: 190px;
          cursor: crosshair; user-select: none; touch-action: none;
        }
        .heart-svg {
          position: absolute; inset: 0; width: 190px; height: 190px;
          filter: drop-shadow(0 8px 20px rgba(180,130,0,0.45));
          transition: opacity 0.4s ease;
        }
        .date-reveal {
          position: absolute; inset: 0; display: flex; flex-direction: column; gap: 4px;  
          align-items: center; justify-content: center;  gap: 2px;              /* tighter spacing */
  transform: translateY(-6px);  /* 👈 move text slightly UP */ pointer-events: none; z-index: 1;
        }
        .date-day   { font-family: 'Playfair Display', serif; font-size: 30px; color: #2E1D16; font-weight: 700; line-height: 1.2; }
        .date-month { font-family: 'Playfair Display', serif; font-size: 24px; letter-spacing: 4px; color: #2E1D16; font-weight: 700; text-transform: uppercase; line-height: 1.3; }
        .date-year  { font-family: 'Playfair Display', serif; font-size: 24px; letter-spacing: 3px; color: #2E1D16; font-weight: 700;line-height: 1.1;  }
        .scratch-canvas { position: absolute; inset: 0; width: 190px; height: 190px; z-index: 3; }
        .particle-canvas { position: absolute; inset: -200px; pointer-events: none; z-index: 10; }

        .hint {
          font-family: 'Cormorant Garamond', serif; font-size: 13px;
          letter-spacing: 3px; color: #a07020; text-transform: uppercase;
          margin-top: 1rem; transition: opacity 0.6s; white-space: nowrap;
        }
        .hint.gone { opacity: 0; }
        .congrats {
          font-family: 'Playfair Display', serif; font-size: 15px;
          color: #b07c10; letter-spacing: 2px; margin-top: 0.8rem;
          opacity: 0; transition: opacity 1s ease 0.5s; text-align: center;
          white-space: nowrap;
        }
        .congrats.show { opacity: 1; }
.date-reveal.show {
animation: datePop 0.6s ease-out forwards,
           dateGlow 1.2s ease-in-out infinite;
}

@keyframes datePop {
  0% {
    transform: translateY(-6px) scale(0.7);
    opacity: 0;
  }
  60% {
    transform: translateY(-6px) scale(1.15);
    opacity: 1;
  }
  100% {
    transform: translateY(-6px) scale(1.1);
  }
}


.date-reveal.show .date-day   { font-size: 34px; }
.date-reveal.show .date-month { font-size: 26px; }
.date-reveal.show .date-year  { font-size: 26px; }

      `}</style>

      {/* VIDEO — shown during "video" and "transition" phases */}
      {(phase === "video" || phase === "transition") && (
        <div
          className={`video-wrapper${phase === "transition" ? " exiting" : ""}`}
          onClick={handleStart}
        >
         

<video
  ref={videoRef}
  src="/Sequence.mp4"
  onEnded={handleVideoEnd}
  autoPlay
  muted
  playsInline
  preload="auto"
  onLoadedData={() => setVideoReady(true)}
  style={{
    width: "100%",
    height: "100%",
    objectFit: "cover",
    opacity: videoReady ? 1 : 0,
    transition: "opacity 0.4s ease"
  }}
/>
        </div>
      )}

      {/* INVITATION */}
      {phase === "invitation" && (
        <div className="invitation-wrapper">
        <div className="center-container">
  <img src="/bg.png" className="bg-img" alt="" />
</div>

          {/* Heart sits over the bg — adjust `top` % to match bg.png's heart zone */}
          <div className="heart-overlay">
            <canvas className="particle-canvas" ref={particleRef} />

            <div className="heart-stage">
              <div className={`date-reveal ${revealed ? "show" : ""}`}>
                <div className="date-day">29 &amp; 30</div>
                <div className="date-month">June</div>
                <div className="date-year">2026</div>
              </div>

              <svg className="heart-svg" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg" style={{ opacity: revealed ? 0 : 1 }}>
                <defs>
                  <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%"   stopColor="#fbe29c"/>
                    <stop offset="25%"  stopColor="#E8B84B"/>
                    <stop offset="55%"  stopColor="#C49A0E"/>
                    <stop offset="80%"  stopColor="#A07800"/>
                    <stop offset="100%" stopColor="#7a5c00"/>
                  </linearGradient>
                </defs>
                <path
  d="M80 140 
     C 80 140, 0 95, 0 50
     A 40 40 0 0 1 80 50
     A 40 40 0 0 1 160 50
     C 160 95, 80 140, 80 140 Z"
  fill="url(#goldGrad)"
  stroke="rgba(255,220,100,0.6)"
  strokeWidth="1.5"
/>
              </svg>

              <canvas
                ref={scratchRef}
                className="scratch-canvas"
                onMouseDown={e  => { isDrawingRef.current = true;  const p = getPos(e, scratchRef.current!); doScratch(p.x, p.y); }}
                onMouseMove={e  => { if (isDrawingRef.current) { const p = getPos(e, scratchRef.current!); doScratch(p.x, p.y); } }}
                onMouseUp={()   => { isDrawingRef.current = false; }}
                onMouseLeave={() => { isDrawingRef.current = false; }}
                onTouchStart={e => { e.preventDefault(); isDrawingRef.current = true;  const p = getPos(e, scratchRef.current!); doScratch(p.x, p.y); }}
                onTouchMove={e  => { e.preventDefault(); if (isDrawingRef.current) { const p = getPos(e, scratchRef.current!); doScratch(p.x, p.y); } }}
                onTouchEnd={()  => { isDrawingRef.current = false; }}
              />
            </div>

          
          </div>
        </div>
      )}
    </>
  );
}