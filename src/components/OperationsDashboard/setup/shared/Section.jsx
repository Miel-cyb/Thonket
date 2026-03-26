// =============================
// FILE: /setup/shared/Section.jsx
// =============================
import React from 'react';

const Section = ({ title, children }) => (
    <div className="mb-6">
        <h2 className="font-semibold mb-2">{title}</h2>
        <div className="space-y-3">{children}</div>
    </div>
);

export default Section;