export default function GridLayout({ children, cols = 2 }) {
  return (
    <div
      className={`
        grid gap-6 animate-fadeIn
        ${cols === 1 ? "grid-cols-1" : ""}
        ${cols === 2 ? "grid-cols-1 md:grid-cols-2" : ""}
        ${cols === 3 ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : ""}
      `}
    >
      {children}
    </div>
  );
}
