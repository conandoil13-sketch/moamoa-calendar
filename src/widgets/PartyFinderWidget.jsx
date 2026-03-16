import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import liveMenuData from '../data/cafeteria_menu.json';
import { partyListMock } from '../data/mockData';

const PartyFinderWidget = ({ dragHandleProps }) => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 is Sunday, 1 is Monday

    const cafeKeys = Object.keys(liveMenuData);
    const [parties, setParties] = useState(partyListMock);
    const [activeCafeLabel, setActiveCafeLabel] = useState(cafeKeys[0] || "");
    const [activeTab, setActiveTab] = useState('lunch');

    const getDailyMeal = () => {
        if (!activeCafeLabel || !liveMenuData[activeCafeLabel]) return ["식단 정보가 없습니다."];

        const restaurantData = liveMenuData[activeCafeLabel];
        const mealsForToday = [];

        restaurantData.forEach(corner => {
            const mealText = corner.weeklyMeals[dayOfWeek] || "";
            if (!mealText) return;

            // Simple filtering for lunch/dinner if possible
            if (activeTab === 'lunch') {
                if (mealText.includes('중식') || mealText.includes('중석식') || (!mealText.includes('석식') && mealText.length > 5)) {
                    mealsForToday.push(`${corner.corner}: ${mealText}`);
                }
            } else {
                if (mealText.includes('석식') || mealText.includes('중석식')) {
                    mealsForToday.push(`${corner.corner}: ${mealText}`);
                }
            }
        });

        return mealsForToday.length > 0 ? mealsForToday : ["표시할 메뉴가 없습니다."];
    };

    const toggleJoin = (id) => {
        setParties(parties.map(party => {
            if (party.id === id) {
                const isJoining = !party.joined;
                if (isJoining && party.current >= party.max) return party;
                return {
                    ...party,
                    joined: isJoining,
                    current: isJoining ? party.current + 1 : party.current - 1
                };
            }
            return party;
        }));
    };

    return (
        <div className="w-full h-full border-[1px] border-[var(--color-peg-border)] rounded-xl bg-[var(--color-peg-bg)] shadow-[0_2px_4px_rgba(0,0,0,0.05)] flex flex-col transition-all relative z-10 hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] overflow-hidden">

            {/* Header */}
            <div
                {...dragHandleProps}
                className="h-10 border-b-[1px] border-[var(--color-peg-border)] px-4 bg-gradient-to-b from-[#FAFAFA] to-[var(--color-peg-bg)] shrink-0 flex items-center justify-between cursor-move"
            >
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--color-peg-text)] pointer-events-none">
                    [모듈 03] 같이 할 사람! (Live KMU)
                </span>
                <div className="w-1.5 h-1.5 rounded-full bg-peg-accent-blue shadow-[0_0_8px_rgba(0,119,255,0.6)] animate-pulse border-[1px] border-[#000000]/10"></div>
            </div>

            <div className="p-4 flex-grow flex flex-col bg-[var(--color-peg-bg)] overflow-y-auto">
                {/* 1. Meal Viewer */}
                <div className="mb-6 bg-[#E8E6E0] p-2 rounded-lg border-[1px] border-peg-border/20 shadow-[inset_0_1px_3px_rgba(0,0,0,0.1)]">
                    <div className="text-[9px] font-mono text-[var(--color-peg-text)]/50 uppercase tracking-widest mb-2 px-1">
                        오늘의 학식 식단표 (KST)
                    </div>
                    {/* Cafeteria Tabs - Scrollable if many */}
                    <div className="flex w-full mb-3 border-b-[1px] border-peg-border overflow-x-auto no-scrollbar">
                        {cafeKeys.map(cafe => (
                            <button
                                key={cafe}
                                onClick={() => setActiveCafeLabel(cafe)}
                                className={`whitespace-nowrap px-3 text-[9px] font-mono py-1.5 transition-colors border-t-[1px] border-x-[1px] -ml-[1px] ${activeCafeLabel === cafe ? 'bg-[#181818] border-[#181818] text-peg-accent-yellow z-10' : 'bg-transparent border-transparent text-peg-text/50 hover:bg-peg-border/10'}`}
                            >
                                {cafe.split('(')[0]}
                            </button>
                        ))}
                    </div>

                    <div className="flex space-x-2 mb-3">
                        <button
                            onClick={() => setActiveTab('lunch')}
                            className={`px-3 py-1 border-[1px] rounded text-[9px] font-mono font-bold transition-colors ${activeTab === 'lunch' ? 'bg-[#181818] border-[#181818] text-[#00FFFF] shadow-[0_0_8px_rgba(0,255,255,0.2)]' : 'bg-white border-peg-border text-peg-text/60'}`}
                        >
                            LUNCH
                        </button>
                        <button
                            onClick={() => setActiveTab('dinner')}
                            className={`px-3 py-1 border-[1px] rounded text-[9px] font-mono font-bold transition-colors ${activeTab === 'dinner' ? 'bg-[#181818] border-[#181818] text-[#00FFFF] shadow-[0_0_8px_rgba(0,255,255,0.2)]' : 'bg-white border-peg-border text-peg-text/60'}`}
                        >
                            DINNER
                        </button>
                    </div>

                    <div className="bg-[#181818] border-[1px] border-[#0A0A0A] rounded p-3 font-mono text-[13px] text-peg-accent-yellow leading-relaxed shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] min-h-[100px]">
                        {getDailyMeal().map((item, idx) => (
                            <div key={idx} className="text-peg-accent-yellow font-mono text-[11px] tracking-wide mb-1 opacity-90">
                                {item.startsWith('-') ? item : `- ${item}`}
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. Party List */}
                <div className="flex-grow flex flex-col">
                    <div className="flex justify-between items-center mb-4 border-b-[1px] border-[var(--color-peg-border)] pb-2">
                        <span className="text-[9px] font-mono text-[var(--color-peg-text)]/50 uppercase tracking-widest">
                            모집 중인 채널 현황
                        </span>
                        <button className="w-6 h-6 bg-[var(--color-peg-text)] text-white flex items-center justify-center rounded-[2px] shadow-[0_1px_2px_rgba(0,0,0,0.2)] active:translate-y-[1px] active:shadow-none transition-all hover:bg-peg-accent-blue">
                            <Plus size={14} />
                        </button>
                    </div>

                    <div className="flex flex-col gap-3">
                        {parties.map(party => {
                            const isFull = party.current >= party.max;
                            return (
                                <div key={party.id} className={`p-3 border-[1px] transition-colors shrink-0 ${party.joined ? 'border-peg-accent-blue bg-peg-accent-blue/5' : 'border-[var(--color-peg-border)] bg-white hover:border-peg-text/50'} rounded-lg flex flex-col relative group shadow-[0_1px_2px_rgba(0,0,0,0.02)]`}>

                                    <button
                                        onClick={() => toggleJoin(party.id)}
                                        disabled={isFull && !party.joined}
                                        className={`absolute right-3 top-3 w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${party.joined ? 'bg-peg-accent-blue border-peg-accent-blue text-white' :
                                            isFull ? 'bg-peg-bg border-peg-border opacity-50 cursor-not-allowed' :
                                                'bg-white border-peg-border hover:border-peg-text'
                                            }`}
                                    >
                                        {party.joined && (
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path></svg>
                                        )}
                                    </button>

                                    <h4 className="text-xs font-bold mb-1 w-5/6 truncate text-peg-text">
                                        {party.title}
                                    </h4>

                                    <div className="flex items-center text-[9px] font-mono text-peg-text/60 mt-1 space-x-3">
                                        <span className="flex items-center">
                                            <span className="mr-1">🕒</span>
                                            {party.time}
                                        </span>
                                        <span className="flex items-center truncate max-w-[100px]">
                                            <span className="mr-1">📍</span>
                                            {party.place}
                                        </span>
                                    </div>

                                    <div className={`mt-2 self-end text-[10px] font-mono tracking-widest tabular-nums px-1.5 py-0.5 rounded border ${isFull ? 'bg-peg-text text-white border-peg-text' : 'bg-peg-bg text-peg-text border-peg-border'}`}>
                                        [{party.current}/{party.max}]
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PartyFinderWidget;
