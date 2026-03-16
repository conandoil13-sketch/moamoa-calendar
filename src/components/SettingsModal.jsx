import React, { useState } from 'react';
import { X, Palette, Moon, Sun, Cloud, Leaf, Snowflake, Zap, Sliders, Hash, Plus, Check, RotateCcw } from 'lucide-react';

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
        bg: '#F4F2EC',
        text: '#171615',
        accent: '#0077FF',
        sidebar: '#E8E6DF',
        lines: 'rgba(0, 0, 0, 0.05)'
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

const SettingsModal = ({ isOpen, onClose, currentTheme, onThemeSelect, customThemes, onUpdateCustomTheme }) => {
    const [activeTab, setActiveTab] = useState('THEME');
    const [editingSlot, setEditingSlot] = useState(null);
    const [tempTheme, setTempTheme] = useState(null);

    if (!isOpen) return null;

    const handleStartEdit = (idx, theme) => {
        setEditingSlot(idx);
        setTempTheme({ ...theme });
    };

    const handleSaveCustom = () => {
        onUpdateCustomTheme(editingSlot, tempTheme);
        setEditingSlot(null);
        setTempTheme(null);
    };

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
                            System_Preferences_Console
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
                    <div className="flex-grow p-10 overflow-auto custom-scrollbar bg-white/30 relative">
                        {activeTab === 'THEME' ? (
                            <div className="space-y-10">
                                {editingSlot === null ? (
                                    <>
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
                                                            onClick={() => onThemeSelect(key)}
                                                            className={`p-4 rounded-2xl border-[1px] transition-all flex flex-col gap-3 group
                                                              ${isActive ? 'bg-white border-peg-accent-blue shadow-lg scale-[1.02]' : 'bg-[#DAD7CD]/20 border-transparent hover:bg-white hover:border-black/10'}
                                                            `}
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isActive ? 'bg-peg-accent-blue text-white' : 'bg-black/5 text-black/40 group-hover:bg-black/10'}`}>
                                                                    <Icon size={16} />
                                                                </div>
                                                                <div className="flex gap-1">
                                                                    <div className="w-3 h-3 rounded-full border-[1px] border-black/5" style={{ backgroundColor: theme.bg }} />
                                                                    <div className="w-3 h-3 rounded-full border-[1px] border-black/5" style={{ backgroundColor: theme.accent }} />
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
                                                {customThemes.map((theme, idx) => {
                                                    const isActive = currentTheme === theme;
                                                    return (
                                                        <div key={idx} className="flex flex-col gap-2 group">
                                                            <div
                                                                onClick={() => onThemeSelect(theme)}
                                                                className={`w-full aspect-square rounded-2xl border-[4px] relative cursor-pointer active:scale-95 transition-all shadow-md
                                                                  ${isActive ? 'border-peg-accent-blue ring-4 ring-peg-accent-blue/10' : 'border-white'}
                                                                `}
                                                                style={{ backgroundColor: theme.accent }}
                                                            >
                                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/10 rounded-xl transition-opacity">
                                                                    <button
                                                                        onClick={(e) => { e.stopPropagation(); handleStartEdit(idx, theme); }}
                                                                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-peg-accent-blue hover:text-white transition-colors"
                                                                    >
                                                                        <Plus size={16} />
                                                                    </button>
                                                                </div>
                                                                {isActive && (
                                                                    <div className="absolute top-[-8px] right-[-8px] w-6 h-6 bg-peg-accent-blue text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                                                                        <Check size={12} strokeWidth={4} />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <span className="text-[9px] font-mono text-center font-bold text-black/30 uppercase tracking-tighter">
                                                                SLOT_0{idx + 1}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </section>
                                    </>
                                ) : (
                                    /* Custom Theme Editor */
                                    <div className="h-full flex flex-col animate-in fade-in slide-in-from-right-4 duration-500">
                                        <div className="flex items-center justify-between mb-8">
                                            <h3 className="text-[12px] font-mono font-bold tracking-[0.2em] uppercase">
                                                Theme_Editor_Slot_0{editingSlot + 1}
                                            </h3>
                                            <button
                                                onClick={() => setEditingSlot(null)}
                                                className="text-black/40 hover:text-black flex items-center gap-2 text-[10px] font-mono uppercase font-bold"
                                            >
                                                <RotateCcw size={12} />
                                                Cancel
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-2 gap-8 flex-grow">
                                            <div className="space-y-6">
                                                {[
                                                    { key: 'bg', label: 'Background_Color', desc: 'Main workspace base' },
                                                    { key: 'text', label: 'Typography_Color', desc: 'Labels and data' },
                                                    { key: 'accent', label: 'Accent_Color', desc: 'Active highlights' },
                                                    { key: 'sidebar', label: 'Sidebar_Color', desc: 'Control rack bg' }
                                                ].map(field => (
                                                    <div key={field.key} className="flex flex-col gap-2">
                                                        <div className="flex justify-between items-center px-1">
                                                            <label className="text-[9px] font-mono font-bold text-black/40 uppercase tracking-widest">{field.label}</label>
                                                            <span className="text-[9px] font-mono text-black font-bold opacity-30">{tempTheme[field.key]}</span>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <input
                                                                type="color"
                                                                value={tempTheme[field.key]}
                                                                onChange={e => setTempTheme({ ...tempTheme, [field.key]: e.target.value })}
                                                                className="w-10 h-10 p-0 rounded-lg border-none cursor-pointer bg-transparent"
                                                            />
                                                            <input
                                                                type="text"
                                                                value={tempTheme[field.key]}
                                                                onChange={e => setTempTheme({ ...tempTheme, [field.key]: e.target.value })}
                                                                className="flex-grow bg-[#DAD7CD]/20 border-[1px] border-black/10 rounded-lg px-3 py-2 text-[11px] font-mono font-bold uppercase focus:outline-none focus:border-peg-accent-blue"
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="flex flex-col gap-4">
                                                <label className="text-[9px] font-mono font-bold text-black/40 uppercase tracking-widest px-1">Preview_Console</label>
                                                <div className="flex-grow rounded-3xl border-[1px] border-black/10 overflow-hidden shadow-inner flex flex-col" style={{ backgroundColor: tempTheme.bg }}>
                                                    <div className="h-8 border-b-[1px] border-black/5 px-4 flex items-center justify-between" style={{ backgroundColor: tempTheme.sidebar }}>
                                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: tempTheme.accent }} />
                                                    </div>
                                                    <div className="flex-grow p-6 flex flex-col gap-3 items-center justify-center">
                                                        <div className="w-12 h-1 bg-black/10 rounded-full" style={{ backgroundColor: tempTheme.text + '20' }} />
                                                        <div className="text-[14px] font-bold" style={{ color: tempTheme.text }}>14:55:00</div>
                                                        <div className="w-20 h-6 rounded-lg shadow-sm flex items-center justify-center text-[8px] font-bold uppercase" style={{ backgroundColor: tempTheme.accent, color: '#FFF' }}>
                                                            Active
                                                        </div>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={handleSaveCustom}
                                                    className="w-full bg-black text-white h-12 rounded-xl flex items-center justify-center gap-2 group transition-all hover:bg-peg-accent-blue active:scale-[0.98] mt-2"
                                                >
                                                    <span className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase">Save_Configuration</span>
                                                    <Check size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
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
                        Anti_Gravity_System_Console // {editingSlot !== null ? 'Configuring_Slot_v0' + (editingSlot + 1) : 'Ready'}
                    </span>
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-black text-white rounded-xl text-[10px] font-mono font-bold tracking-widest hover:bg-peg-accent-blue transition-colors"
                    >
                        CLOSE_CONSOLE
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
