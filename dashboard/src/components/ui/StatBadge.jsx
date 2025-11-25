export default function StatBadge({ value, label }) {
  return (
    <div className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-center">
      <p className="font-bold text-lg">{value}</p>
      <p className="text-sm opacity-75">{label}</p>
    </div>
  );
}
