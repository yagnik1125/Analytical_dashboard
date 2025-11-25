export default function GradientCard({ title, value, color = "from-indigo-500 to-purple-500" }) {
  return (
    <div
      className={`p-6 rounded-xl shadow-md bg-gradient-to-br ${color} text-white`}
    >
      <p className="text-sm opacity-80">{title}</p>
      <h2 className="text-3xl font-bold mt-2">{value}</h2>
    </div>
  );
}
