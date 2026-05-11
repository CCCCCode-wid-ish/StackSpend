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
    </div>
  );
}