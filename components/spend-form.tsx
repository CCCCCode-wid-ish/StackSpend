// Marks this component as a Client Component in Next.js
"use client";

import { supabase } from "@/lib/supabase";

// Imports React hooks
import { useEffect, useState } from "react";

// Imports form handling library
import { useForm } from "react-hook-form";

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

    // Registers form inputs
    register,

    // Handles form submission
    handleSubmit,

    // Stores validation errors
    formState: { errors },

  } = useForm<FormData>({

    // Uses Zod validation schema
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
  const auditResult = generateAudit(data);

  setResult(auditResult);

  localStorage.setItem(
    "audit-result",
    JSON.stringify(auditResult)
  );

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

  console.log(savedAudit);
};

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

      // Generates dynamic report link
      const reportUrl = `/report/${savedAudit.id}`;

      // Stores link in state
      setReportLink(reportUrl);

      // Logs report URL
      console.log(reportUrl);
    }

    // Logs saved audit object
    console.log(savedAudit);
  };


  // Returns UI content
  return (

    // Main container
    <div className="max-w-3xl mx-auto">

      {/* Form Section */}
      <form

        // Handles form submit
        onSubmit={handleSubmit(onSubmit)}

        // Form styling
        className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800"
      >

        {/* Form heading */}
        <h2 className="text-3xl font-bold mb-8">
          AI Spend Audit
        </h2>


        {/* Input container */}
        <div className="grid gap-6">

          {/* Tool input */}
          <div>
            <input
              {...register("tool")}
              placeholder="Tool Name"
              className="bg-black border border-zinc-700 p-4 rounded-xl w-full"
            />

            {errors.tool && (
              <p className="text-red-500 mt-2">
                Tool is required
              </p>
            )}
          </div>

          {/* Plan input */}
          <div>
            <input
              {...register("plan")}
              placeholder="Plan"
              className="bg-black border border-zinc-700 p-4 rounded-xl w-full"
            />

            {errors.plan && (
              <p className="text-red-500 mt-2">
                Plan is required
              </p>
            )}
          </div>

          {/* Spend input */}
          <div>
            <input
              type="number"
              {...register("spend")}
              placeholder="Monthly Spend"
              className="bg-black border border-zinc-700 p-4 rounded-xl w-full"
            />

            {errors.spend && (
              <p className="text-red-500 mt-2">
                Invalid spend amount
              </p>
            )}
          </div>

          {/* Seats input */}
          <div>
            <input
              type="number"
              {...register("seats")}
              placeholder="Seats"
              className="bg-black border border-zinc-700 p-4 rounded-xl w-full"
            />

            {errors.seats && (
              <p className="text-red-500 mt-2">
                Seats must be at least 1
              </p>
            )}
          </div>

          {/* Team size input */}
          <div>
            <input
              type="number"
              {...register("teamSize")}
              placeholder="Team Size"
              className="bg-black border border-zinc-700 p-4 rounded-xl w-full"
            />

            {errors.teamSize && (
              <p className="text-red-500 mt-2">
                Team size must be at least 1
              </p>
            )}
          </div>


          {/* Use case dropdown */}
          <div>
            <select
              {...register("useCase")}
              className="bg-black border border-zinc-700 p-4 rounded-xl w-full"
            >

              {/* Default option */}
              <option value="">
                Select Use Case
              </option>

              {/* Coding option */}
              <option value="coding">
                Coding
              </option>

              {/* Writing option */}
              <option value="writing">
                Writing
              </option>

              {/* Research option */}
              <option value="research">
                Research
              </option>

              {/* Mixed option */}
              <option value="mixed">
                Mixed
              </option>

            </select>

            {errors.useCase && (
              <p className="text-red-500 mt-2">
                Please select a use case
              </p>
            )}
          </div>


          {/* Submit button */}
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-xl font-semibold hover:scale-105 transition"
          >
            Run Audit
          </button>

        </div>

      </form>


      {/* Shows dashboard only if result exists */}
      {result && <ResultsDashboard result={result} />}


      {/* Extra Result Details */}
      {result && (

        <div className="mt-10 bg-zinc-900 p-6 rounded-2xl border border-zinc-800 space-y-4">

          {/* Shows tool name */}
          <p>
            <span className="font-bold">
              Tool:
            </span>{" "}
            {result.tool}
          </p>

          {/* Shows current spend */}
          <p>
            <span className="font-bold">
              Spend:
            </span>{" "}
            ${result.currentSpend}
          </p>

          {/* Shows recommended plan */}
          <p>
            <span className="font-bold">
              Plan:
            </span>{" "}
            {result.recommendedPlan}
          </p>

          {/* Shows savings */}
          <p className="text-green-400 font-bold">
            Savings: ${result.savings}
          </p>

          {/* Shows reason */}
          <p className="text-zinc-300">
            {result.reason}
          </p>

        </div>
      )}


      {/* Public Report Link */}
      {reportLink && (

        <div className="mt-8 bg-zinc-900 p-6 rounded-2xl border border-zinc-800">

          {/* Report heading */}
          <h2 className="text-2xl font-bold mb-4">
            Shareable Report
          </h2>

          {/* Public report URL */}
          <a
            href={reportLink}
            className="text-blue-400 underline break-all"
          >
            {reportLink}
          </a>

        </div>
      )}

    </div>
  );
}