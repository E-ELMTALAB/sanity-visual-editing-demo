import type { SVGProps } from "react";

type TrustBadge = {
  label: string;
  icon: "support" | "wifi" | "refresh";
};

const BADGES: TrustBadge[] = [
  { label: "پشتیبانی واقعی ۲۴/۷", icon: "support" },
  { label: "اتصال پایدار بدون VPN", icon: "wifi" },
  { label: "ضمانت تعویض فوری", icon: "refresh" },
] as const;

const ICONS: Record<TrustBadge["icon"], (props: SVGProps<SVGSVGElement>) => JSX.Element> = {
  support: (props) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M12 3a7 7 0 0 0-7 7v3.5A2.5 2.5 0 0 0 7.5 16H9v-4.25A1.75 1.75 0 0 1 10.75 10h2.5A1.75 1.75 0 0 1 15 11.75V16h1.5a2.5 2.5 0 0 0 2.5-2.5V10a7 7 0 0 0-7-7Z"
        fill="currentColor"
      />
    </svg>
  ),
  wifi: (props) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M3.05 8.46A14 14 0 0 1 12 5c3.27 0 6.27 1.14 8.95 3.46L19.8 10.6A10.52 10.52 0 0 0 12 7.5c-2.76 0-5.34.98-7.8 3.1L3.05 8.46Zm3.42 3.42A9.3 9.3 0 0 1 12 10c2.18 0 4.2.76 5.99 2.02l-2.17 2.18A5.9 5.9 0 0 0 12 13a5.9 5.9 0 0 0-3.82 1.4L6.47 11.88ZM12 16.25c.96 0 1.75.79 1.75 1.75S12.96 19.75 12 19.75 10.25 18.96 10.25 18s.79-1.75 1.75-1.75Z"
        fill="currentColor"
      />
    </svg>
  ),
  refresh: (props) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M6 4h4v2H8.41l.54.54A7 7 0 1 1 5 12H3a9 9 0 1 0 2.64-6.36L6 4Z"
        fill="currentColor"
      />
    </svg>
  ),
};

export default function TrustBadges() {
  return (
    <section dir="rtl" className="mt-8 w-full">
      <div className="flex flex-row-reverse flex-wrap items-center justify-end gap-3 sm:gap-4">
        {BADGES.map((badge) => {
          const Icon = ICONS[badge.icon];

          return (
            <article key={badge.label} className="w-full sm:w-auto">
              <div className="group relative flex w-full flex-row-reverse items-center justify-between gap-4 rounded-full border border-[rgba(148,163,184,0.5)] bg-[linear-gradient(135deg,rgba(15,23,42,0.92),rgba(15,23,42,0.7))] px-4 py-2 shadow-[0_16px_32px_rgba(15,23,42,0.85)] backdrop-blur-[18px] saturate-150 before:absolute before:-right-2 before:top-0 before:h-12 before:w-12 before:rounded-full before:bg-[radial-gradient(circle,rgba(56,189,248,0.65),rgba(56,189,248,0))] before:opacity-80 before:blur-md before:content-['']">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[conic-gradient(at_top_left,#6366f1,#22d3ee)] text-white shadow-[0_10px_20px_rgba(99,102,241,0.4)]">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="flex flex-1 items-center justify-end gap-2 text-white">
                  <span className="h-[7px] w-[7px] rounded-full bg-[#22c55e] shadow-[0_0_0_3px_rgba(34,197,94,0.25)]" />
                  <span className="text-sm font-semibold">{badge.label}</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

