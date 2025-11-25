export default function InfoCard({ icon, label, value }) {
  return (
    <div className="p-5 bg-white rounded-xl shadow-sm border hover:shadow-md transition">
      <div className="flex items-center gap-3">
        <span className="p-3 rounded-lg bg-indigo-100 text-indigo-600">
          {icon}
        </span>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-xl font-bold text-gray-700">{value}</p>
        </div>
      </div>
    </div>
  );
}
