export const StatCard = ({ icon: Icon, label, value, color, detail }) => (
    <div className="flex-1 min-w-[220px] bg-white p-6 rounded-[2rem] border border-slate-200 flex items-center gap-5 shadow-sm hover:shadow-md transition-all duration-300">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color} shadow-inner`}>
            <Icon size={24} />
        </div>
        <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
            <div className="flex items-baseline gap-2">
                <p className="text-2xl font-black text-slate-800">{value.toLocaleString()}</p>
                {detail && <span className="text-[10px] text-rose-500 font-bold uppercase">{detail}</span>}
            </div>
        </div>
    </div>
);