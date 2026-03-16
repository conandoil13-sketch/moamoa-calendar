import React, { useState } from 'react';
import { ChevronDown, Plus, X } from 'lucide-react';

// Simulated DB of available courses to "search" from
const availableCourses = [
    '디자인과 글쓰기',
    '인터랙션 디자인',
    '타이포그래피 리서치',
    'UX 리서치 방법론',
    '캡스톤 디자인 I',
    '브랜드 아이덴티티',
    '모션 그래픽스',
    '디자인사',
    '3D 렌더링 스튜디오'
];

const CourseListWidget = ({ myCourses, setMyCourses, dragHandleProps }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [searchTitle, setSearchTitle] = useState('');
    const [professor, setProfessor] = useState('');
    const [isDropdown, setDropdown] = useState(false);

    const handleAdd = (e) => {
        e.preventDefault();
        if (!searchTitle.trim()) return;

        const newCourse = {
            id: `cd_${Date.now()}`,
            title: searchTitle.trim(),
            professor: professor.trim() || '-',
            color: 'blue',
            avgTime: Math.floor(Math.random() * 5) + 1,
            activeNodes: Math.floor(Math.random() * 50) + 10,
            weeklyData: Array.from({ length: 7 }, () => Math.floor(Math.random() * 100))
        };

        setMyCourses([newCourse, ...myCourses]);
        setIsAdding(false);
        setSearchTitle('');
        setProfessor('');
    };

    const removeCourse = (id) => {
        setMyCourses(myCourses.filter(c => c.id !== id));
    };

    const filteredCourses = availableCourses.filter(c => c.toLowerCase().includes(searchTitle.toLowerCase()));

    return (
        <div className="w-full h-full border-[1px] border-peg-border rounded-xl bg-peg-bg drop-shadow-[0_2px_4px_rgba(0,0,0,0.05)] flex flex-col transition-all relative overflow-hidden">
            {/* Header: Minimal Analog Plate */}
            <div
                {...dragHandleProps}
                className="h-10 border-b-[1px] border-peg-border px-4 bg-gradient-to-b from-[#FAFAFA] to-peg-bg shrink-0 flex items-center justify-between cursor-move"
            >
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-peg-text pointer-events-none">
                    수강 과목 관리 (IN)
                </span>

                {/* Physical-style LED */}
                <div className={`w-2 h-2 rounded-full ${myCourses.length > 0 ? 'bg-[#227041] shadow-[0_0_8px_rgba(34,112,65,0.6)]' : 'bg-[#B0AEA6]'}`}></div>
            </div>

            <div className="p-4 flex-grow flex flex-col bg-peg-bg overflow-y-auto">
                {/* Add New Button/Form */}
                {!isAdding ? (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="w-full border-[1px] border-peg-border rounded-full bg-gradient-to-b from-[#FFFFFF] to-[#F0F0F0] py-2 flex items-center justify-center group mb-4 shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:shadow-[0_2px_5px_rgba(0,0,0,0.1)] transition-all active:scale-[0.98]"
                    >
                        <Plus size={14} className="text-peg-text opacity-70 group-hover:opacity-100" />
                        <span className="text-[11px] font-bold font-mono tracking-widest ml-1 opacity-70 group-hover:opacity-100">ADD COURSE</span>
                    </button>
                ) : (
                    <form onSubmit={handleAdd} className="border-[1px] border-peg-border bg-white rounded-lg p-3 mb-4 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] relative z-20">
                        <div className="mb-2 relative">
                            <label className="text-[9px] font-mono text-peg-text/50 uppercase tracking-widest mb-1 block">Course Name</label>

                            {/* Search Dropdown Input */}
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchTitle}
                                    onChange={(e) => {
                                        setSearchTitle(e.target.value);
                                        setDropdown(true);
                                    }}
                                    onFocus={() => setDropdown(true)}
                                    onBlur={() => setTimeout(() => setDropdown(false), 200)}
                                    placeholder="과목명 검색 또는 입력..."
                                    className="w-full border-[1px] border-peg-border rounded bg-[#F8F8F8] px-2 py-1.5 text-[12px] font-bold focus:bg-white focus:outline-none focus:border-peg-accent-blue"
                                    autoFocus
                                />
                                {isDropdown && searchTitle.length > 0 && (
                                    <div className="absolute top-full left-0 w-full mt-1 border-[1px] border-peg-border bg-white shadow-lg rounded max-h-32 overflow-y-auto z-30">
                                        {filteredCourses.length > 0 ? (
                                            filteredCourses.map((c, idx) => (
                                                <div
                                                    key={idx}
                                                    className="px-2 py-1.5 text-[11px] hover:bg-peg-accent-blue hover:text-white cursor-pointer truncate"
                                                    onClick={() => {
                                                        setSearchTitle(c);
                                                        setDropdown(false);
                                                    }}
                                                >
                                                    {c}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="px-2 py-1.5 text-[11px] text-peg-text/40 italic">신규 과목으로 등록됩니다.</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="text-[9px] font-mono text-peg-text/50 uppercase tracking-widest mb-1 block">Professor</label>
                            <input
                                type="text"
                                value={professor}
                                onChange={(e) => setProfessor(e.target.value)}
                                placeholder="교수명 입력 (선택)"
                                className="w-full border-[1px] border-peg-border rounded bg-[#F8F8F8] px-2 py-1.5 text-[11px] font-mono focus:bg-white focus:outline-none focus:border-peg-accent-blue"
                            />
                        </div>

                        <div className="flex justify-end space-x-2">
                            <button
                                type="button"
                                onClick={() => setIsAdding(false)}
                                className="px-3 py-1 text-[10px] font-mono border-[1px] border-transparent hover:border-peg-border rounded transition-colors"
                            >
                                / CANCEL
                            </button>
                            <button
                                type="submit"
                                disabled={!searchTitle.trim()}
                                className="px-3 py-1 text-[10px] font-mono border-[1px] border-peg-border bg-peg-text text-white rounded hover:bg-peg-accent-blue hover:border-peg-accent-blue transition-colors disabled:opacity-30"
                            >
                                / SAVE
                            </button>
                        </div>
                    </form>
                )}

                {/* Course List */}
                <div className="text-[10px] font-mono text-peg-text/50 uppercase tracking-widest border-b-[1px] border-peg-text/20 pb-2 mb-3">
                    Active Signals ({myCourses.length})
                </div>

                <div className="flex flex-col gap-2">
                    {myCourses.length === 0 ? (
                        <div className="text-[10px] font-mono text-peg-text/40 pt-4 text-center">
                            NO ACTIVE COURSES.
                        </div>
                    ) : (
                        myCourses.map((course, idx) => (
                            <div key={course.id} className="group relative border-[1px] border-peg-border bg-white rounded-lg p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex items-center justify-between hover:border-peg-accent-blue transition-colors">
                                <div className="flex flex-col truncate pr-4">
                                    <span className="font-bold text-[13px] text-peg-text truncate flex items-center gap-2">
                                        <span className="text-[9px] font-mono text-peg-text/40">CH.{String(idx + 1).padStart(2, '0')}</span>
                                        {course.title}
                                    </span>
                                    <span className="text-[10px] text-peg-text/60 font-mono mt-0.5 ml-6 truncate">{course.professor}</span>
                                </div>

                                <button
                                    onClick={() => removeCourse(course.id)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 flex items-center justify-center border-[1px] border-peg-border rounded-full hover:bg-peg-accent-red hover:border-peg-accent-red hover:text-white shrink-0 bg-peg-bg"
                                    title="Unplug channel"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default CourseListWidget;
