import React from "react";

export default function GridLayout({ children }) {
  const count = React.Children.count(children);
  const isOdd = count % 2 !== 0;

  return (
    <div
      className="
        grid gap-6 
        grid-cols-1              /* mobile always 1 column */
        sm:grid-cols-2           /* tablet & desktop → 2 columns */
      "
    >
      {React.Children.map(children, (child, index) => {
        const isLast = index === count - 1;

        // If odd number & last child → span 2 cols (only on >=sm)
        const spanClass = isLast && isOdd ? "sm:col-span-2" : "sm:col-span-1";

        return <div className={spanClass}>{child}</div>;
      })}
    </div>
  );
}
