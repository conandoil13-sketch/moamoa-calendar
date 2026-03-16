import React from 'react';
import { Activity, Users, Clock } from 'lucide-react';

const TechDiagram = ({ data }) => (
    <div className="bg-[#F4F4F0] p-5 font-mono text-sm relative border-t-2 border-peg-border overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 opacity-10 pointer-events-none">
            <svg viewBox="0 0 100 100" className="w-full h-full stroke-peg-border" fill="none">
                <circle cx="50" cy="50" r="30" strokeWidth="1" strokeDasharray="2 2" />
                <rect x="20" y="20" width="60" height="60" strokeWidth="1" />
                <line x1="0" y1="50" x2="100" y2="50" strokeWidth="1" />
                <line x1="50" y1="0" x2="50" y2="100" strokeWidth="1" />
            </svg>
        </div>

        <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] uppercase tracking-widest text-peg-text/50">시스템 통계 /</span>
            <span className="bg-peg-border text-peg-accent-blue px-2 py-0.5 text-[10px] uppercase tracking-widest flex items-center">
                <div className="w-2 h-2 rounded-full bg-peg-accent-blue mr-2 animate-pulse"></div>
                실시간
            </span>
        </div>

        <div className="grid grid-cols-2 gap-3 relative z-10">
            <div className="border border-peg-border p-3 bg-white flex flex-col justify-between">
                <p className="flex items-center text-[10px] text-peg-text/60 uppercase mb-2">
                    <Clock size={12} className="mr-1" /> 평균 소요 시간
                </p>
                <p className="text-xl tracking-tight text-peg-text">{data?.avgTime || 0} <span className="text-[10px]">시간</span></p>
            </div>
            <div className="border border-peg-border p-3 bg-white flex flex-col justify-between">
                <p className="flex items-center text-[10px] text-peg-text/60 uppercase mb-2">
                    <Users size={12} className="mr-1" /> 실시간 접속 학우
                </p>
                <p className="text-xl tracking-tight text-peg-text">{data?.activeNodes || 0} <span className="text-[10px]">명</span></p>
            </div>
        </div>

        <div className="mt-4 p-3 bg-white border border-peg-border relative z-10">
            <p className="text-[10px] text-peg-text/60 uppercase mb-2 flex justify-between">
                <span>주간 과제 활동 트렌드</span>
                <span className="text-peg-accent-blue">Realtime</span>
            </p>
            <div className="flex items-end h-12 space-x-1.5 opacity-80 pt-2">
                {(data?.weeklyData || []).map((val, i) => (
                    <div key={i} className="flex-1 bg-peg-border hover:bg-peg-accent-blue transition-colors rounded-t-sm" style={{ height: `${val}%` }}></div>
                ))}
            </div>
        </div>

        <div className="mt-4 pt-3 border-t border-dashed border-peg-border flex items-center justify-between">
            <div className="flex items-center text-[10px] text-peg-accent-blue">
                <Activity className="mr-2" size={14} />
                <span>글로벌 학사 데이터 동기화 중...</span>
            </div>
            <span className="text-[10px] text-peg-text/40">v1.0.5</span>
        </div>
    </div>
);

export default TechDiagram;
