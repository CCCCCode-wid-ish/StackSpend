"use client";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative py-28 px-6 text-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-5xl mx-auto"
      >
        <h1 className="text-5xl md:text-7xl font-bold leading-tight">
          Stop Overspending
          <br />
          on AI Tools
        </h1>

        <p className="text-zinc-400 text-lg md:text-xl mt-6 max-w-2xl mx-auto">
          Audit your AI stack in under 60 seconds and uncover hidden
          savings opportunities.
        </p>

        <div className="mt-10 flex flex-col md:flex-row items-center justify-center gap-4">
          <button className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 rounded-2xl font-semibold hover:scale-105 transition">
            Analyze My AI Spend
          </button>

          <button className="border border-zinc-700 px-8 py-4 rounded-2xl hover:bg-zinc-900 transition">
            View Demo Report
          </button>
        </div>

        <div className="mt-16 bg-zinc-900/70 border border-zinc-800 rounded-3xl p-8 max-w-3xl mx-auto backdrop-blur">
          <div className="flex justify-between mb-4">
            <span className="text-zinc-400">Current Spend</span>
            <span className="font-bold text-red-400">$540/mo</span>
          </div>

          <div className="flex justify-between mb-4">
            <span className="text-zinc-400">Optimized Spend</span>
            <span className="font-bold text-green-400">$310/mo</span>
          </div>

          <div className="border-t border-zinc-800 pt-4 flex justify-between text-xl font-bold">
            <span>Annual Savings</span>
            <span className="text-green-400">$2760</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}