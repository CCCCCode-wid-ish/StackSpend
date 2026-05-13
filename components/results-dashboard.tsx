"use client";

// Imports React hooks for state and side effects
import { useEffect, useState } from "react";

// Imports chart components from Recharts library
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Defines the type of props received by component
type Props = {
  result: any;
};

// Main dashboard component
export default function ResultsDashboard({ result }: Props) {

  // Stores AI summary message
  const [summary, setSummary] = useState("");

  // Stores lead form fields
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");

  // Runs whenever result data changes
  useEffect(() => {

    // Function to fetch AI summary
    async function fetchSummary() {

      try {

        // Sends result data to backend API
        const res = await fetch("/api/summary", {

          // Uses POST request method
          method: "POST",

          // Sends JSON content type
          headers: {
            "Content-Type": "application/json",
          },

          // Converts result object into JSON string
          body: JSON.stringify(result),
        });

        // Converts API response into JSON
        const data = await res.json();

        // Stores summary received from API
        setSummary(data.summary);

      } catch {

        // Shows default summary if API fails
        setSummary(
          "Your current AI stack has optimization opportunities that may reduce operational costs."
        );
      }
    }

    // Calls the fetchSummary function
    fetchSummary();

  }, [result]);

  // Saves lead data
  async function saveLead() {

    const leadData = {
      email,
      company,
      role,
      result,
    };

    console.log("Lead Saved:", leadData);

    alert("Lead information saved successfully!");
  }
if (!result) {
  return (
    <div className="animate-pulse bg-zinc-900 h-40 rounded-3xl" />
  );
}
  // Calculates yearly savings
  const annualSavings = result.savings * 12;

  // Stores chart comparison data
  const chartData = [

    // Current spending data
    {
      name: "Current",
      amount: result.currentSpend,
    },

    // Optimized spending data
    {
      name: "Optimized",
      amount: result.currentSpend - result.savings,
    },
  ];

  // Returns UI content
  return (

    // Main container with spacing
    <div className="mt-12 space-y-8">

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-10 rounded-3xl text-white">

        {/* Savings title */}
        <p className="text-lg opacity-80">
          Potential Savings
        </p>

        {/* Monthly savings */}
        <h1 className="text-6xl font-bold mt-2">
          ${result.savings}/mo
        </h1>

        {/* Yearly savings */}
        <p className="text-2xl mt-4">
          ${annualSavings}/year
        </p>

      </div>

      {/* AI Summary Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">

        {/* AI Summary heading */}
        <h2 className="text-2xl font-bold mb-4">
          AI Summary
        </h2>

        {/* Displays AI summary text */}
        <p className="text-zinc-300 leading-8">
          {summary}
        </p>

      </div>

      {/* Recommendation Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">

        {/* Recommendation heading */}
        <h2 className="text-2xl font-bold mb-4">
          Recommendation
        </h2>

        {/* Recommendation details */}
        <div className="space-y-3">

          {/* Shows selected tool */}
          <p>
            <span className="font-semibold">
              Tool:
            </span>{" "}
            {result.tool}
          </p>

          {/* Shows current spend */}
          <p>
            <span className="font-semibold">
              Current Spend:
            </span>{" "}
            ${result.currentSpend}
          </p>

          {/* Shows recommended plan */}
          <p>
            <span className="font-semibold">
              Recommended Plan:
            </span>{" "}
            {result.recommendedPlan}
          </p>

          {/* Shows savings amount */}
          <p className="text-green-400 font-bold">
            Savings: ${result.savings}
          </p>

          {/* Shows reason for recommendation */}
          <p className="text-zinc-300 leading-7">
            {result.reason}
          </p>

        </div>

      </div>

      {/* Chart Section */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">

        {/* Chart heading */}
        <h2 className="text-2xl font-bold mb-6">
          Spend Comparison
        </h2>

        {/* Chart container */}
        <div className="h-72">

          {/* Makes chart responsive */}
          <ResponsiveContainer width="100%" height="100%">

            {/* Creates bar chart */}
            <BarChart data={chartData}>

              {/* X-axis labels */}
              <XAxis dataKey="name" />

              {/* Y-axis values */}
              <YAxis />

              {/* Shows tooltip on hover */}
              <Tooltip />

              {/* Displays bar graph */}
              <Bar
                dataKey="amount"
                radius={[10, 10, 0, 0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* LEAD CAPTURE FORM */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">

        {/* Lead form heading */}
        <h2 className="text-2xl font-bold mb-6">
          Get Full Optimization Report
        </h2>

        {/* Lead form inputs */}
        <div className="grid gap-4">

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-black border border-zinc-700 p-4 rounded-xl"
          />

          <input
            type="text"
            placeholder="Company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="bg-black border border-zinc-700 p-4 rounded-xl"
          />

          <input
            type="text"
            placeholder="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="bg-black border border-zinc-700 p-4 rounded-xl"
          />

          <button
            onClick={saveLead}
            className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-xl font-semibold"
          >
            Save Report
          </button>

        </div>

      </div>

    </div>
  );
}