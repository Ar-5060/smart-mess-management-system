function SectionGrid({ children, columns = 2 }) {
  return (
    <div
      className="section-grid"
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      }}
    >
      {children}
    </div>
  );
}

export default SectionGrid;