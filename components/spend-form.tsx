"use client";

import { useForm } from "react-hook-form";

export default function SpendForm() {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-3xl mx-auto bg-zinc-900 p-8 rounded-3xl border border-zinc-800"
    >
      <h2 className="text-3xl font-bold mb-8">
        AI Spend Audit
      </h2>

      <div className="grid gap-6">
        <input
          {...register("tool")}
          placeholder="Tool Name"
          className="bg-black border border-zinc-700 p-4 rounded-xl"
        />

        <input
          {...register("plan")}
          placeholder="Plan"
          className="bg-black border border-zinc-700 p-4 rounded-xl"
        />

        <input
          type="number"
          {...register("spend")}
          placeholder="Monthly Spend"
          className="bg-black border border-zinc-700 p-4 rounded-xl"
        />

        <input
          type="number"
          {...register("seats")}
          placeholder="Seats"
          className="bg-black border border-zinc-700 p-4 rounded-xl"
        />

        <input
          type="number"
          {...register("teamSize")}
          placeholder="Team Size"
          className="bg-black border border-zinc-700 p-4 rounded-xl"
        />

        <select
          {...register("useCase")}
          className="bg-black border border-zinc-700 p-4 rounded-xl"
        >
          <option value="coding">Coding</option>
          <option value="writing">Writing</option>
          <option value="research">Research</option>
          <option value="mixed">Mixed</option>
        </select>

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