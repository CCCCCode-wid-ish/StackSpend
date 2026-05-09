import { DollarSign, ShieldCheck, Zap, Share2 } from "lucide-react";

const features = [
  {
    title: "Instant Audit",
    description: "Analyze your AI spending instantly.",
    icon: Zap,
  },
  {
    title: "Savings Detection",
    description: "Discover hidden cost reduction opportunities.",
    icon: DollarSign,
  },
  {
    title: "Smart Recommendations",
    description: "Get usage-fit plan suggestions.",
    icon: ShieldCheck,
  },
  {
    title: "Shareable Reports",
    description: "Share beautiful public audit reports.",
    icon: Share2,
  },
];

export default function Features() {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <div
              key={feature.title}
              className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 hover:border-blue-500 transition"
            >
              <Icon className="w-10 h-10 text-blue-400 mb-4" />

              <h3 className="text-xl font-semibold mb-2">
                {feature.title}
              </h3>

              <p className="text-zinc-400">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}