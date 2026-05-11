type Props = {
  result: any;
};

export default function ResultsDashboard({ result }: Props) {
  const annualSavings = result.savings * 12;

  return (
    <div className="mt-12 space-y-8">

      {/* HERO */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-10 rounded-3xl text-white">
        <p className="text-lg opacity-80">
          Potential Savings
        </p>

        <h1 className="text-6xl font-bold mt-2">
          ${result.savings}/mo
        </h1>

        <p className="text-2xl mt-4">
          ${annualSavings}/year
        </p>
      </div>

      {/* RECOMMENDATION CARD */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
        <h2 className="text-2xl font-bold mb-4">
          Recommendation
        </h2>

        <div className="space-y-3">
          <p>
            <span className="font-semibold">
              Tool:
            </span>{" "}
            {result.tool}
          </p>

          <p>
            <span className="font-semibold">
              Current Spend:
            </span>{" "}
            ${result.currentSpend}
          </p>

          <p>
            <span className="font-semibold">
              Recommended Plan:
            </span>{" "}
            {result.recommendedPlan}
          </p>

          <p className="text-green-400 font-bold">
            Savings: ${result.savings}
          </p>

          <p className="text-zinc-300 leading-7">
            {result.reason}
          </p>
        </div>
      </div>

    </div>
  );
}