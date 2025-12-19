export default function TabBar({ tabs, activeId, onChange }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`tab-btn ${activeId === tab.id ? 'active' : ''}`}
          onClick={() => onChange(tab.id)}
          type="button"
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
