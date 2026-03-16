import React from 'react';
import { Trophy, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { rankingDataMock } from '../data/mockData';

const RankingWidget = ({ dragHandleProps }) => {
    // Find max hours for percentage calculation
    const maxHours = Math.max(...rankingDataMock.map(r => r.hours));

    return (
        <div className="w-full h-full border-[1px] border-[var(--color-peg-border)] rounded-xl bg-[var(--color-peg-bg)] shadow-[0_2px_4px_rgba(0,0,0,0.05)] flex flex-col transition-all relative z-10 hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] overflow-hidden">
            {/* Header */}
            <div
                {...dragHandleProps}
                className="h-10 border-b-[1px] border-[var(--color-peg-border)] px-4 bg-gradient-to-b from-[#FAFAFA] to-[var(--color-peg-bg)] shrink-0 flex items-center justify-between cursor-move"
            >
                <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--color-peg-text)] pointer-events-none">
                        [모듈 06] PERFORMANCE_LEADERBOARD
                    </span>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-peg-accent-blue shadow-[0_0_8px_rgba(0,119,255,0.6)] animate-pulse border-[1px] border-[#000000]/10"></div>
            </div>

            <div className="p-4 flex-grow flex flex-col bg-[var(--color-peg-bg)] overflow-hidden">
                <div className="flex items-center justify-between mb-4 border-b-[1px] border-peg-border/20 pb-2">
                    <span className="text-[9px] font-mono text-peg-text/50 uppercase tracking-widest flex items-center">
                        <Trophy size={10} className="mr-1 text-peg-accent-yellow" />
                        THIS_WEEK_UPTIME
                    </span>
                    <span className="text-[9px] font-mono text-peg-text/30">WEEK_11_SYNC</span>
                </div>

                <div className="flex-grow space-y-4 overflow-y-auto no-scrollbar">
                    {rankingDataMock.map((user, index) => {
                        const isMe = user.name.includes('(나)');
                        const percentage = (user.hours / maxHours) * 100;

                        return (
                            <div key={user.id} className="relative">
                                <div className="flex items-center justify-between mb-1.5">
                                    <div className="flex items-center space-x-3">
                                        <div className={`w-6 h-6 rounded-[2px] border-[1px] flex items-center justify-center font-mono text-[10px] font-bold ${index === 0 ? 'bg-peg-accent-yellow text-black border-peg-accent-yellow shadow-[0_0_10px_rgba(255,214,10,0.3)]' :
                                                index === 1 ? 'bg-[#C0C0C0] text-black border-[#C0C0C0]' :
                                                    index === 2 ? 'bg-[#CD7F32] text-black border-[#CD7F32]' :
                                                        'bg-white border-peg-border text-peg-text/60'
                                            }`}>
                                            {index + 1}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className={`text-[11px] font-bold tracking-tight ${isMe ? 'text-peg-accent-blue underline underline-offset-2' : 'text-peg-text'}`}>
                                                {user.name}
                                            </span>
                                            <span className="text-[9px] font-mono text-peg-text/40 lowercase">Rank_Index_{index.toString().padStart(2, '0')}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-[11px] font-mono font-bold tabular-nums text-peg-text">
                                            {user.hours.toFixed(1)}h
                                        </span>
                                        <div className="opacity-60">
                                            {user.trend === 'up' ? <TrendingUp size={12} className="text-green-500" /> :
                                                user.trend === 'down' ? <TrendingDown size={12} className="text-red-500" /> :
                                                    <Minus size={12} className="text-peg-text/30" />}
                                        </div>
                                    </div>
                                </div>
                                <div className="h-1.5 w-full bg-[#E8E6E0] rounded-[1px] overflow-hidden shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]">
                                    <div
                                        className={`h-full transition-all duration-1000 ease-out rounded-[1px] ${isMe ? 'bg-peg-accent-blue shadow-[0_0_8px_rgba(0,119,255,0.4)]' : 'bg-peg-text/20'
                                            }`}
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-4 pt-3 border-t-[1px] border-peg-border/20 flex justify-between items-center opacity-40">
                    <div className="text-[8px] font-mono uppercase tracking-widest text-peg-text">DATA_SOURCE: KMU_CORE_API</div>
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                </div>
            </div>
        </div>
    );
};

export default RankingWidget;
