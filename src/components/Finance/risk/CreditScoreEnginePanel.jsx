'use client';

export default function CreditScoreEnginePanel({ score }) {
    return (
        <div className="bg-white p-6 rounded-3xl border space-y-2">
            <h3 className="font-bold">Credit Score Engine</h3>

            <div className="text-3xl font-bold text-blue-600">
                {score}/100
            </div>

            <p className="text-xs text-slate-500">
                Based on repayment, order frequency, and exposure.
            </p>
        </div>
    );
}