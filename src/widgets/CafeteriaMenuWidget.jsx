import React, { useState } from 'react';
import liveMenuData from '../data/cafeteria_menu.json';

const CafeteriaMenuWidget = ({ dragHandleProps }) => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 is Sunday, 1 is Monday

    const cafeKeys = Object.keys(liveMenuData);
    const [activeCafeLabel, setActiveCafeLabel] = useState(cafeKeys[0] || "");
    const [activeTab, setActiveTab] = useState('lunch');

    const getDailyMeal = () => {
        if (!activeCafeLabel || !liveMenuData[activeCafeLabel]) return ["식단 정보가 없습니다."];

        const restaurantData = liveMenuData[activeCafeLabel];
        const mealsForToday = [];

        restaurantData.forEach(corner => {
            const mealText = corner.weeklyMeals[dayOfWeek] || "";
            if (!mealText) return;

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

    return (
        <div className="w-full h-full border-[1px] border-[var(--color-peg-border)] rounded-xl bg-[var(--color-peg-bg)] shadow-[0_2px_4px_rgba(0,0,0,0.05)] flex flex-col transition-all relative z-10 hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] overflow-hidden">
            {/* Header */}
            <div
                {...dragHandleProps}
                className="h-10 border-b-[1px] border-[var(--color-peg-border)] px-4 bg-gradient-to-b from-[#FAFAFA] to-[var(--color-peg-bg)] shrink-0 flex items-center justify-between cursor-move"
            >
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--color-peg-text)] pointer-events-none">
                    [모듈 03-A] 오늘의 학식
                </span>
                <div className="w-1.5 h-1.5 rounded-full bg-peg-accent-blue shadow-[0_0_8px_rgba(0,119,255,0.6)] animate-pulse border-[1px] border-[#000000]/10"></div>
            </div>

            <div className="p-4 flex-grow flex flex-col bg-[var(--color-peg-bg)] overflow-y-auto no-scrollbar">
                <div className="bg-[#E8E6E0] p-2 rounded-lg border-[1px] border-peg-border/20 shadow-[inset_0_1px_3px_rgba(0,0,0,0.1)] flex-grow flex flex-col">
                    <div className="text-[9px] font-mono text-[var(--color-peg-text)]/50 uppercase tracking-widest mb-2 px-1 flex justify-between">
                        <span>CAMPUS_MENU_FEED</span>
                        <span>KST_SYNC_ON</span>
                    </div>

                    {/* Cafeteria Tabs */}
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

                    <div className="bg-[#181818] border-[1px] border-[#0A0A0A] rounded p-3 font-mono text-[13px] text-peg-accent-yellow leading-relaxed shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] flex-grow overflow-y-auto no-scrollbar">
                        {getDailyMeal().map((item, idx) => (
                            <div key={idx} className="text-peg-accent-yellow font-mono text-[11px] tracking-wide mb-1 opacity-90">
                                {item.startsWith('-') ? item : `- ${item}`}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CafeteriaMenuWidget;
