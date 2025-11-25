export default function Card({ title, children, className = "" }) {
  return (
    <div
      className={`bg-white p-6 rounded-xl shadow-md border border-gray-100 ${className}`}
    >
      {title && (
        <h3 className="text-lg font-semibold mb-4 text-gray-700">{title}</h3>
      )}
      {children}
    </div>
  );
}
