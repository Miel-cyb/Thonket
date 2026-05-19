import React from 'react';
import { ArrowRight } from 'lucide-react';

/**
 * ConfigTile Component
 * Reusable single card component for individual configuration modules
 */
export default function ConfigTile({ title, description, icon: Icon, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="group relative flex flex-col justify-between text-left bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-blue-500/30 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all duration-300"
        >
            <div className="space-y-4 w-full">
                {/* Icon Header */}
                <div className="inline-flex items-center justify-center p-3 bg-slate-50 text-slate-600 rounded-xl group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors duration-300">
                    <Icon size={22} strokeWidth={2} />
                </div>

                {/* Content */}
                <div className="space-y-1.5">
                    <h3 className="text-base font-semibold text-slate-900 group-hover:text-blue-600 transition-colors duration-200">
                        {title}
                    </h3>
                    <p className="text-[13px] font-normal leading-relaxed text-slate-500">
                        {description}
                    </p>
                </div>
            </div>

            {/* Action Footer */}
            <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between w-full text-xs font-semibold text-slate-400 group-hover:text-blue-600 transition-colors duration-200">
                <span>Configure settings</span>
                <ArrowRight size={14} className="transform -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />
            </div>
        </button>
    );
}