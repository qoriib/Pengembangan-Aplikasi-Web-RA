export default function Table({ columns, gridTemplateColumns, data, renderRow }) {
  return (
    <div className="space-y-2">
      <div className="table-head" style={{ gridTemplateColumns }}>
        {columns.map((col) => (
          <span key={col}>{col}</span>
        ))}
      </div>
      {data.map((row, idx) => renderRow(row, idx))}
    </div>
  );
}
