export default function ChartContainer({ title, children }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md border">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">{title}</h3>
      {children}
    </div>
  );
}
