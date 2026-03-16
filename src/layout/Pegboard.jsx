import React from 'react';

const Pegboard = ({ children }) => (
    <div
        className="min-h-screen font-sans"
        style={{
            backgroundImage: 'radial-gradient(var(--color-peg-lines) 1.5px, transparent 1.5px)',
            backgroundSize: '24px 24px'
        }}
    >
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12 auto-rows-[140px] gap-6 p-4 md:p-8 grid-flow-row-dense">
            {children}
        </div>
    </div>
);

export default Pegboard;
