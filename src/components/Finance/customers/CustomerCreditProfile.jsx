'use client';

export default function CustomerCreditProfile({ customer }) {
    return (
        <div className="bg-white rounded-3xl border p-6 space-y-3">
            <h3 className="font-bold">{customer.name}</h3>

            <div className="text-sm text-slate-600">
                <p>Credit Limit: {customer.creditLimit}</p>
                <p>Used: {customer.usedCredit}</p>
                <p>Risk Score: {customer.riskScore}</p>
            </div>
        </div>
    );
}