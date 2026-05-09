export default function SavingsPreview() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto bg-gradient-to-r from-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl p-10">
        <h2 className="text-4xl font-bold mb-10 text-center">
          Example Savings Report
        </h2>

        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div className="bg-black rounded-2xl p-6 border border-zinc-800">
            <p className="text-zinc-400">Before</p>
            <h3 className="text-4xl font-bold text-red-400 mt-3">
              $540
            </h3>
          </div>

          <div className="bg-black rounded-2xl p-6 border border-zinc-800">
            <p className="text-zinc-400">After</p>
            <h3 className="text-4xl font-bold text-green-400 mt-3">
              $310
            </h3>
          </div>

          <div className="bg-black rounded-2xl p-6 border border-zinc-800">
            <p className="text-zinc-400">Annual Savings</p>
            <h3 className="text-4xl font-bold text-blue-400 mt-3">
              $2760
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
}