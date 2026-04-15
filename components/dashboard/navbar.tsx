export default function Navbar() {
  return (
    <header className="flex items-center justify-between bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold text-gray-800">Overview</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
          U
        </div>
      </div>
    </header>
  );
}
