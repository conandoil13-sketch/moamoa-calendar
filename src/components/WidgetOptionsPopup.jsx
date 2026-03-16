import React from 'react';
import { X, Settings2, Sliders, ToggleRight, ShieldCheck } from 'lucide-react';

const WidgetOptionsPopup = ({ title, onClose }) => {
    return (
        <div className="absolute inset-0 z-[100] flex items-center justify-center pointer-events-none">
            {/* The actual popup card */}
            <div className="w-[85%] bg-[#FDFDFD] border-[1px] border-peg-border rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] pointer-events-auto animate-slide-in flex flex-col overflow-hidden border-b-[4px]">
                {/* Header */}
                <div className="h-10 border-b-[1px] border-peg-border px-4 bg-[#F2F1ED] flex items-center justify-between shrink-0">
                    <div className="flex items-center space-x-2">
                        <Settings2 size={14} className="text-peg-accent-blue" />
                        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-peg-text">
                            OPTIONS: {title}
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-6 h-6 rounded-full hover:bg-black/5 flex items-center justify-center transition-colors group"
                    >
                        <X size={14} className="text-peg-text/40 group-hover:text-peg-text" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-5 space-y-4">
                    <div className="space-y-3">
                        {/* Placeholder Section 1 */}
                        <div className="p-3 border-[1px] border-dashed border-peg-border/20 rounded-lg bg-[#FAFAFA]">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-[11px] font-bold text-peg-text uppercase tracking-tight flex items-center">
                                    <ToggleRight size={14} className="mr-2 text-peg-accent-red" />
                                    PRIMARY_LOGIC_SWITCH
                                </span>
                                <div className="w-8 h-4 bg-peg-accent-blue/20 rounded-full relative p-0.5">
                                    <div className="w-3 h-3 bg-peg-accent-blue rounded-full"></div>
                                </div>
                            </div>
                            <p className="text-[9px] font-mono text-peg-text/40 leading-relaxed uppercase">
                                Enables advanced telemetry and real-time synchronization with KMU_CORE servers.
                            </p>
                        </div>

                        {/* Placeholder Section 2 */}
                        <div className="p-3 border-[1px] border-dashed border-peg-border/20 rounded-lg">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-[11px] font-bold text-peg-text uppercase tracking-tight flex items-center">
                                    <Sliders size={14} className="mr-2 text-peg-accent-yellow" />
                                    ANALOG_THRESHOLD
                                </span>
                                <span className="text-[10px] font-mono text-peg-accent-yellow font-bold">75%</span>
                            </div>
                            <div className="h-1 w-full bg-[#E8E6E0] rounded-full overflow-hidden">
                                <div className="h-full w-3/4 bg-peg-accent-yellow"></div>
                            </div>
                        </div>

                        {/* Placeholder Section 3 Section */}
                        <div className="flex items-center space-x-2 text-peg-accent-blue/40">
                            <ShieldCheck size={12} />
                            <span className="text-[8px] font-mono uppercase tracking-widest">ENCRYPTED_PREFERENCE_STORAGE</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t-[1px] border-peg-border/10 bg-[#FAFAFA] flex justify-end space-x-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-1.5 border-[1px] border-peg-border rounded-md text-[10px] font-mono font-bold uppercase tracking-widest hover:bg-black text-white bg-peg-text transition-all active:scale-95 shadow-[0_2px_0_rgba(0,0,0,0.1)]"
                    >
                        APPLY_STAGED_CHANGES
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WidgetOptionsPopup;
