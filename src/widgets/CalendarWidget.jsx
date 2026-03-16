import React, { useState } from 'react';
import { calendarEventsMock } from '../data/mockData';
import { X, Plus, Trash2, Hash } from 'lucide-react';

// Import live data
import academicScheduleRaw from '../data/academic_schedule.json';
import holidaysRaw from '../data/holidays.json';

const CalendarWidget = ({ dragHandleProps }) => {
    const today = new Date();
    const [events, setEvents] = useState(calendarEventsMock);
    const [viewMode, setViewMode] = useState('month');
    const [currentYear, setCurrentYear] = useState(2026);
    const [currentMonth, setCurrentMonth] = useState(3);
    const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
    const [draggedEvent, setDraggedEvent] = useState(null);

    // Calculate Grid (Moved up for scoping)
    const getDaysInMonth = (year, month) => new Date(year, month, 0).getDate();
    const getFirstDayOfMonth = (year, month) => new Date(year, month - 1, 1).getDay();

    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

    const gridDays = [];
    const prevMonthDays = getDaysInMonth(currentYear, currentMonth - 1);
    for (let i = firstDay - 1; i >= 0; i--) {
        gridDays.push({ day: prevMonthDays - i, month: currentMonth - 1, isPadding: true });
    }
    for (let i = 1; i <= daysInMonth; i++) {
        gridDays.push({ day: i, month: currentMonth, isPadding: false });
    }
    const remaining = 42 - gridDays.length;
    for (let i = 1; i <= remaining; i++) {
        gridDays.push({ day: i, month: currentMonth + 1, isPadding: true });
    }

    // Modal state for Add/Edit
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [eventForm, setEventForm] = useState({ title: '', date: 1, color: '#0047FF' });

    // Advanced Color Management
    const [customColors, setCustomColors] = useState(['#0047FF', '#FF3B30', '#FFE600', '#101010', '#00D084']);
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const [hex, setHex] = useState('#0047FF');
    // Derived RGB from HEX
    const rgb = React.useMemo(() => {
        const r = parseInt(hex.slice(1, 3), 16) || 0;
        const g = parseInt(hex.slice(3, 5), 16) || 0;
        const b = parseInt(hex.slice(5, 7), 16) || 0;
        return { r, g, b };
    }, [hex]);

    const handleRgbChange = (channel, value) => {
        const newRgb = { ...rgb, [channel]: parseInt(value) };
        const newHex = `#${newRgb.r.toString(16).padStart(2, '0')}${newRgb.g.toString(16).padStart(2, '0')}${newRgb.b.toString(16).padStart(2, '0')}`.toUpperCase();
        setHex(newHex);
        setEventForm({ ...eventForm, color: newHex });
    };

    const handleHexChange = (e) => {
        let val = e.target.value;
        if (!val.startsWith('#')) val = '#' + val;
        setHex(val);
        if (/^#[0-9A-F]{6}$/i.test(val)) {
            setEventForm({ ...eventForm, color: val });
        }
    };

    const addNewColor = () => {
        if (!customColors.includes(hex.toUpperCase())) {
            setCustomColors([...customColors, hex.toUpperCase()]);
        }
    };

    const deleteColor = (colorToDelete) => {
        setCustomColors(customColors.filter(c => c !== colorToDelete));
        if (eventForm.color === colorToDelete) {
            setEventForm({ ...eventForm, color: customColors[0] || '#101010' });
        }
    };

    // Drag and Drop handlers
    const handleDragStart = (e, evt) => {
        if (evt.type === 'academic' || evt.type === 'holiday') {
            e.preventDefault();
            return;
        }
        setDraggedEvent(evt);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e, dayTarget) => {
        e.preventDefault();
        if (!draggedEvent) return;

        setEvents(prev =>
            prev.map(evt =>
                evt.id === draggedEvent.id ? { ...evt, date: dayTarget, month: currentMonth } : evt
            )
        );
        setDraggedEvent(null);
    };

    const handleDayClick = (dayData) => {
        if (dayData.isPadding) return;
        setEventForm({ title: '', date: dayData.day, color: customColors[0] || '#0047FF' });
        setEditingEvent(null);
        setIsModalOpen(true);
        setIsPickerOpen(false);
    };

    const handleEventClick = (e, evt) => {
        e.stopPropagation();
        if (evt.type === 'academic' || evt.type === 'holiday') return;

        let color = evt.color;
        setEventForm({ title: evt.title, date: evt.date, color: color });
        setHex(color);
        setEditingEvent(evt);
        setIsModalOpen(true);
        setIsPickerOpen(false);
    };

    const handleSaveEvent = (e) => {
        e.preventDefault();
        if (!eventForm.title.trim()) return;

        if (editingEvent) {
            setEvents(events.map(ev => ev.id === editingEvent.id ? { ...ev, title: eventForm.title, color: eventForm.color } : ev));
        } else {
            setEvents([...events, { id: `evt_${Date.now()}`, type: 'custom', month: currentMonth, ...eventForm }]);
        }
        setIsModalOpen(false);
    };

    const handleDeleteEvent = () => {
        if (editingEvent) {
            setEvents(events.filter(ev => ev.id !== editingEvent.id));
            setIsModalOpen(false);
        }
    };

    // Combine custom events with academic and holiday data
    const getAllEventsForDay = (day, month) => {
        const list = [];

        // Holidays
        const dateStr = `${currentYear}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const holiday = holidaysRaw.find(h => h.date === dateStr);
        if (holiday) {
            list.push({ id: `hol_${dateStr}`, title: holiday.name, type: 'holiday', color: '#FF3B30' });
        }

        // Academic Schedule
        academicScheduleRaw.forEach((item, idx) => {
            if (item.month === month) {
                const parts = item.range.split('~').map(p => p.trim());
                if (parts.length === 2) {
                    const sParts = parts[0].split('.');
                    const eParts = parts[1].split('.');
                    if (sParts.length >= 2 && eParts.length >= 2) {
                        const startDay = parseInt(sParts[1]);
                        const endDay = parseInt(eParts[1]);
                        if (day >= startDay && day <= endDay) {
                            list.push({ id: `acad_${idx}`, title: item.description, type: 'academic', color: '#0047FF' });
                        }
                    }
                } else if (parts.length === 1) {
                    const dParts = parts[0].split('.');
                    if (dParts.length >= 2) {
                        const eventDay = parseInt(dParts[1]);
                        if (day === eventDay) {
                            list.push({ id: `acad_${idx}`, title: item.description, type: 'academic', color: '#0047FF' });
                        }
                    }
                }
            }
        });

        // Custom Events
        const custom = events.filter(e => e.date === day && (e.month === month || (!e.month && month === 3)));
        list.push(...custom);

        return list;
    };

    // Handle Month/Week Navigation
    const handlePrev = () => {
        if (viewMode === 'month') {
            if (currentMonth === 1) {
                setCurrentYear(y => y - 1);
                setCurrentMonth(12);
            } else {
                setCurrentMonth(prev => prev - 1);
            }
        } else {
            if (currentWeekIndex === 0) {
                // Move to last week of prev month
                if (currentMonth === 1) {
                    setCurrentYear(y => y - 1);
                    setCurrentMonth(12);
                } else {
                    setCurrentMonth(prev => prev - 1);
                }
                setCurrentWeekIndex(5); // Default to last row
            } else {
                setCurrentWeekIndex(prev => prev - 1);
            }
        }
    };

    const handleNext = () => {
        if (viewMode === 'month') {
            if (currentMonth === 12) {
                setCurrentYear(y => y + 1);
                setCurrentMonth(1);
            } else {
                setCurrentMonth(prev => prev + 1);
            }
        } else {
            if (currentWeekIndex === 5) {
                // Move to first week of next month
                if (currentMonth === 12) {
                    setCurrentYear(y => y + 1);
                    setCurrentMonth(1);
                } else {
                    setCurrentMonth(prev => prev + 1);
                }
                setCurrentWeekIndex(0);
            } else {
                setCurrentWeekIndex(prev => prev + 1);
            }
        }
    };

    // Combine Week Index logic into navigation/state changes rather than separate effect
    const setViewModeWithInit = (mode) => {
        if (mode === 'week') {
            const todayDate = today.getDate();
            const todayMonth = today.getMonth() + 1;
            const todayYear = today.getFullYear();

            if (currentYear === todayYear && currentMonth === todayMonth) {
                const index = gridDays.findIndex(d => d.day === todayDate && d.month === todayMonth);
                if (index !== -1) setCurrentWeekIndex(Math.floor(index / 7));
            } else {
                setCurrentWeekIndex(0);
            }
        }
        setViewMode(mode);
    };

    // ... (omitting getAllEventsForDay for brevity)

    // Determine visible days based on viewMode
    let visibleDays = gridDays;
    if (viewMode === 'week') {
        const start = currentWeekIndex * 7;
        visibleDays = gridDays.slice(start, start + 7);
    }

    const renderEvent = (evt) => {
        if (evt.type === 'academic' || evt.type === 'holiday') {
            return (
                <div key={evt.id} className={`text-[8px] font-mono mt-0.5 truncate uppercase cursor-default px-1 py-0.5 rounded-[1px] ${evt.type === 'holiday' ? 'text-white bg-peg-accent-red font-bold' : 'text-peg-accent-blue bg-peg-accent-blue/5'}`}>
                    {evt.title}
                </div>
            );
        }

        const colorStyle = { backgroundColor: evt.color };

        return (
            <div
                key={evt.id}
                draggable
                onDragStart={(e) => handleDragStart(e, evt)}
                onClick={(e) => handleEventClick(e, evt)}
                style={colorStyle}
                className="text-[9px] font-mono mt-1 w-full truncate px-1 py-0.5 text-white cursor-pointer active:cursor-grabbing rounded-[2px] transition-transform hover:scale-[1.02] shadow-[0_1px_2px_rgba(0,0,0,0.1)]"
            >
                {evt.title}
            </div>
        );
    };

    return (
        <div className="w-full h-full border-[1px] border-peg-border rounded-xl bg-peg-bg shadow-[0_2px_4px_rgba(0,0,0,0.05)] flex flex-col overflow-hidden z-10 hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] relative bg-white">
            {/* Widget Header */}
            <div
                {...dragHandleProps}
                className="h-10 border-b-[1px] border-peg-border px-4 flex items-center justify-between bg-gradient-to-b from-[#FAFAFA] to-peg-bg shrink-0 cursor-move"
            >
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-peg-text hidden sm:inline-block pointer-events-none">
                    [모듈 02] 캘린더 매트릭스
                </span>

                <div className="flex items-center space-x-3 sm:space-x-6 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="flex items-center space-x-2 text-[10px] font-mono text-peg-text bg-white px-2 py-0.5 rounded border-[1px] border-peg-border shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                        <button onClick={handlePrev} className="hover:text-peg-accent-blue transition-colors px-1">&lt;</button>
                        <span className="tracking-widest font-bold w-20 text-center">{currentYear}.{String(currentMonth).padStart(2, '0')}</span>
                        <button onClick={handleNext} className="hover:text-peg-accent-blue transition-colors px-1">&gt;</button>
                    </div>

                    <div className="flex border-[1px] border-peg-border bg-[#F0F0F0] p-0.5 rounded shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]">
                        <button
                            onClick={() => setViewModeWithInit('month')}
                            className={`text-[9px] font-mono px-3 py-1 uppercase tracking-wider transition-colors rounded-[2px] ${viewMode === 'month' ? 'bg-white text-peg-text shadow-[0_1px_2px_rgba(0,0,0,0.1)] font-bold' : 'text-peg-text/50 hover:text-peg-text'}`}
                        >
                            Month
                        </button>
                        <button
                            onClick={() => setViewModeWithInit('week')}
                            className={`text-[9px] font-mono px-3 py-1 uppercase tracking-wider transition-colors rounded-[2px] ${viewMode === 'week' ? 'bg-white text-peg-text shadow-[0_1px_2px_rgba(0,0,0,0.1)] font-bold' : 'text-peg-text/50 hover:text-peg-text'}`}
                        >
                            Week
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-grow p-4 md:p-6 bg-peg-bg overflow-hidden flex flex-col relative">
                <div className="w-full h-full border-[1px] border-peg-border bg-[#FAFAFA] flex flex-col shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden rounded-lg">
                    {/* Days Header */}
                    <div className="grid grid-cols-7 border-b-[1px] border-peg-border shrink-0">
                        {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day, idx) => (
                            <div key={day} className={`py-2 text-center text-[9px] font-mono tracking-widest border-r-[1px] border-peg-border last:border-r-0 ${idx === 0 ? 'text-peg-accent-red font-bold' : 'text-[#101010]'}`}>
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Grid */}
                    <div className={`grid grid-cols-7 flex-grow auto-rows-fr overflow-y-auto bg-peg-border gap-[1px] ${viewMode === 'week' ? 'min-h-[120px]' : ''}`}>
                        {visibleDays.map((dayObj, idx) => {
                            const dayEvents = getAllEventsForDay(dayObj.day, dayObj.month);
                            const isSunday = idx % 7 === 0;
                            const isSaturday = idx % 7 === 6;
                            const isToday = today.getFullYear() === currentYear && today.getMonth() + 1 === dayObj.month && today.getDate() === dayObj.day;

                            return (
                                <div
                                    key={`${dayObj.month}-${dayObj.day}-${idx}`}
                                    className={`p-1.5 relative min-h-[70px] transition-colors group ${dayObj.isPadding ? 'bg-white/30 text-peg-text/20' : isSunday || isSaturday ? 'bg-[#FAFAFA]' : 'bg-white'} hover:bg-[#F0F8FF]`}
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDrop(e, dayObj.day)}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex flex-col">
                                            <span className={`text-[10px] font-mono ${dayObj.isPadding ? 'text-peg-text/20' : isSunday ? 'text-peg-accent-red' : isSaturday ? 'text-blue-500' : 'text-peg-text/60'} ml-1`}>
                                                {dayObj.day}
                                            </span>
                                            {isToday && (
                                                <div className="w-1 h-1 bg-peg-accent-blue rounded-full ml-1.5 mt-0.5" />
                                            )}
                                        </div>
                                        <button
                                            onClick={() => handleDayClick(dayObj)}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity w-4 h-4 rounded-[2px] bg-[#E8E6E0] text-peg-text flex items-center justify-center hover:bg-peg-accent-blue hover:text-white"
                                        >
                                            <Plus size={10} />
                                        </button>
                                    </div>
                                    <div className="mt-1 flex flex-col gap-1 w-full relative z-10">
                                        {dayEvents.map(renderEvent)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Event Modal Override with Advanced Color Picker */}
                {isModalOpen && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-peg-bg/60 backdrop-blur-sm p-4">
                        <div className="bg-white border-[1px] border-peg-border rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.1)] w-full max-w-sm flex flex-col overflow-hidden slide-up animate-in duration-200">
                            <div className="h-10 border-b-[1px] border-peg-border px-4 py-3 bg-gradient-to-b from-[#FAFAFA] to-white flex justify-between items-center">
                                <span className="text-[10px] font-mono font-bold tracking-widest text-[#101010]">
                                    {editingEvent ? 'EDIT EVENT SEQUENCE' : 'NEW EVENT STREAM'}
                                </span>
                                <button onClick={() => setIsModalOpen(false)} className="text-peg-text/50 hover:text-peg-text transition-colors">
                                    <X size={14} />
                                </button>
                            </div>

                            <form onSubmit={handleSaveEvent} className="p-5 flex flex-col gap-5">
                                <div>
                                    <label className="block text-[9px] font-mono font-bold text-peg-text/50 mb-1.5 tracking-widest uppercase">Event Identifier</label>
                                    <input
                                        type="text"
                                        value={eventForm.title}
                                        onChange={e => setEventForm({ ...eventForm, title: e.target.value })}
                                        className="w-full border-[1px] border-peg-border rounded px-3 py-2 text-[12px] font-mono focus:outline-none focus:border-peg-accent-blue shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] transition-all"
                                        placeholder="INPUT_ID..."
                                        autoFocus
                                    />
                                </div>

                                <div>
                                    <div className="flex justify-between items-end mb-2">
                                        <label className="text-[9px] font-mono font-bold text-peg-text/50 tracking-widest uppercase">Color Matrix</label>
                                        <button
                                            type="button"
                                            onClick={() => setIsPickerOpen(!isPickerOpen)}
                                            className="text-[9px] font-mono font-bold text-peg-accent-blue bg-peg-accent-blue/5 px-2 py-1 rounded border-[1px] border-peg-accent-blue/20 hover:bg-peg-accent-blue hover:text-white transition-all"
                                        >
                                            {isPickerOpen ? 'CLOSE_PICKER' : 'CUSTOM_COLOR'}
                                        </button>
                                    </div>

                                    {/* Advanced Color Picker Sliders */}
                                    {isPickerOpen && (
                                        <div className="mb-4 p-4 bg-[#FAFAFA] border-[1px] border-dashed border-peg-border rounded-lg space-y-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded border-[1px] border-peg-border shadow-inner" style={{ backgroundColor: hex }} />
                                                <div className="flex-grow space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <Hash size={10} className="text-peg-text/40" />
                                                        <input
                                                            type="text"
                                                            value={hex}
                                                            onChange={handleHexChange}
                                                            className="flex-grow bg-transparent border-none outline-none font-mono text-[11px] font-bold text-peg-text uppercase"
                                                        />
                                                    </div>
                                                    <div className="text-[8px] font-mono text-peg-text/40">HEX_FORMAT_INPUT</div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={addNewColor}
                                                    className="p-2 bg-peg-text text-white rounded hover:bg-peg-accent-blue transition-colors"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>

                                            {/* RGB Sliders */}
                                            <div className="space-y-3">
                                                {['r', 'g', 'b'].map(channel => (
                                                    <div key={channel} className="flex items-center gap-3">
                                                        <span className="text-[10px] font-mono font-bold w-4 text-peg-text/50 uppercase">{channel}</span>
                                                        <input
                                                            type="range"
                                                            min="0"
                                                            max="255"
                                                            value={rgb[channel]}
                                                            onChange={(e) => handleRgbChange(channel, e.target.value)}
                                                            className="flex-grow h-1 bg-[#E0E0E0] rounded-lg appearance-none cursor-pointer accent-peg-text"
                                                            style={{
                                                                backgroundImage: `linear-gradient(to right, ${channel === 'r' ? '#000, #F00' : channel === 'g' ? '#000, #0F0' : '#000, #00F'})`
                                                            }}
                                                        />
                                                        <span className="text-[9px] font-mono text-peg-text/60 w-6 text-right">{rgb[channel]}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-6 gap-3">
                                        {customColors.map(color => (
                                            <div key={color} className="relative group">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setEventForm({ ...eventForm, color });
                                                        setHex(color);
                                                    }}
                                                    style={{ backgroundColor: color }}
                                                    className={`w-full aspect-square rounded-full transition-all flex items-center justify-center ${eventForm.color === color ? 'ring-2 ring-offset-2 ring-peg-text scale-110 shadow-lg' : 'border-[1px] border-black/10 opacity-70 hover:opacity-100 shadow-sm'}`}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => deleteColor(color)}
                                                    className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-peg-accent-red text-white flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X size={8} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t-[1px] border-peg-border/50">
                                    {editingEvent && (
                                        <button
                                            type="button"
                                            onClick={handleDeleteEvent}
                                            className="px-3 py-1.5 text-[10px] font-mono text-peg-accent-red hover:bg-[#FFF0F0] rounded mr-auto transition-colors font-bold flex items-center gap-1.5"
                                        >
                                            <Trash2 size={12} />
                                            DELETE
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-1.5 border-[1px] border-peg-border rounded text-[10px] font-mono font-bold hover:bg-[#F4F4F4] transition-colors"
                                    >
                                        CANCEL
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-peg-text text-white border-[1px] border-peg-text rounded-lg text-[10px] font-mono font-bold tracking-widest shadow-lg hover:bg-peg-accent-blue hover:border-peg-accent-blue transition-all active:scale-[0.98]"
                                    >
                                        SAVE_SEQUENCE
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CalendarWidget;
