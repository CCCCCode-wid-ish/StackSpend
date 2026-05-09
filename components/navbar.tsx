export default function Navbar() {
  return (
    <nav className="w-full border-b border-zinc-800 bg-black/70 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
          StackSpend
        </h1>

        <button className="bg-white text-black px-5 py-2 rounded-xl font-medium hover:scale-105 transition">
          Run Audit
        </button>
      </div>
    </nav>
  );
}