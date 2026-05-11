// Marks this component as a Client Component in Next.js
"use client";

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
   if (savedAudit) {
  const reportUrl = `/report/${savedAudit.id}`;

  console.log(reportUrl);
}

  console.log(savedAudit);
};
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
          <input
            {...register("tool")}
            placeholder="Tool Name"
          />

          {/* Plan input */}
          <input
            {...register("plan")}
            placeholder="Plan"
          />

          {/* Spend input */}
          <input
            type="number"
            {...register("spend")}
            placeholder="Monthly Spend"
          />

          {/* Seats input */}
          <input
            type="number"
            {...register("seats")}
            placeholder="Seats"
          />

          {/* Team size input */}
          <input
            type="number"
            {...register("teamSize")}
            placeholder="Team Size"
          />


          {/* Use case dropdown */}
          <select {...register("useCase")}>

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


          {/* Submit button */}
          <button type="submit">
            Run Audit
          </button>

        </div>

      </form>


      {/* Shows dashboard only if result exists */}
      {result && <ResultsDashboard result={result} />}


      {/* Extra Result Details */}
      {result && (

        <div>

          {/* Shows tool name */}
          <p>Tool: {result.tool}</p>

          {/* Shows current spend */}
          <p>Spend: ${result.currentSpend}</p>

          {/* Shows recommended plan */}
          <p>Plan: {result.recommendedPlan}</p>

          {/* Shows savings */}
          <p>Savings: ${result.savings}</p>

          {/* Shows reason */}
          <p>{result.reason}</p>

        </div>
      )}

    </div>
  );
}