import Link from "next/link";
import { FileText, Files, Lock, Quote } from "lucide-react";
import { styles } from "@/app/styles";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-svh flex-1 bg-background lg:grid-cols-2">
      <div className="flex flex-col px-6 py-8 sm:px-10">
        <Link href="/" className="flex items-center gap-2.5 self-start">
          <span
            className={`flex size-8 items-center justify-center rounded-[7px] text-sm font-semibold text-white ${styles.primaryBgColor}`}
          >
            D
          </span>
          <span className="text-[15px] font-semibold tracking-tight">
            DocuMind
          </span>
        </Link>

        <main className="flex flex-1 items-center justify-center py-4">
          <div className="w-full max-w-105">{children}</div>
        </main>
      </div>

      <aside
        className={`relative hidden overflow-hidden text-white lg:flex lg:flex-col lg:justify-center lg:px-14 ${styles.primaryGradientBg}`}
      >
        {/* dot grid, faded toward the edges */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.14)_1px,transparent_1px)] bg-size-[22px_22px] mask-[radial-gradient(ellipse_at_center,black_35%,transparent_75%)]" />
        {/* soft light */}
        <div className="pointer-events-none absolute -top-32 -right-24 size-105 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-20 size-90 rounded-full bg-white/5 blur-3xl" />

        <div className="relative mx-auto w-full max-w-110">
          <p className="text-[13px] font-medium text-white/70">
            Ask your documents
          </p>
          <h2 className="mt-2 text-[30px] leading-[1.15] font-semibold tracking-tight text-balance">
            Every answer points back to the page it came from.
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-white/75">
            Upload contracts, policies and invoices. Ask in plain language and
            check the source in one click.
          </p>

          {/* one chat about one document */}
          <div className="mt-12 overflow-hidden rounded-xl bg-card text-foreground shadow-[0_24px_48px_rgba(8,20,45,0.35)]">
            <div className="flex items-center gap-2.5 border-b px-5 py-3.5">
              <span
                className={`flex size-7 items-center justify-center rounded-md ${styles.primarySoftBgColor} ${styles.primaryTextColor}`}
              >
                <FileText className="size-3.5" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-[13.5px] font-medium">
                  Supplier agreement.pdf
                </p>
                <p className="text-[11.5px] text-muted-foreground">
                  PDF · 12 pages
                </p>
              </div>
            </div>

            <div className="space-y-4 px-5 py-5">
              <div
                className={`ml-auto w-fit max-w-[80%] rounded-[9px_9px_3px_9px] px-3.5 py-2 text-[13px] ${styles.primarySoftBgColor}`}
              >
                What is the notice period?
              </div>

              <div className="flex max-w-[88%] items-start gap-2.5">
                <span
                  className={`flex size-6 shrink-0 items-center justify-center rounded-md text-[11px] font-semibold text-white ${styles.primaryBgColor}`}
                >
                  D
                </span>
                <div className="rounded-[9px_9px_9px_3px] bg-muted px-3.5 py-2.5">
                  <p className="text-[13.5px] leading-snug font-semibold">
                    Three months written notice, effective at the end of a
                    calendar quarter.
                  </p>
                  <p className="mt-1 text-[12.5px] leading-snug text-muted-foreground">
                    Either party can terminate; no reason required.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
