"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  tool: z.string().min(1, "Tool is required"),
  plan: z.string().min(1, "Plan is required"),
  spend: z.coerce.number().min(0, "Spend cannot be negative"),
  seats: z.coerce.number().min(1, "Minimum 1 seat required"),
  teamSize: z.coerce.number().min(1, "Team size must be at least 1"),
  useCase: z.string().min(1, "Use case is required"),
});

type FormData = z.infer<typeof schema>;

export default function SpendForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const saved = localStorage.getItem("audit-form");

    if (saved) {
      console.log("Loaded:", JSON.parse(saved));
    }
  }, []);

  const onSubmit = (data: FormData) => {
    localStorage.setItem("audit-form", JSON.stringify(data));
    console.log("Saved:", data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-3xl mx-auto bg-zinc-900 p-8 rounded-3xl border border-zinc-800"
    >
      <h2 className="text-3xl font-bold mb-8">AI Spend Audit</h2>

      <div className="grid gap-6">
        <input
          {...register("tool")}
          placeholder="Tool Name"
          className="bg-black border border-zinc-700 p-4 rounded-xl"
        />
        {errors.tool && <p className="text-red-500">{errors.tool.message}</p>}

        <input
          {...register("plan")}
          placeholder="Plan"
          className="bg-black border border-zinc-700 p-4 rounded-xl"
        />
        {errors.plan && <p className="text-red-500">{errors.plan.message}</p>}

        <input
          type="number"
          {...register("spend")}
          placeholder="Monthly Spend"
          className="bg-black border border-zinc-700 p-4 rounded-xl"
        />
        {errors.spend && <p className="text-red-500">{errors.spend.message}</p>}

        <input
          type="number"
          {...register("seats")}
          placeholder="Seats"
          className="bg-black border border-zinc-700 p-4 rounded-xl"
        />
        {errors.seats && <p className="text-red-500">{errors.seats.message}</p>}

        <input
          type="number"
          {...register("teamSize")}
          placeholder="Team Size"
          className="bg-black border border-zinc-700 p-4 rounded-xl"
        />
        {errors.teamSize && (
          <p className="text-red-500">{errors.teamSize.message}</p>
        )}

        <select
          {...register("useCase")}
          className="bg-black border border-zinc-700 p-4 rounded-xl"
        >
          <option value="">Select Use Case</option>
          <option value="coding">Coding</option>
          <option value="writing">Writing</option>
          <option value="research">Research</option>
          <option value="mixed">Mixed</option>
        </select>
        {errors.useCase && (
          <p className="text-red-500">{errors.useCase.message}</p>
        )}

        <button
          type="submit"
          className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-xl font-semibold hover:scale-105 transition"
        >
          Run Audit
        </button>
      </div>
    </form>
  );
}