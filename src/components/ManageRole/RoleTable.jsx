import { Edit3, Trash2, Key } from "lucide-react";

export default function RoleTable({ roles, onEdit }) {
  const thStyle = "px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-50/50 border-b border-slate-100";

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr>
          <th className={thStyle}>Designation</th>
          <th className={thStyle}>Authority Level</th>
          <th className={thStyle}>Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-50">
        {roles.map(role => (
          <tr key={role.id} className="hover:bg-slate-50/30 transition-colors group">
            <td className="px-8 py-6">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-xs">
                  {role.name.charAt(0)}
                </div>
                <span className="font-black text-slate-900 text-sm tracking-tight">{role.name}</span>
              </div>
            </td>
            <td className="px-8 py-6">
              <div className="flex flex-wrap gap-2">
                {role.permissions.map(p => (
                  <span key={p} className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter border border-indigo-100">
                    {p.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </td>
            <td className="px-8 py-6">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onEdit(role)}
                  className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm"
                >
                  <Edit3 size={16} />
                </button>
                <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-red-500 hover:border-red-100 transition-all shadow-sm">
                  <Trash2 size={16} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}