// Marks this component as a Client Component in Next.js
"use client";

// Imports React hooks
import { useEffect, useState } from "react";

// Imports form handling library
import { useForm } from "react-hook-form";   // ✅ FIXED (MISSING IMPORT)

// Imports Zod validation library
import { z } from "zod";

// Connects Zod validation with React Hook Form
import { zodResolver } from "@hookform/resolvers/zod";

// Imports custom audit logic function
import { generateAudit } from "@/lib/audit-engine";

// Imports dashboard component
import ResultsDashboard from "./results-dashboard";

// Imports Supabase client
import { supabase } from "@/lib/supabase";

// Creates validation rules for form fields
const schema = z.object({

  // Tool name must not be empty
  tool: z.string().min(1),

  // Plan must not be empty
  plan: z.string().min(1),

  // Spend must be a number greater than or equal to 0
  spend: z.coerce.number().min(0),

  // Seats must be at least 1
  seats: z.coerce.number().min(1),

  // Team size must be at least 1
  teamSize: z.coerce.number().min(1),

  // Use case must not be empty
  useCase: z.string().min(1),
});

// Creates TypeScript type from schema
type FormData = z.infer<typeof schema>;

// Main form component
export default function SpendForm() {

  // Stores audit result
  const [result, setResult] = useState<any>(null);

  // Stores generated public report URL
  const [reportLink, setReportLink] = useState("");

  // Initializes React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // Runs once when component loads
  useEffect(() => {

    // Gets saved audit result from local storage
    const saved = localStorage.getItem("audit-result");

    // Restores saved result if available
    if (saved) setResult(JSON.parse(saved));

  }, []);

  // Runs when form is submitted
  const onSubmit = async (data: FormData) => {

    // Generates audit result
    const auditResult = generateAudit(data);

    // Stores result in state
    setResult(auditResult);

    // Saves result to local storage
    localStorage.setItem(
      "audit-result",
      JSON.stringify(auditResult)
    );

    // Saves audit into Supabase database
    const { data: savedAudit, error } = await supabase
      .from("audits")
      .insert([
        {
          tool: auditResult.tool,
          current_spend: auditResult.currentSpend,
          recommended_plan: auditResult.recommendedPlan,
          savings: auditResult.savings,
          reason: auditResult.reason,
        },
      ])
      .select()
      .single();

    // Shows error if database save fails
    if (error) {
      console.error(error);
      return;
    }

    // Creates public report URL
    if (savedAudit) {

      const reportUrl = `/report/${savedAudit.id}`;

      setReportLink(reportUrl);

      console.log(reportUrl);
    }

    console.log(savedAudit);
  };

  // Returns UI content
  return (

    // Main container
    <div className="max-w-3xl mx-auto">

      {/* Form Section */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800"
      >

        <h2 className="text-3xl font-bold mb-8">
          AI Spend Audit
        </h2>

        <div className="grid gap-6">

          <input {...register("tool")} placeholder="Tool Name" className="bg-black border border-zinc-700 p-4 rounded-xl w-full" />
          {errors.tool && <p className="text-red-500">Tool is required</p>}

          <input {...register("plan")} placeholder="Plan" className="bg-black border border-zinc-700 p-4 rounded-xl w-full" />
          {errors.plan && <p className="text-red-500">Plan is required</p>}

          <input type="number" {...register("spend")} placeholder="Monthly Spend" className="bg-black border border-zinc-700 p-4 rounded-xl w-full" />
          {errors.spend && <p className="text-red-500">Invalid spend amount</p>}

          <input type="number" {...register("seats")} placeholder="Seats" className="bg-black border border-zinc-700 p-4 rounded-xl w-full" />
          {errors.seats && <p className="text-red-500">Seats must be at least 1</p>}

          <input type="number" {...register("teamSize")} placeholder="Team Size" className="bg-black border border-zinc-700 p-4 rounded-xl w-full" />
          {errors.teamSize && <p className="text-red-500">Team size must be at least 1</p>}

          <select {...register("useCase")} className="bg-black border border-zinc-700 p-4 rounded-xl w-full">
            <option value="">Select Use Case</option>
            <option value="coding">Coding</option>
            <option value="writing">Writing</option>
            <option value="research">Research</option>
            <option value="mixed">Mixed</option>
          </select>

          <button type="submit" className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-xl font-semibold hover:scale-105 transition">
            Run Audit
          </button>

        </div>
      </form>

      {/* Dashboard */}
      {result && <ResultsDashboard result={result} />}

      {/* Extra Result Details */}
      {result && (
        <div className="mt-10 bg-zinc-900 p-6 rounded-2xl border border-zinc-800 space-y-4">

          <p><b>Tool:</b> {result.tool}</p>
          <p><b>Spend:</b> ${result.currentSpend}</p>
          <p><b>Plan:</b> {result.recommendedPlan}</p>
          <p className="text-green-400 font-bold">Savings: ${result.savings}</p>
          <p className="text-zinc-300">{result.reason}</p>

        </div>
      )}

      {/* Shareable Report */}
      {reportLink && (
        <div className="mt-8 bg-zinc-900 p-6 rounded-2xl border border-zinc-800">

          <h2 className="text-2xl font-bold mb-4">
            Shareable Report
          </h2>

          <a href={reportLink} className="text-blue-400 underline break-all">
            {reportLink}
          </a>

        </div>
      )}

      {/* LEAD CAPTURE FORM */}
      <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 mt-8">

        <h2 className="text-2xl font-bold mb-6">
          Get Full Optimization Report
        </h2>

        <div className="grid gap-4">

          <input type="email" placeholder="Email" className="bg-black border border-zinc-700 p-4 rounded-xl" />
          <input type="text" placeholder="Company" className="bg-black border border-zinc-700 p-4 rounded-xl" />
          <input type="text" placeholder="Role" className="bg-black border border-zinc-700 p-4 rounded-xl" />

          <button className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-xl font-semibold">
            Save Report
          </button>

        </div>
      </div>

    </div>
  );
}