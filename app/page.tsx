export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-10">
      <main className="relative w-full max-w-4xl overflow-hidden rounded-3xl bg-slate-900/70 shadow-[0_24px_80px_rgba(15,23,42,0.85)] border border-slate-800">
        <div className="pointer-events-none absolute -top-32 -left-10 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-10 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl" />

        <div className="relative grid gap-10 p-8 md:grid-cols-[1.2fr,1fr] md:p-10 lg:p-12">
          <section className="space-y-6">
            <header className="space-y-3">
              <p className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-red-200">
                <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                Agnos Candidate Assignment
              </p>
              <h1 className="text-3xl md:text-4xl lg:text-[2.6rem] font-extrabold leading-tight text-slate-50">
                Real‑time Patient
                <span className="block text-slate-300">&amp; Staff Monitoring</span>
              </h1>
              <p className="text-sm md:text-[15px] text-slate-300/80">
                Fill in the patient form on one screen and watch every change
                appear instantly on the staff dashboard. Built with Next.js,
                TailwindCSS, Socket.io, React Hook Form, and Zod.
              </p>
            </header>

            <div className="flex flex-wrap items-center gap-3 text-[11px] font-medium text-slate-300/80">
              <span className="rounded-full bg-slate-800/80 px-3 py-1 border border-slate-700">
                Next.js App Router
              </span>
              <span className="rounded-full bg-slate-800/80 px-3 py-1 border border-slate-700">
                WebSocket Real‑time Sync
              </span>
              <span className="rounded-full bg-slate-800/80 px-3 py-1 border border-slate-700">
                Responsive UI for Mobile &amp; Desktop
              </span>
            </div>

            <p className="text-[11px] text-slate-400">
              To review locally, run{" "}
              <span className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] text-slate-100">
                npm install &amp;&amp; npm run dev
              </span>{" "}
              and open{" "}
              <span className="font-mono text-[10px] text-slate-100">
                http://localhost:3000
              </span>
              .
            </p>
          </section>

          <section className="space-y-4">
            <div className="grid gap-4">
              <a
                href="/patient"
                className="group relative overflow-hidden rounded-2xl border border-blue-500/40 bg-gradient-to-br from-blue-500/30 via-blue-500/10 to-slate-900/60 p-5 text-slate-50 shadow-[0_18px_40px_rgba(37,99,235,0.35)] transition-all hover:-translate-y-0.5 hover:border-blue-300/70 hover:shadow-[0_24px_60px_rgba(59,130,246,0.55)]"
              >
                <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-sky-400/20 blur-2xl" />
                <div className="relative space-y-2">
                  <h2 className="flex items-center gap-2 text-lg font-semibold">
                    Patient Form
                    <span className="rounded-full bg-slate-900/60 px-2 py-0.5 text-[10px] font-medium border border-blue-300/40">
                      /patient
                    </span>
                  </h2>
                  <p className="text-xs text-blue-50/80">
                    Guided form for patients to enter personal, contact, and
                    emergency details with live validation and real‑time status
                    updates.
                  </p>
                  <span className="mt-3 inline-flex items-center text-xs font-semibold text-blue-50 group-hover:translate-x-0.5 group-hover:underline transition-transform">
                    Open Patient Form →
                  </span>
                </div>
              </a>

              <a
                href="/staff"
                className="group relative overflow-hidden rounded-2xl border border-emerald-500/35 bg-gradient-to-br from-emerald-500/25 via-emerald-500/5 to-slate-900/60 p-5 text-slate-50 shadow-[0_16px_36px_rgba(16,185,129,0.32)] transition-all hover:-translate-y-0.5 hover:border-emerald-300/70 hover:shadow-[0_22px_54px_rgba(16,185,129,0.55)]"
              >
                <div className="absolute -left-6 -bottom-6 h-20 w-20 rounded-full bg-emerald-400/25 blur-2xl" />
                <div className="relative space-y-2">
                  <h2 className="flex items-center gap-2 text-lg font-semibold">
                    Staff View
                    <span className="rounded-full bg-slate-900/60 px-2 py-0.5 text-[10px] font-medium border border-emerald-300/40">
                      /staff
                    </span>
                  </h2>
                  <p className="text-xs text-emerald-50/85">
                    Real‑time monitoring dashboard that reflects every field
                    from the patient form and highlights statuses: filling,
                    submitted, or inactive.
                  </p>
                  <span className="mt-3 inline-flex items-center text-xs font-semibold text-emerald-50 group-hover:translate-x-0.5 group-hover:underline transition-transform">
                    Open Staff Dashboard →
                  </span>
                </div>
              </a>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-[11px] text-slate-300 flex flex-col gap-1">
              <p className="font-medium text-slate-100">
                Review tip for interviewer
              </p>
              <p>
                Open{" "}
                <span className="font-mono text-[10px] text-slate-100">
                  /patient
                </span>{" "}
                and{" "}
                <span className="font-mono text-[10px] text-slate-100">
                  /staff
                </span>{" "}
                in two windows to see live synchronization via WebSockets.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
