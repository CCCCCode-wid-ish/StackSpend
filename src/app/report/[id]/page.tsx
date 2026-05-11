import { supabase } from "@/lib/supabase";

export default async function ReportPage({
  params,
}: {
  params: { id: string };
}) {
  const { data } = await supabase
    .from("audits")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!data) {
    return <div>Report not found</div>;
  }

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <h1 className="text-5xl font-bold mb-6">
        AI Spend Audit Report
      </h1>

      <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800">
        <p><b>Tool:</b> {data.tool}</p>

        <p><b>Current Spend:</b> ${data.current_spend}</p>

        <p><b>Recommended Plan:</b> {data.recommended_plan}</p>

        <p className="text-green-400 font-bold">
          Savings: ${data.savings}
        </p>

        <p className="mt-4 text-zinc-300">
          {data.reason}
        </p>
      </div>
    </main>
  );
}