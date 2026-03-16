import React, { useState } from 'react';
import { X, Palette, Moon, Sun, Cloud, Leaf, Snowflake, Zap, Sliders, Hash, Plus } from 'lucide-react';

const THEME_PRESETS = {
    spring: {
        name: 'SPRING_BLOOM',
        icon: Flower2Icon,
        bg: '#FDF5F7',
        text: '#4A2B2B',
        accent: '#FF8FAB',
        sidebar: '#F9E6EB',
        lines: 'rgba(255, 143, 171, 0.15)'
    },
    summer: {
        name: 'SUMMER_VIBE',
        icon: Sun,
        bg: '#F0F9FF',
        text: '#0C4A6E',
        accent: '#0EA5E9',
        sidebar: '#E0F2FE',
        lines: 'rgba(14, 165, 233, 0.1)'
    },
    autumn: {
        name: 'AUTUMN_LOG',
        icon: Leaf,
        bg: '#FFF7ED',
        text: '#431407',
        accent: '#EA580C',
        sidebar: '#FFEDD5',
        lines: 'rgba(234, 88, 12, 0.1)'
    },
    winter: {
        name: 'WINTER_STAL',
        icon: Snowflake,
        bg: '#F8FAFC',
        text: '#1E293B',
        accent: '#64748B',
        sidebar: '#F1F5F9',
        lines: 'rgba(100, 116, 139, 0.1)'
    },
    dark: {
        name: 'DEEP_SPACE',
        icon: Moon,
        bg: '#121212',
        text: '#E0E0E0',
        accent: '#BB86FC',
        sidebar: '#1E1E1E',
        lines: 'rgba(255, 255, 255, 0.05)'
    },
    classic: {
        name: 'CLASSIC_PEDAL',
        icon: Sliders,
        bg: '#F0EDE4',
        text: '#1A1A1A',
        accent: '#0047FF',
        sidebar: '#E8E6DF',
        lines: 'rgba(0, 0, 0, 0.1)'
    }
};

// Simple Fallback Icon for Spring
function Flower2Icon(props) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 7.5a4.5 4.5 0 1 1 4.5 4.5M12 7.5A4.5 4.5 0 1 0 7.5 12M12 7.5V12m4.5 0a4.5 4.5 0 1 1-4.5 4.5M16.5 12H12m-4.5 0A4.5 4.5 0 1 0 12 16.5M7.5 12H12m0 4.5V12" />
        </svg>
    );
}

const SettingsModal = ({ isOpen, onClose, currentTheme, onThemeSelect }) => {
    const [customPalettes] = useState(['#FF00FF', '#00FFFF', '#FFFF00', '#00FF00']);
    const [activeTab, setActiveTab] = useState('THEME');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-xl animate-in fade-in duration-300">
            <div className="bg-[#F4F2EC] border-[2px] border-black/10 rounded-3xl shadow-[0_30px_60px_-12px_rgba(0,0,0,0.3)] w-full max-w-2xl flex flex-col overflow-hidden slide-up animate-in duration-500">
                {/* Header */}
                <div className="h-16 border-b-[1px] border-black/5 px-8 flex items-center justify-between bg-white/50">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-peg-accent-blue/10 flex items-center justify-center">
                            <Zap size={18} className="text-peg-accent-blue" />
                        </div>
                        <span className="text-[12px] font-mono font-bold tracking-[0.2em] text-black uppercase">
                            System_Preferences.v1
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full hover:bg-black/5 flex items-center justify-center transition-colors"
                    >
                        <X size={20} className="text-black/40" />
                    </button>
                </div>

                <div className="flex flex-grow h-[500px]">
                    {/* Navigation Sidebar */}
                    <div className="w-48 border-r-[1px] border-black/5 bg-[#E8E6DF]/30 px-4 py-8 flex flex-col gap-2">
                        {[
                            { id: 'THEME', icon: Palette, label: 'Appearance' },
                            { id: 'AUDIO', icon: Sliders, label: 'Audio Engine' },
                            { id: 'NETWORK', icon: Zap, label: 'Network' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-mono text-[10px] uppercase font-bold tracking-widest
                  ${activeTab === tab.id ? 'bg-white text-peg-accent-blue shadow-sm' : 'text-black/30 hover:text-black/60'}
                `}
                            >
                                <tab.icon size={14} />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="flex-grow p-10 overflow-auto custom-scrollbar bg-white/30">
                        {activeTab === 'THEME' ? (
                            <div className="space-y-10">
                                <section>
                                    <label className="block text-[10px] font-mono font-bold text-black/40 mb-6 tracking-[0.2em] uppercase underline decoration-peg-accent-blue underline-offset-8">
                                        Seasonal_Palettes
                                    </label>
                                    <div className="grid grid-cols-2 gap-4">
                                        {['spring', 'summer', 'autumn', 'winter', 'dark', 'classic'].map(key => {
                                            const theme = THEME_PRESETS[key];
                                            const Icon = theme.icon;
                                            const isActive = currentTheme === key;
                                            return (
                                                <button
                                                    key={key}
                                                    onClick={() => onThemeSelect(key, theme)}
                                                    className={`p-4 rounded-2xl border-[1px] transition-all flex flex-col gap-3 group
                            ${isActive ? 'bg-white border-peg-accent-blue shadow-lg scale-[1.02]' : 'bg-[#DAD7CD]/20 border-transparent hover:bg-white hover:border-black/10'}
                          `}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isActive ? 'bg-peg-accent-blue text-white' : 'bg-black/5 text-black/40 group-hover:bg-black/10'}`}>
                                                            <Icon size={16} />
                                                        </div>
                                                        <div className="flex gap-1">
                                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.bg }} />
                                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.accent }} />
                                                        </div>
                                                    </div>
                                                    <span className={`text-[10px] font-mono font-bold tracking-widest uppercase ${isActive ? 'text-black' : 'text-black/40'}`}>
                                                        {theme.name}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </section>

                                <section>
                                    <label className="block text-[10px] font-mono font-bold text-black/40 mb-6 tracking-[0.2em] uppercase underline decoration-peg-accent-blue underline-offset-8">
                                        Custom_Buffer_[4]
                                    </label>
                                    <div className="grid grid-cols-4 gap-4">
                                        {customPalettes.map((color, idx) => (
                                            <div key={idx} className="flex flex-col gap-2 group">
                                                <div
                                                    className="w-full aspect-square rounded-2xl border-[4px] border-white shadow-md relative cursor-pointer active:scale-95 transition-transform"
                                                    style={{ backgroundColor: color }}
                                                >
                                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/20 rounded-xl transition-opacity">
                                                        <Plus size={16} className="text-white" />
                                                    </div>
                                                </div>
                                                <span className="text-[9px] font-mono text-center font-bold text-black/30 uppercase tracking-tighter">
                                                    SLOT_{idx + 1}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full opacity-20 filter grayscale">
                                <Sliders size={48} className="mb-4" />
                                <span className="text-[12px] font-mono tracking-widest uppercase font-bold">In_Development</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="h-14 border-t-[1px] border-black/5 px-8 flex items-center justify-between bg-[#E8E6DF]/20">
                    <span className="text-[8px] font-mono text-black/30 tracking-[0.3em] uppercase">
                        Anti_Gravity_System_Console // Ready
                    </span>
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-black text-white rounded-xl text-[10px] font-mono font-bold tracking-widest hover:bg-peg-accent-blue transition-colors"
                    >
                        CONFIRM_CHANGES
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
