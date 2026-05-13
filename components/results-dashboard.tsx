"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { supabase } from "@/lib/supabase";
import { AuditResult } from "@/types/audit";

type Props = {
  result: AuditResult;
  reportLink?: string;
};

type LeadFormState = {
  email: string;
  company: string;
  role: string;
  teamSize: string;
  honeypot: string;
};

const defaultLeadState: LeadFormState = {
  email: "",
  company: "",
  role: "",
  teamSize: "",
  honeypot: "",
};

export default function ResultsDashboard({ result, reportLink }: Props) {
  const [summary, setSummary] = useState("");
  const [leadState, setLeadState] = useState<LeadFormState>(defaultLeadState);
  const [leadMessage, setLeadMessage] = useState("");
  const [isSavingLead, setIsSavingLead] = useState(false);

  useEffect(() => {
    async function fetchSummary() {
      try {
        const response = await fetch("/api/summary", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(result),
        });

        const data = (await response.json()) as { summary?: string };
        setSummary(data.summary ?? result.summaryReason);
      } catch {
        setSummary(result.summaryReason);
      }
    }

    fetchSummary();
  }, [result]);

  async function saveLead() {
    if (leadState.honeypot.trim()) {
      setLeadMessage("We could not save your details.");
      return;
    }

    if (!leadState.email.trim()) {
      setLeadMessage("Please enter an email address so we can send your audit confirmation.");
      return;
    }

    setIsSavingLead(true);
    setLeadMessage("");

    const { error } = await supabase.from("leads").insert([
      {
        audit_id: result.id ?? null,
        email: leadState.email,
        company: leadState.company || "",
        role: leadState.role || "",
        tool: result.stackLabel,
        estimated_monthly_savings: result.totalSavings,
      },
    ]);

    if (error) {
      console.error(error);
      setLeadMessage("We could not save your details right now.");
      setIsSavingLead(false);
      return;
    }

    await fetch("/api/lead-confirmation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: leadState.email,
        company: leadState.company,
        role: leadState.role,
        teamSize: leadState.teamSize,
        savings: result.totalSavings,
        reportLink,
      }),
    }).catch(() => null);

    setLeadMessage(
      result.credexRecommended
        ? "Confirmation saved. Credex should reach out for larger savings opportunities."
        : "Confirmation saved. We will let you know when better optimization opportunities show up."
    );
    setLeadState(defaultLeadState);
    setIsSavingLead(false);
  }

  const chartData = [
    {
      name: "Current",
      amount: result.totalCurrentSpend,
    },
    {
      name: "Optimized",
      amount: result.totalOptimizedSpend,
    },
  ];

  return (
    <motion.div
      className="mt-12 space-y-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="overflow-hidden rounded-[2rem] bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.32),_transparent_32%),linear-gradient(135deg,_rgba(8,47,73,1),_rgba(8,145,178,0.85),_rgba(15,23,42,1))] p-10 text-white"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-100/70">
          Stack audit result
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-bold md:text-6xl">
          Save ${result.totalSavings.toFixed(2)}/mo across your AI stack
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-cyan-50/85">{result.headline}</p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/8 p-5">
            <p className="text-sm text-cyan-50/70">Current monthly spend</p>
            <p className="mt-2 text-3xl font-semibold">${result.totalCurrentSpend.toFixed(2)}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/8 p-5">
            <p className="text-sm text-cyan-50/70">Optimized monthly spend</p>
            <p className="mt-2 text-3xl font-semibold">${result.totalOptimizedSpend.toFixed(2)}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/8 p-5">
            <p className="text-sm text-cyan-50/70">Annual savings</p>
            <p className="mt-2 text-3xl font-semibold">${result.annualSavings.toFixed(2)}</p>
          </div>
        </div>
      </motion.div>

      {result.credexRecommended && (
        <section className="rounded-[1.75rem] border border-emerald-400/30 bg-emerald-500/10 p-6">
          <h2 className="text-2xl font-bold text-emerald-200">High-savings stack: talk to Credex</h2>
          <p className="mt-3 max-w-3xl text-emerald-50/85">
            This audit found more than $500/month in potential savings. That is large enough to
            justify hands-on help, especially if part of the reduction can be captured through
            credits or procurement changes instead of simple seat cleanup.
          </p>
        </section>
      )}

      {result.totalSavings < 100 && (
        <section className="rounded-[1.75rem] border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-2xl font-bold text-white">You are spending well</h2>
          <p className="mt-3 max-w-3xl text-zinc-300">
            This audit did not find a large, defensible cost-cutting move. That is a good outcome.
            We would rather be honest than manufacture savings that would not survive a finance review.
          </p>
        </section>
      )}

      <section className="rounded-[1.75rem] border border-zinc-800 bg-zinc-950 p-8">
        <h2 className="text-2xl font-bold text-white">Personalized summary</h2>
        <p className="mt-4 text-lg leading-8 text-zinc-300">{summary}</p>
      </section>

      <section className="rounded-[1.75rem] border border-zinc-800 bg-zinc-950 p-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Per-tool breakdown</h2>
            <p className="mt-2 text-zinc-400">
              Current spend, recommended action, savings estimate, and the reason behind each move.
            </p>
          </div>

          {reportLink && (
            <a
              href={reportLink}
              className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-3 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-500/20"
            >
              Open shareable report
            </a>
          )}
        </div>

        <div className="mt-8 grid gap-5">
          {result.tools.map((tool, index) => (
            <article
              key={`${tool.tool}-${tool.currentPlan}-${tool.currentSpend}-${index}`}
              className="rounded-[1.5rem] border border-zinc-800 bg-zinc-900/70 p-6"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">{tool.toolLabel}</p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">
                    ${tool.currentSpend.toFixed(2)} now {"->"} {tool.recommendedAction}
                  </h3>
                  <p className="mt-3 max-w-3xl leading-7 text-zinc-300">{tool.reason}</p>
                </div>

                <div className="min-w-[220px] rounded-2xl border border-zinc-800 bg-black/40 p-4">
                  <p className="text-sm text-zinc-400">Current plan</p>
                  <p className="mt-1 font-medium text-white">{tool.currentPlan}</p>
                  <p className="mt-4 text-sm text-zinc-400">Recommended plan</p>
                  <p className="mt-1 font-medium text-cyan-200">{tool.recommendedPlan}</p>
                  <p className="mt-4 text-sm text-zinc-400">Estimated savings</p>
                  <p className="mt-1 text-2xl font-semibold text-emerald-300">
                    ${tool.savings.toFixed(2)}/mo
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-zinc-800 bg-zinc-950 p-8">
        <h2 className="text-2xl font-bold text-white">Spend comparison</h2>
        <div className="mt-6 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="name" stroke="#a1a1aa" />
              <YAxis stroke="#a1a1aa" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#09090b",
                  border: "1px solid #27272a",
                  borderRadius: "16px",
                  color: "#fff",
                }}
              />
              <Bar dataKey="amount" fill="url(#stackspendGradient)" radius={[12, 12, 0, 0]} />
              <defs>
                <linearGradient id="stackspendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22d3ee" />
                  <stop offset="100%" stopColor="#2dd4bf" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-zinc-800 bg-zinc-950 p-8">
        <h2 className="text-2xl font-bold text-white">
          {result.totalSavings < 100 ? "Notify me about future optimizations" : "Get the audit by email"}
        </h2>
        <p className="mt-3 max-w-3xl text-zinc-400">
          Enter your email to save the report. Company, role, and team size are optional and help
          us tailor follow-up for larger savings opportunities.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <input
            type="email"
            placeholder="Email"
            value={leadState.email}
            onChange={(event) =>
              setLeadState((current) => ({ ...current, email: event.target.value }))
            }
            className="rounded-2xl border border-zinc-800 bg-black px-4 py-3 text-white"
          />
          <input
            type="text"
            placeholder="Company name (optional)"
            value={leadState.company}
            onChange={(event) =>
              setLeadState((current) => ({ ...current, company: event.target.value }))
            }
            className="rounded-2xl border border-zinc-800 bg-black px-4 py-3 text-white"
          />
          <input
            type="text"
            placeholder="Role (optional)"
            value={leadState.role}
            onChange={(event) =>
              setLeadState((current) => ({ ...current, role: event.target.value }))
            }
            className="rounded-2xl border border-zinc-800 bg-black px-4 py-3 text-white"
          />
          <input
            type="number"
            placeholder="Team size (optional)"
            value={leadState.teamSize}
            onChange={(event) =>
              setLeadState((current) => ({ ...current, teamSize: event.target.value }))
            }
            className="rounded-2xl border border-zinc-800 bg-black px-4 py-3 text-white"
          />
        </div>

        <input
          tabIndex={-1}
          autoComplete="off"
          value={leadState.honeypot}
          onChange={(event) =>
            setLeadState((current) => ({ ...current, honeypot: event.target.value }))
          }
          className="hidden"
          aria-hidden="true"
        />

        <button
          onClick={saveLead}
          type="button"
          className="mt-6 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-teal-400 px-6 py-4 font-semibold text-slate-950 transition hover:scale-[1.02]"
        >
          {isSavingLead ? "Saving..." : "Email me the result"}
        </button>

        {leadMessage && <p className="mt-4 text-sm text-zinc-300">{leadMessage}</p>}
      </section>
    </motion.div>
  );
}
