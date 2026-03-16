import React, { useState } from 'react';
import { Plus, X, ArrowRight, MapPin, Clock as ClockIcon } from 'lucide-react';
import { partyListMock } from '../data/mockData';

const RecruitmentWidget = ({ dragHandleProps }) => {
    const [parties, setParties] = useState(partyListMock);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [newParty, setNewParty] = useState({
        title: '',
        time: '',
        place: '',
        max: 4
    });

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

    const handleAddParty = (e) => {
        e.preventDefault();
        if (!newParty.title) return;

        const party = {
            id: Date.now(),
            ...newParty,
            current: 1,
            joined: true
        };

        setParties([party, ...parties]);
        setIsFormOpen(false);
        setNewParty({ title: '', time: '', place: '', max: 4 });
    };

    return (
        <div className="w-full h-full border-[1px] border-[var(--color-peg-border)] rounded-xl bg-[var(--color-peg-bg)] shadow-[0_2px_4px_rgba(0,0,0,0.05)] flex flex-col transition-all relative z-10 hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] overflow-hidden text-peg-text">
            {/* Header */}
            <div
                {...dragHandleProps}
                className="h-10 border-b-[1px] border-[var(--color-peg-border)] px-4 bg-gradient-to-b from-[#FAFAFA] to-[var(--color-peg-bg)] shrink-0 flex items-center justify-between cursor-move"
            >
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--color-peg-text)] pointer-events-none">
                        [모듈 03-B] 같이 할 사람!
                    </span>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-peg-accent-blue shadow-[0_0_8px_rgba(0,119,255,0.6)] animate-pulse border-[1px] border-[#000000]/10"></div>
            </div>

            <div className="p-4 flex-grow flex flex-col bg-[var(--color-peg-bg)] overflow-y-auto no-scrollbar relative">
                {/* Action Bar */}
                <div className="flex justify-between items-center mb-4 border-b-[1px] border-[var(--color-peg-border)] pb-2 shrink-0">
                    <span className="text-[9px] font-mono text-[var(--color-peg-text)]/50 uppercase tracking-widest leading-none">
                        {isFormOpen ? 'REGISTER_NEW_SIGNAL' : 'RECRUITMENT_LIST'}
                    </span>
                    <button
                        onClick={() => setIsFormOpen(!isFormOpen)}
                        className={`w-6 h-6 flex items-center justify-center rounded-[2px] shadow-[0_1px_2px_rgba(0,0,0,0.2)] active:translate-y-[1px] active:shadow-none transition-all ${isFormOpen ? 'bg-peg-accent-red text-white' : 'bg-[var(--color-peg-text)] text-white hover:bg-peg-accent-blue'}`}
                    >
                        {isFormOpen ? <X size={14} /> : <Plus size={14} />}
                    </button>
                </div>

                {isFormOpen ? (
                    /* Creation Form */
                    <form onSubmit={handleAddParty} className="flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="space-y-3">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[8px] font-mono font-bold text-peg-text/40 uppercase tracking-widest px-1">파티 이름_TITLE</label>
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="무엇을 같이 하나요?"
                                    value={newParty.title}
                                    onChange={e => setNewParty({ ...newParty, title: e.target.value })}
                                    className="w-full bg-white border-[1px] border-peg-border rounded-lg px-3 py-2 text-xs font-bold focus:outline-none focus:border-peg-accent-blue placeholder:text-peg-text/20"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[8px] font-mono font-bold text-peg-text/40 uppercase tracking-widest px-1">시간_TIME</label>
                                    <input
                                        type="text"
                                        placeholder="18:00~"
                                        value={newParty.time}
                                        onChange={e => setNewParty({ ...newParty, time: e.target.value })}
                                        className="w-full bg-white border-[1px] border-peg-border rounded-lg px-3 py-2 text-xs font-mono font-bold focus:outline-none focus:border-peg-accent-blue placeholder:text-peg-text/20"
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[8px] font-mono font-bold text-peg-text/40 uppercase tracking-widest px-1">장소_LOCATION</label>
                                    <input
                                        type="text"
                                        placeholder="디자인동 3층"
                                        value={newParty.place}
                                        onChange={e => setNewParty({ ...newParty, place: e.target.value })}
                                        className="w-full bg-white border-[1px] border-peg-border rounded-lg px-3 py-2 text-xs font-bold focus:outline-none focus:border-peg-accent-blue placeholder:text-peg-text/20"
                                    />
                                </div>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="mt-2 w-full bg-peg-accent-blue text-white h-10 rounded-lg flex items-center justify-center gap-2 group transition-all hover:shadow-lg hover:shadow-peg-accent-blue/20 active:scale-[0.98]"
                        >
                            <span className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase">Publish_Signal</span>
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>
                ) : (
                    /* Recruitment List */
                    <div className="flex flex-col gap-3">
                        {parties.map(party => {
                            const isFull = party.current >= party.max;
                            return (
                                <div key={party.id} className={`p-3 border-[1px] transition-colors shrink-0 ${party.joined ? 'border-peg-accent-blue bg-peg-accent-blue/5' : 'border-[var(--color-peg-border)] bg-white hover:border-peg-text/50'} rounded-lg flex flex-col relative group shadow-[0_1px_2px_rgba(0,0,0,0.02)] animate-in fade-in duration-300`}>
                                    <button
                                        onClick={() => toggleJoin(party.id)}
                                        disabled={isFull && !party.joined}
                                        className={`absolute right-3 top-3 w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${party.joined ? 'bg-peg-accent-blue border-peg-accent-blue text-white' :
                                            isFull ? 'bg-[var(--color-peg-bg)] border-peg-border opacity-50 cursor-not-allowed' :
                                                'bg-white border-peg-border hover:border-peg-text'
                                            }`}
                                    >
                                        {party.joined && (
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path></svg>
                                        )}
                                    </button>

                                    <h4 className="text-xs font-bold mb-1 w-5/6 truncate">
                                        {party.title}
                                    </h4>

                                    <div className="flex items-center text-[9px] font-mono text-peg-text/60 mt-1 space-x-3">
                                        <span className="flex items-center">
                                            <ClockIcon size={10} className="mr-1 opacity-40" />
                                            {party.time}
                                        </span>
                                        <span className="flex items-center truncate max-w-[100px]">
                                            <MapPin size={10} className="mr-1 opacity-40" />
                                            {party.place}
                                        </span>
                                    </div>

                                    <div className={`mt-2 self-end text-[10px] font-mono tracking-widest tabular-nums px-1.5 py-0.5 rounded border ${isFull ? 'bg-peg-text text-white border-peg-text' : 'bg-[var(--color-peg-bg)] text-peg-text border-peg-border'}`}>
                                        [{party.current}/{party.max}]
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecruitmentWidget;
