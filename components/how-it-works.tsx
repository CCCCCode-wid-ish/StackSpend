const steps = [
  "Add your AI tools",
  "Get optimization recommendations",
  "Reduce monthly AI spend",
];

export default function HowItWorks() {
  return (
    <section className="py-24 px-6 text-center">
      <h2 className="text-4xl font-bold mb-14">
        How It Works
      </h2>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {steps.map((step, index) => (
          <div
            key={step}
            className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10"
          >
            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-2xl font-bold mx-auto mb-6">
              {index + 1}
            </div>

            <h3 className="text-xl font-semibold">
              {step}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
}