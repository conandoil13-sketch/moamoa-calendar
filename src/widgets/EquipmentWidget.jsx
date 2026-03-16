import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { equipmentMock } from '../data/mockData';

const EquipmentWidget = ({ selectedCourse, setSelectedCourse, myCourses, dragHandleProps }) => {
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState('');
    const [isDropdown, setDropdown] = useState(false);

    // Update items when selected course changes
    useEffect(() => {
        const courseItems = equipmentMock[selectedCourse.id] || [];
        setItems(courseItems);
    }, [selectedCourse]);

    const toggleItem = (id) => {
        setItems(items.map(item =>
            item.id === id ? { ...item, checked: !item.checked } : item
        ));
    };

    const addItem = (e) => {
        e.preventDefault();
        if (!newItem.trim()) return;

        const newEq = {
            id: `eq_${Date.now()}`,
            name: newItem.trim(),
            checked: false
        };
        setItems([...items, newEq]);
        setNewItem('');
    };

    const isAllChecked = items.length > 0 && items.every(i => i.checked);

    return (
        <div className="w-full h-full border-[1px] border-peg-border rounded-xl bg-peg-bg shadow-[0_2px_4px_rgba(0,0,0,0.05)] flex flex-col transition-all relative overflow-hidden z-10 hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
            {/* Header: Receipt Printer Esthetics */}
            <div
                {...dragHandleProps}
                className="h-10 border-b-[1px] border-dashed border-peg-border px-4 bg-gradient-to-b from-[#FAFAFA] to-peg-bg shrink-0 flex items-center justify-between cursor-move"
            >
                <div className="flex flex-col pointer-events-none">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-peg-text mb-1">
                        [모듈 04] 준비물 아카이브
                    </span>
                    <span className="text-[11px] font-mono opacity-60">REF: {selectedCourse.id}</span>
                </div>
                {/* Status Indicator */}
                <div className={`w-2 h-2 rounded-full ${isAllChecked ? 'bg-peg-accent-blue shadow-[0_0_6px_var(--color-peg-accent-blue)]' : 'bg-peg-border'} transition-colors`}></div>
            </div>

            <div className="p-4 flex-grow flex flex-col bg-[#FAFAFA] overflow-y-auto receipt-bg-pattern relative">

                {/* Course Selector Dropdown */}
                <div className="relative mb-3 z-20">
                    <button
                        onClick={() => setDropdown(!isDropdown)}
                        className="w-full border-[1px] border-peg-border rounded-lg bg-gradient-to-b from-[#FFFFFF] to-[#F8F8F8] p-2 flex justify-between items-center hover:bg-white shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)] transition-colors focus:outline-none"
                    >
                        <div className="text-left flex flex-col truncate pr-2">
                            <span className="font-bold text-[13px] text-peg-text truncate">{selectedCourse.title}</span>
                            <span className="text-[9px] text-peg-text/60 font-mono mt-0.5 truncate">{selectedCourse.professor}</span>
                        </div>
                        <ChevronDown size={14} className={`text-peg-text shrink-0 transition-transform duration-300 ${isDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    <div
                        className={`absolute z-30 top-full mt-1 left-0 w-full border-[1px] border-peg-border rounded-lg bg-white transition-all transform origin-top shadow-lg overflow-hidden ${isDropdown ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 pointer-events-none'}`}
                    >
                        {myCourses.length === 0 ? (
                            <div className="p-2 text-[10px] text-peg-text/50">등록된 과목이 없습니다.</div>
                        ) : (
                            myCourses.map((course, index) => (
                                <div
                                    key={course.id}
                                    className={`p-2 border-peg-border hover:bg-peg-accent-blue hover:text-white cursor-pointer transition-colors group ${index !== myCourses.length - 1 ? 'border-b-[1px]' : ''}`}
                                    onClick={() => {
                                        if (selectedCourse?.id !== course.id) {
                                            setSelectedCourse(course);
                                        }
                                        setDropdown(false);
                                    }}
                                >
                                    <div className="font-bold text-[12px] truncate">{course.title}</div>
                                    <div className="text-[9px] opacity-60 font-mono group-hover:opacity-100 truncate">{course.professor}</div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="text-[9px] font-mono text-peg-text/50 uppercase tracking-widest border-b-[1px] border-peg-text/20 pb-2 mb-3">
                    Required Equipment list
                </div>

                {/* List Items */}
                <div className="flex flex-col gap-2 flex-grow">
                    {items.length === 0 ? (
                        <div className="text-[10px] font-mono text-peg-text/40 pt-4 text-center">
                            NO REQUIRED ITEMS.
                        </div>
                    ) : (
                        items.map(item => (
                            <div key={item.id} className="flex items-center group cursor-pointer" onClick={() => toggleItem(item.id)}>
                                {/* Mechanical Checkbox */}
                                <div className={`w-3.5 h-3.5 border-[1px] rounded-[2px] flex items-center justify-center mr-3 shrink-0 transition-colors shadow-[inset_0_1px_1px_rgba(0,0,0,0.1)] ${item.checked ? 'border-peg-text bg-peg-text' : 'border-peg-border bg-white group-hover:border-peg-text/50'}`}>
                                    {item.checked && (
                                        <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path></svg>
                                    )}
                                </div>
                                <span className={`text-[12px] font-mono transition-all ${item.checked ? 'line-through opacity-40 cursor-default' : 'text-peg-text group-hover:-translate-y-[1px]'}`}>
                                    {item.name}
                                </span>
                            </div>
                        ))
                    )}
                </div>

                {/* Add Item Form */}
                <form onSubmit={addItem} className="mt-4 pt-3 border-t-[1px] border-dashed border-peg-text/20 flex gap-2 shrink-0">
                    <input
                        type="text"
                        value={newItem}
                        onChange={(e) => setNewItem(e.target.value)}
                        placeholder="새로운 준비물 검색..."
                        className="flex-grow bg-transparent border-b-[1px] border-peg-border focus:border-peg-text outline-none text-[11px] font-mono pb-1 transition-colors px-1 placeholder:text-peg-text/30"
                    />
                    <button
                        type="submit"
                        disabled={!newItem.trim()}
                        className="w-6 h-6 shrink-0 flex items-center justify-center border-[1px] border-peg-border bg-gradient-to-b from-[#FFFFFF] to-[#F0F0F0] rounded-[2px] shadow-[0_1px_2px_rgba(0,0,0,0.1)] active:shadow-none active:translate-y-[1px] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <svg className="w-3 h-3 text-peg-text" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"></path></svg>
                    </button>
                </form>
            </div>

            {/* Sawtooth bottom border for Receipt effect */}
            <div className="h-2 w-full flex shrink-0" style={{ background: 'linear-gradient(135deg, transparent 50%, #FAFAFA 50%) 0 0/10px 100%, linear-gradient(45deg, transparent 50%, #FAFAFA 50%) 0 0/10px 100%', borderBottom: '2px solid var(--color-peg-border)' }}></div>
        </div>
    );
};

export default EquipmentWidget;
