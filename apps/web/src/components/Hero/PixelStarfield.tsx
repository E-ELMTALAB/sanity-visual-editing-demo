import React, { useMemo } from "react";

function seededRng(seed: number) {
  return () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
}

function genBoxes(n: number, seed: number) {
  const rnd = seededRng(seed);
  const pts = Array.from({ length: n }, () => {
    const x = Math.floor(rnd() * 2000);
    const y = Math.floor(rnd() * 2000);
    return `${x}px ${y}px #fff`;
  });
  return pts.join(", ");
}

export default function PixelStarfield() {
  const small = useMemo(() => genBoxes(700, 7), []);
  const medium = useMemo(() => genBoxes(200, 20), []);
  const big = useMemo(() => genBoxes(100, 42), []);

  return (
    <div className="pixel-stars">
      <div className="ps ps1" style={{ boxShadow: small }} />
      <div className="ps ps2" style={{ boxShadow: medium }} />
      <div className="ps ps3" style={{ boxShadow: big }} />
      <style>{`
        .pixel-stars {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          -webkit-mask-image: linear-gradient(to bottom, black 78%, transparent 100%);
          mask-image: linear-gradient(to bottom, black 78%, transparent 100%);
        }
        .ps,
        .ps::after {
          position: absolute;
          background: transparent;
          top: 0;
          left: 0;
        }
        .ps {
          width: 1px;
          height: 1px;
          animation: psMove 50s linear infinite;
        }
        .ps2 {
          width: 2px;
          height: 2px;
          animation-duration: 100s;
        }
        .ps3 {
          width: 3px;
          height: 3px;
          animation-duration: 150s;
        }
        .ps::after {
          content: "";
          top: 2000px;
          width: inherit;
          height: inherit;
          box-shadow: inherit;
        }
        @keyframes psMove {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(-2000px);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .ps {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
