"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { generateAudit } from "@/lib/audit-engine";

const schema = z.object({
  tool: z.string().min(1),
  plan: z.string().min(1),
  spend: z.coerce.number().min(0),
  seats: z.coerce.number().min(1),
  teamSize: z.coerce.number().min(1),
  useCase: z.string().min(1),
});

type FormData = z.infer<typeof schema>;

export default function SpendForm() {
  const [result, setResult] = useState<any>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const saved = localStorage.getItem("audit-result");
    if (saved) setResult(JSON.parse(saved));
  }, []);

  const onSubmit = (data: FormData) => {
    const auditResult = generateAudit(data);

    setResult(auditResult);

    localStorage.setItem(
      "audit-result",
      JSON.stringify(auditResult)
    );
  };

  return (
    <div className="max-w-3xl mx-auto">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800"
      >
        <h2 className="text-3xl font-bold mb-8">
          AI Spend Audit
        </h2>

        <div className="grid gap-6">
          <input {...register("tool")} placeholder="Tool Name" />
          <input {...register("plan")} placeholder="Plan" />
          <input type="number" {...register("spend")} placeholder="Monthly Spend" />
          <input type="number" {...register("seats")} placeholder="Seats" />
          <input type="number" {...register("teamSize")} placeholder="Team Size" />

          <select {...register("useCase")}>
            <option value="">Select Use Case</option>
            <option value="coding">Coding</option>
            <option value="writing">Writing</option>
            <option value="research">Research</option>
            <option value="mixed">Mixed</option>
          </select>

          <button type="submit">
            Run Audit
          </button>
        </div>
      </form>

      {result && (
        <div className="mt-10 bg-zinc-900 p-6 rounded-xl">
          <h2>Audit Result</h2>

          <p>Tool: {result.tool}</p>
          <p>Spend: ${result.currentSpend}</p>
          <p>Plan: {result.recommendedPlan}</p>
          <p>Savings: ${result.savings}</p>
          <p>{result.reason}</p>
        </div>
      )}
    </div>
  );
}