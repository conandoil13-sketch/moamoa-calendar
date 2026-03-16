import React from 'react';
import { Play, Square } from 'lucide-react';

const HardwareSwitch = ({ isOn, toggle }) => (
    <button
        onClick={toggle}
        className={`
      relative w-28 h-12 rounded-xl border-2 border-peg-border transition-colors duration-200 overflow-hidden flex items-center 
      shadow-[inset_0_4px_6px_rgba(0,0,0,0.1)] focus:outline-none
      ${isOn ? 'bg-peg-accent-red' : 'bg-peg-off'}
    `}
    >
        <div
            className={`
        absolute left-1 w-10 h-10 rounded-lg border-2 border-peg-border bg-white 
        transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] 
        flex items-center justify-center
        ${isOn ? 'translate-x-[60px] bg-peg-border' : 'translate-x-0'}
      `}
        >
            {isOn ?
                <Square size={14} fill="#FF3B30" className="text-peg-border" /> :
                <Play size={14} fill="var(--color-peg-text)" className="text-peg-text ml-0.5" />
            }
        </div>
    </button>
);

export default HardwareSwitch;
