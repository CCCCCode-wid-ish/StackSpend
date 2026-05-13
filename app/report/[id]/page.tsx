import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import { AuditRecord, PublicAuditPayload } from "@/types/audit";

type ReportPageProps = {
  params: Promise<{ id: string }>;
};

async function getAudit(id: string) {
  try {
    const { data, error } = await supabase
      .from("audits")
      .select("*")
      .eq("id", id)
      .single<AuditRecord>();

    if (error) {
      console.error(error);
      return null;
    }

    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

function parsePublicPayload(record: AuditRecord): PublicAuditPayload | null {
  try {
    return JSON.parse(record.reason) as PublicAuditPayload;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: ReportPageProps): Promise<Metadata> {
  const { id } = await params;
  const audit = await getAudit(id);

  if (!audit) {
    return {
      title: "Report Not Found | StackSpend",
      description: "This AI spend audit report could not be found.",
    };
  }

  const parsed = parsePublicPayload(audit);
  const savings = parsed?.totalSavings ?? audit.savings;
  const title = `Save $${savings}/month on your AI stack`;
  const description = parsed?.summaryReason
    ? parsed.summaryReason
    : `${audit.tool} is currently costing $${audit.current_spend}/month. StackSpend found a savings opportunity.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      images: [`/report/${id}/opengraph-image`],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/report/${id}/opengraph-image`],
    },
  };
}

export default async function ReportPage({ params }: ReportPageProps) {
  const { id } = await params;
  const data = await getAudit(id);

  if (!data) {
    return (
      <main className="min-h-screen bg-black px-6 py-16 text-white">
        <div className="mx-auto max-w-3xl rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
          <h1 className="text-4xl font-bold">Report not found</h1>
          <p className="mt-4 text-zinc-300">
            This audit link is invalid or no longer available.
          </p>
        </div>
      </main>
    );
  }

  const parsed = parsePublicPayload(data);

  if (!parsed) {
    return (
      <main className="min-h-screen bg-black px-6 py-16 text-white">
        <div className="mx-auto max-w-4xl space-y-8">
          <header className="rounded-3xl bg-gradient-to-r from-blue-600 to-purple-700 p-10">
            <p className="text-sm uppercase tracking-[0.2em] text-white/70">StackSpend Report</p>
            <h1 className="mt-3 text-5xl font-bold">Save ${data.savings}/month</h1>
            <p className="mt-4 text-lg text-white/85">
              Current spend: ${data.current_spend}/month.
            </p>
          </header>

          <section className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
            <h2 className="text-2xl font-bold">Recommendation</h2>
            <p className="mt-6 leading-7 text-zinc-300">{data.reason}</p>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="rounded-[2rem] bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.32),_transparent_32%),linear-gradient(135deg,_rgba(8,47,73,1),_rgba(8,145,178,0.85),_rgba(15,23,42,1))] p-10">
          <p className="text-sm uppercase tracking-[0.25em] text-white/70">StackSpend Report</p>
          <h1 className="mt-3 text-5xl font-bold">
            Save ${parsed.totalSavings.toFixed(2)}/month on your AI stack
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-cyan-50/85">{parsed.headline}</p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-5">
              <p className="text-sm text-white/70">Current spend</p>
              <p className="mt-2 text-3xl font-semibold">${parsed.totalCurrentSpend.toFixed(2)}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 p-5">
              <p className="text-sm text-white/70">Optimized spend</p>
              <p className="mt-2 text-3xl font-semibold">${parsed.totalOptimizedSpend.toFixed(2)}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 p-5">
              <p className="text-sm text-white/70">Annual savings</p>
              <p className="mt-2 text-3xl font-semibold">${parsed.annualSavings.toFixed(2)}</p>
            </div>
          </div>
        </header>

        <section className="rounded-[1.75rem] border border-zinc-800 bg-zinc-950 p-8">
          <h2 className="text-2xl font-bold">Audit summary</h2>
          <p className="mt-4 leading-8 text-zinc-300">{parsed.summaryReason}</p>
        </section>

        <section className="rounded-[1.75rem] border border-zinc-800 bg-zinc-950 p-8">
          <h2 className="text-2xl font-bold">Per-tool recommendations</h2>
          <div className="mt-6 grid gap-5">
            {parsed.tools.map((tool, index) => (
              <article
                key={`${tool.tool}-${tool.currentPlan}-${tool.currentSpend}-${index}`}
                className="rounded-[1.5rem] border border-zinc-800 bg-zinc-900/70 p-6"
              >
                <div className="flex flex-col gap-4 md:flex-row md:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">{tool.toolLabel}</p>
                    <h3 className="mt-2 text-2xl font-semibold">
                      ${tool.currentSpend.toFixed(2)} {"->"} ${tool.optimizedSpend.toFixed(2)}
                    </h3>
                    <p className="mt-3 leading-7 text-zinc-300">{tool.reason}</p>
                  </div>
                  <div className="min-w-[220px] rounded-2xl border border-zinc-800 bg-black/40 p-4">
                    <p className="text-sm text-zinc-400">Recommended action</p>
                    <p className="mt-1 font-medium text-cyan-200">{tool.recommendedAction}</p>
                    <p className="mt-4 text-sm text-zinc-400">Savings</p>
                    <p className="mt-1 text-2xl font-semibold text-emerald-300">
                      ${tool.savings.toFixed(2)}/mo
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
