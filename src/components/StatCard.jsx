export default function StatCard({ title, value, note, color = "bg-cyan-500" }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
      <div className={`w-12 h-12 rounded-xl ${color} mb-4`}></div>
      <p className="text-sm text-slate-500">{title}</p>
      <h3 className="text-2xl font-bold text-slate-800 mt-1">{value}</h3>
      <p className="text-sm text-slate-400 mt-2">{note}</p>
    </div>
  );
}