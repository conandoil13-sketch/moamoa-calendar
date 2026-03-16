import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import HardwareSwitch from '../components/HardwareSwitch';
import TechDiagram from '../components/TechDiagram';

const TimerWidget = ({ selectedCourse, setSelectedCourse, myCourses, isRunning, setIsRunning, dragHandleProps }) => {
    const [isDropdown, setDropdown] = useState(false);
    const [time, setTime] = useState(0); // in seconds
    const [showDiagram, setShowDiagram] = useState(false);

    const timerRef = useRef(null);

    useEffect(() => {
        if (isRunning) {
            timerRef.current = setInterval(() => {
                setTime(prev => prev + 1);
            }, 1000);
        } else {
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [isRunning]);

    const formatTime = (secs) => {
        const h = Math.floor(secs / 3600).toString().padStart(2, '0');
        const m = Math.floor((secs % 3600) / 60).toString().padStart(2, '0');
        const s = (secs % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    };

    return (
        <div className="w-full h-full border-[1px] border-peg-border rounded-xl bg-peg-bg shadow-[0_2px_4px_rgba(0,0,0,0.05)] flex flex-col transition-all z-10 hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
            <div
                {...dragHandleProps}
                className="h-10 border-b-[1px] border-peg-border px-4 flex items-center justify-between cursor-move bg-gradient-to-b from-[#FAFAFA] to-peg-bg transition-colors rounded-t-xl"
            >
                <div className="flex space-x-1.5 opacity-60 pointer-events-none">
                    {[1, 2, 3, 4].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-peg-border"></div>)}
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-peg-text pointer-events-none">
                    [모듈 01] 집 중 타 이 머
                </span>
            </div>

            <div className="p-6 flex-grow flex flex-col justify-between bg-peg-bg">
                <div className="relative mb-8 z-20">
                    <label className="text-[9px] font-mono uppercase tracking-widest text-peg-text/50 mb-2 block">
                        CH. SELECT
                    </label>
                    <button
                        onClick={() => setDropdown(!isDropdown)}
                        className="w-full border-[1px] border-peg-border rounded-lg bg-gradient-to-b from-[#FFFFFF] to-[#F8F8F8] shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)] p-3 flex justify-between items-center hover:border-peg-accent-blue transition-colors focus:outline-none"
                    >
                        <div className="text-left flex flex-col truncate pr-2">
                            <span className="font-bold text-[14px] text-peg-text truncate flex items-center gap-2">
                                <span className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-peg-accent-red animate-pulse' : 'bg-peg-accent-blue'}`}></span>
                                {selectedCourse.title}
                            </span>
                            <span className="text-[10px] text-peg-text/50 font-mono mt-0.5 truncate truncate ml-3.5">{selectedCourse.professor}</span>
                        </div>
                        <ChevronDown size={16} className={`text-peg-text/50 transition-transform duration-300 shrink-0 ${isDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    <div
                        className={`absolute z-30 top-full mt-1 left-0 w-full border-[1px] border-peg-border rounded-lg bg-white transition-all transform origin-top shadow-[0_4px_12px_rgba(0,0,0,0.1)] overflow-hidden ${isDropdown ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 pointer-events-none'}`}
                    >
                        {myCourses.length === 0 ? (
                            <div className="p-3 text-[11px] text-peg-text/40 italic">Add courses in Course Manager</div>
                        ) : (
                            myCourses.map((course, index) => (
                                <div
                                    key={course.id}
                                    className={`p-3 border-peg-border hover:bg-peg-accent-blue hover:text-white cursor-pointer transition-colors group ${index !== myCourses.length - 1 ? 'border-b-[1px]' : ''}`}
                                    onClick={() => {
                                        if (selectedCourse.id !== course.id) {
                                            setSelectedCourse(course);
                                            setTime(0);
                                            setIsRunning(false);
                                        }
                                        setDropdown(false);
                                    }}
                                >
                                    <div className="font-bold text-[13px] truncate">{course.title}</div>
                                    <div className="text-[10px] opacity-50 font-mono group-hover:opacity-100 truncate">{course.professor}</div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center flex-grow mb-6 relative">
                    <div className="font-mono text-5xl lg:text-6xl font-light text-peg-text mb-8 tabular-nums tracking-tighter w-full text-center drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
                        {formatTime(time)}
                    </div>
                    {/* Wrapped Hardware Switch in an aesthetic plate */}
                    <div className="p-2 border-[1px] border-peg-border/30 rounded-full bg-gradient-to-b from-[#E0DDD5] to-[#EAE6DE] shadow-[inset_0_1px_3px_rgba(0,0,0,0.1)]">
                        <HardwareSwitch isOn={isRunning} toggle={() => setIsRunning(!isRunning)} />
                    </div>
                    <div className="mt-5 text-[9px] font-mono tracking-[0.2em] text-peg-text/50 uppercase h-4 flex items-center justify-center space-x-2">
                        <span>L</span>
                        <div className="w-[1px] h-3 bg-peg-border/30"></div>
                        <span>{isRunning ? 'RECORDING...' : 'STAND-BY'}</span>
                        <div className="w-[1px] h-3 bg-peg-border/30"></div>
                        <span>R</span>
                    </div>
                </div>
            </div>

            <button
                onClick={() => setShowDiagram(!showDiagram)}
                className="w-full border-t-[1px] border-peg-border bg-peg-bg py-2 flex items-center justify-center text-[9px] font-mono tracking-widest hover:bg-peg-off transition-colors group focus:outline-none"
            >
                <span className="text-peg-text/60 group-hover:text-peg-text">
                    {showDiagram ? '▲ 통계 접기' : '▼ 데이터 시각화 보드 열기'}
                </span>
            </button>

            <div
                className="transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] overflow-hidden rounded-b-xl"
                style={{ maxHeight: showDiagram ? '500px' : '0' }}
            >
                <TechDiagram data={selectedCourse} />
            </div>
        </div>
    );
};

export default TimerWidget;
