import React, { useState } from 'react';
import { audioChartMock } from '../data/mockData';

const AudioChartWidget = ({ isRunning, selectedCourse, dragHandleProps }) => {
    const currentSet = isRunning ? 'focused' : 'general';
    const [localTracks, setLocalTracks] = useState({
        focused: audioChartMock.focused,
        general: audioChartMock.general
    });

    const tracks = localTracks[currentSet];

    const toggleLike = (id) => {
        setLocalTracks(prev => ({
            ...prev,
            [currentSet]: prev[currentSet].map(t =>
                t.id === id ? { ...t, isLiked: !t.isLiked, likes: t.isLiked ? t.likes - 1 : t.likes + 1 } : t
            )
        }));
    };

    return (
        <div className="w-full h-full border-[1px] border-peg-border rounded-xl bg-peg-bg shadow-[0_2px_4px_rgba(0,0,0,0.05)] flex flex-col transition-all relative overflow-hidden z-10 hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
            {/* Header */}
            <div
                {...dragHandleProps}
                className="h-10 border-b-[1px] border-peg-border px-4 bg-gradient-to-b from-[#FAFAFA] to-peg-bg shrink-0 flex items-center justify-between cursor-move"
            >
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-peg-text pointer-events-none">
                    [모듈 06] 야작 노동요 차트
                </span>

                {/* Audio Equalizer Mini Visual - Animated with pure CSS */}
                <div className="flex items-end space-x-0.5 h-3 opacity-80" title="Audio Levels">
                    <div className="w-1 bg-[#FF2D2D] animate-[pulse_1s_ease-in-out_infinite] h-full"></div>
                    <div className="w-1 bg-[#FF2D2D] animate-[pulse_1.2s_ease-in-out_infinite_reverse] h-[60%]"></div>
                    <div className="w-1 bg-[#FF2D2D] animate-[pulse_0.8s_ease-in-out_infinite] h-[80%]"></div>
                    <div className="w-1 bg-[#FF2D2D] animate-[pulse_1.5s_ease-in-out_infinite_reverse] h-[40%]"></div>
                </div>
            </div>

            <div className="p-4 flex-grow flex flex-col bg-peg-bg justify-center gap-4">

                {/* Status Indicator */}
                {isRunning ? (
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-[#0077FF] animate-pulse shadow-[0_0_8px_rgba(0,119,255,0.6)]"></div>
                        <span className="text-[10px] font-mono tracking-widest font-bold uppercase text-[#0077FF]">FOCUS MODE: ACTIVE</span>
                    </div>
                ) : (
                    <div className="flex justify-end gap-1 mb-2 opacity-30">
                        {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-1 h-3 bg-peg-border"></div>)}
                    </div>
                )}

                {isRunning && (
                    <div className="text-[9px] font-mono text-peg-text/60 bg-[#E8E6E0] p-2 rounded border-[1px] border-peg-border/20 shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]">
                        현재 [{selectedCourse?.title || '과목 없음'}] 과제를 하는 사람들이 듣는 추천 곡입니다.
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-3">
                {tracks.map((track, index) => (
                    <div key={track.id} className="border-[1px] border-peg-border rounded-lg bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex items-center justify-between group">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <span className="text-[14px] font-mono text-peg-text/30 group-hover:text-peg-text/60 transition-colors">
                                {String(index + 1).padStart(2, '0')}
                            </span>
                            <div className="flex flex-col truncate">
                                <a
                                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(track.title + ' ' + track.artist)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-bold text-[13px] text-peg-text hover:text-peg-accent-blue hover:underline decoration-2 underline-offset-2 truncate"
                                >
                                    {track.title}
                                </a>
                                <span className="text-[10px] text-peg-text/50 font-mono mt-0.5 truncate">{track.artist}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => toggleLike(track.id)}
                            className={`shrink-0 flex items-center gap-1.5 px-2 py-1 border-[1px] rounded transition-all active:scale-[0.95] ${track.isLiked
                                ? 'border-[#E63946] bg-[#E63946] text-white shadow-[inset_0_1px_2px_rgba(255,255,255,0.3)]'
                                : 'border-peg-border bg-gradient-to-b from-[#FFFFFF] to-[#F0F0F0] text-peg-text hover:border-peg-text shadow-[0_1px_2px_rgba(0,0,0,0.05)]'
                                }`}
                        >
                            <span className="text-[10px] font-mono font-bold">{track.likes + (track.isLiked ? 1 : 0)}</span>
                            {/* Assuming Heart is an imported component or SVG */}
                            <svg className="w-3.5 h-3.5" fill={track.isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AudioChartWidget;
