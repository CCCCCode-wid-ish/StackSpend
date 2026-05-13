"use client";

import { useEffect, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { generateAudit } from "@/lib/audit-engine";
import ResultsDashboard from "./results-dashboard";
import { supabase } from "@/lib/supabase";
import { SUPPORTED_TOOLS, TOOL_CONFIG } from "@/data/pricing";
import { AuditRecord, AuditResult, PublicAuditPayload, ToolKey, UseCase } from "@/types/audit";

const toolKeySchema = z.enum([
  "cursor",
  "github-copilot",
  "claude",
  "chatgpt",
  "anthropic-api",
  "openai-api",
  "gemini",
  "windsurf",
]);

const useCaseSchema = z.enum(["coding", "writing", "data", "research", "mixed"]);

const schema = z.object({
  teamSize: z.number().min(1),
  useCase: useCaseSchema,
  honeypot: z.string().optional(),
  tools: z
    .array(
      z.object({
        tool: toolKeySchema,
        plan: z.string().min(1),
        spend: z.number().min(0),
        seats: z.number().min(1),
      })
    )
    .min(1),
});

type FormData = z.infer<typeof schema>;

const FORM_STORAGE_KEY = "stackspend-form";
const RESULT_STORAGE_KEY = "stackspend-audit-result";
const REPORT_STORAGE_KEY = "stackspend-audit-report-link";
const RATE_LIMIT_KEY = "stackspend-last-audit-at";
const RATE_LIMIT_MS = 15_000;

const defaultTool = { tool: "cursor" as ToolKey, plan: "Pro", spend: 20, seats: 1 };
const defaultValues: FormData = {
  teamSize: 3,
  useCase: "coding",
  honeypot: "",
  tools: [defaultTool],
};

function getPublicPayload(result: AuditResult): PublicAuditPayload {
  return {
    stackLabel: result.stackLabel,
    teamSize: result.teamSize,
    useCase: result.useCase,
    totalCurrentSpend: result.totalCurrentSpend,
    totalOptimizedSpend: result.totalOptimizedSpend,
    totalSavings: result.totalSavings,
    annualSavings: result.annualSavings,
    headline: result.headline,
    summaryReason: result.summaryReason,
    credexRecommended: result.credexRecommended,
    tools: result.tools,
  };
}

function getInitialStoredState<T>(storageKey: string): T | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(storageKey);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function getCurrentTimestamp() {
  return Date.now();
}

export default function SpendForm() {
  const [mounted, setMounted] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [reportLink, setReportLink] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmittingAudit, setIsSubmittingAudit] = useState(false);

  const storedDefaults = defaultValues;

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: storedDefaults,
  });

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "tools",
  });

  const watchedTools = useWatch({
    control,
    name: "tools",
  });
  const watchedForm = useWatch({
    control,
  });

  // Hydrate from localStorage after mount to avoid SSR mismatch
  useEffect(() => {
    const storedResult = getInitialStoredState<AuditResult>(RESULT_STORAGE_KEY);
    if (storedResult) setResult(storedResult);

    const storedLink = window.localStorage.getItem(REPORT_STORAGE_KEY) ?? "";
    if (storedLink) setReportLink(storedLink);

    const storedForm = getInitialStoredState<FormData>(FORM_STORAGE_KEY);
    if (storedForm) {
      setValue("teamSize", storedForm.teamSize);
      setValue("useCase", storedForm.useCase);
      replace(storedForm.tools);
    }

    setMounted(true);
  // Run only once on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist form changes to localStorage (only after mount)
  useEffect(() => {
    if (!mounted) return;
    window.localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(watchedForm));
  }, [watchedForm, mounted]);

  const onSubmit = async (data: FormData) => {
    if (data.honeypot?.trim()) {
      setSubmitError("We could not submit this audit.");
      return;
    }

    const lastAuditAt = Number(window.localStorage.getItem(RATE_LIMIT_KEY) ?? "0");

    if (getCurrentTimestamp() - lastAuditAt < RATE_LIMIT_MS) {
      setSubmitError("Please wait a few seconds before running another audit.");
      return;
    }

    setSubmitError("");
    setIsSubmittingAudit(true);

    const auditResult = generateAudit({
      teamSize: data.teamSize,
      useCase: data.useCase as UseCase,
      tools: data.tools,
    });

    setResult(auditResult);
    window.localStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify(auditResult));
    window.localStorage.setItem(RATE_LIMIT_KEY, String(getCurrentTimestamp()));

    try {
      const publicPayload = getPublicPayload(auditResult);

      const { data: savedAudit, error } = await supabase
        .from("audits")
        .insert([
          {
            tool: auditResult.tools.map((tool) => tool.toolLabel).join(", "),
            current_spend: auditResult.totalCurrentSpend,
            recommended_plan: auditResult.headline,
            savings: auditResult.totalSavings,
            reason: JSON.stringify(publicPayload),
          },
        ])
        .select()
        .single<AuditRecord>();

      if (error) {
        throw error;
      }

      if (savedAudit) {
        const nextResult = { ...auditResult, id: savedAudit.id };
        const nextReportLink = `/report/${savedAudit.id}`;

        setResult(nextResult);
        setReportLink(nextReportLink);
        window.localStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify(nextResult));
        window.localStorage.setItem(REPORT_STORAGE_KEY, nextReportLink);
      }
    } catch (error) {
      console.error(error);
      setSubmitError(
        "The audit ran successfully, but we could not save the shareable report right now."
      );
      setReportLink("");
      window.localStorage.removeItem(REPORT_STORAGE_KEY);
    } finally {
      setIsSubmittingAudit(false);
    }
  };

  return (
    <div id="audit-form" className="mx-auto max-w-5xl px-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-[2rem] border border-zinc-800 bg-zinc-950/90 p-8 shadow-2xl shadow-blue-950/20"
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-cyan-300/70">
              AI Spend Audit
            </p>
            <h2 className="mt-2 text-3xl font-bold text-white md:text-4xl">
              Audit the whole stack, not just one subscription
            </h2>
          </div>

          <button
            type="button"
            onClick={() => append(defaultTool)}
            className="rounded-2xl border border-cyan-400/30 bg-cyan-500/10 px-5 py-3 font-semibold text-cyan-200 transition hover:bg-cyan-500/20"
          >
            Add another tool
          </button>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm font-medium text-zinc-200">Team size</span>
            <input
              type="number"
              {...register("teamSize", { valueAsNumber: true })}
              className="rounded-2xl border border-zinc-800 bg-black px-4 py-3 text-white"
            />
            {errors.teamSize && (
              <span className="text-sm text-rose-400">Team size must be at least 1.</span>
            )}
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-zinc-200">Primary use case</span>
            <select
              {...register("useCase")}
              className="rounded-2xl border border-zinc-800 bg-black px-4 py-3 text-white"
            >
              <option value="coding">Coding</option>
              <option value="writing">Writing</option>
              <option value="data">Data</option>
              <option value="research">Research</option>
              <option value="mixed">Mixed</option>
            </select>
          </label>
        </div>

        <input
          tabIndex={-1}
          autoComplete="off"
          {...register("honeypot")}
          className="hidden"
          aria-hidden="true"
        />

        <div className="mt-8 space-y-5">
          {fields.map((field, index) => {
            const selectedTool = watchedTools?.[index]?.tool ?? defaultTool.tool;
            const plans = TOOL_CONFIG[selectedTool].plans;

            return (
              <div
                key={field.id}
                className="rounded-[1.75rem] border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 p-6"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                      Tool {index + 1}
                    </p>
                    <p className="text-lg font-semibold text-white">
                      {TOOL_CONFIG[selectedTool].label}
                    </p>
                  </div>

                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="rounded-xl border border-zinc-700 px-3 py-2 text-sm text-zinc-300 transition hover:border-rose-400 hover:text-rose-300"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-4">
                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-zinc-200">Tool</span>
                    <select
                      {...register(`tools.${index}.tool`)}
                      onChange={(event) => {
                        const nextTool = event.target.value as ToolKey;
                        setValue(`tools.${index}.tool`, nextTool);
                        setValue(`tools.${index}.plan`, TOOL_CONFIG[nextTool].plans[0].label);
                      }}
                      className="rounded-2xl border border-zinc-800 bg-black px-4 py-3 text-white"
                    >
                      {SUPPORTED_TOOLS.map((tool) => (
                        <option key={tool.key} value={tool.key}>
                          {tool.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-zinc-200">Plan</span>
                    <select
                      {...register(`tools.${index}.plan`)}
                      className="rounded-2xl border border-zinc-800 bg-black px-4 py-3 text-white"
                    >
                      {plans.map((plan) => (
                        <option key={plan.label} value={plan.label}>
                          {plan.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-zinc-200">Monthly spend</span>
                    <input
                      type="number"
                      step="0.01"
                      {...register(`tools.${index}.spend`, { valueAsNumber: true })}
                      className="rounded-2xl border border-zinc-800 bg-black px-4 py-3 text-white"
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-zinc-200">Seats</span>
                    <input
                      type="number"
                      {...register(`tools.${index}.seats`, { valueAsNumber: true })}
                      className="rounded-2xl border border-zinc-800 bg-black px-4 py-3 text-white"
                    />
                  </label>
                </div>

                {errors.tools?.[index] && (
                  <p className="mt-3 text-sm text-rose-400">
                    Please complete all fields for this tool entry.
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="max-w-2xl text-sm leading-6 text-zinc-400">
            The audit engine compares seat count, plan fit, likely same-vendor downgrades,
            cheaper alternatives for the same use case, and whether high API spend may be
            better handled through credits.
          </p>

          <button
            type="submit"
            className="rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-teal-400 px-8 py-4 font-semibold text-slate-950 transition hover:scale-[1.02]"
          >
            {isSubmittingAudit ? "Saving audit..." : "Run stack audit"}
          </button>
        </div>

        {submitError && <p className="mt-5 text-sm text-amber-300">{submitError}</p>}
      </form>

      {result && (
        <ResultsDashboard
          result={result}
          reportLink={reportLink}
        />
      )}
    </div>
  );
}
