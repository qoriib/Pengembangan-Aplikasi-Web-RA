export default function SectionHeader({ eyebrow, title, subtitle }) {
  return (
    <div className="space-y-1">
      {eyebrow && <p className="text-xs uppercase tracking-wide text-blue-500 font-semibold">{eyebrow}</p>}
      {title && <h1 className="text-2xl font-bold text-slate-900">{title}</h1>}
      {subtitle && <p className="text-sm text-slate-600">{subtitle}</p>}
    </div>
  );
}
