import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import { useDraggable } from '@dnd-kit/core';
import {
  Clock,
  Calendar as CalendarIcon,
  Layers,
  Archive,
  Users,
  Music,
  MessageSquare,
  Settings,
  Zap,
  ChevronLeft,
  ChevronRight,
  Plus,
  CheckSquare,
  Trophy,
  HelpCircle,
  Layout
} from 'lucide-react';

import Pegboard from './layout/Pegboard';
import TimerWidget from './widgets/TimerWidget';
import CalendarWidget from './widgets/CalendarWidget';
import CafeteriaMenuWidget from './widgets/CafeteriaMenuWidget';
import RecruitmentWidget from './widgets/RecruitmentWidget';
import TodoListWidget from './widgets/TodoListWidget';
import RankingWidget from './widgets/RankingWidget';
import EquipmentWidget from './widgets/EquipmentWidget';
import FeedbackWidget from './widgets/FeedbackWidget';
import AudioChartWidget from './widgets/AudioChartWidget';
import CourseListWidget from './widgets/CourseListWidget';
import SortableWidget from './components/SortableWidget';
import SettingsModal from './components/SettingsModal';
import { courseData } from './data/mockData';
import './index.css';

// Base constants for the grid
const GRID_COLS = 12;
const GRID_GAP = 24;

// Template Library
const WIDGET_LIBRARY = {
  timer: { id: 'timer', component: TimerWidget, colSpan: 4, rowSpan: 4, icon: Clock, label: 'FOCUS TIMER' },
  calendar: { id: 'calendar', component: CalendarWidget, colSpan: 8, rowSpan: 4, icon: CalendarIcon, label: 'CALENDAR' },
  courses: { id: 'courses', component: CourseListWidget, colSpan: 3, rowSpan: 3, icon: Layers, label: 'COURSE MANAGER' },
  equipment: { id: 'equipment', component: EquipmentWidget, colSpan: 3, rowSpan: 3, icon: Archive, label: 'EQUIPMENT' },
  party: { id: 'party', component: RecruitmentWidget, colSpan: 3, rowSpan: 3, icon: Users, label: 'RECRUITMENT' },
  cafeteria: { id: 'cafeteria', component: CafeteriaMenuWidget, colSpan: 3, rowSpan: 3, icon: Zap, label: 'CAFETERIA' },
  todo: { id: 'todo', component: TodoListWidget, colSpan: 3, rowSpan: 3, icon: CheckSquare, label: 'TODO LIST' },
  ranking: { id: 'ranking', component: RankingWidget, colSpan: 3, rowSpan: 3, icon: Trophy, label: 'WEEKLY RANK' },
  audio: { id: 'audio', component: AudioChartWidget, colSpan: 3, rowSpan: 3, icon: Music, label: 'AUDIO CHART' },
  feedback: { id: 'feedback', component: FeedbackWidget, colSpan: 7, rowSpan: 3, icon: MessageSquare, label: 'FEEDBACK BOARD' },
};

const SIDEBAR_GROUPS = [
  {
    id: 'analysis',
    label: '분석 및 일정',
    icon: Layout,
    widgets: ['calendar', 'timer', 'courses']
  },
  {
    id: 'daily',
    label: '데일리',
    icon: CheckSquare,
    widgets: ['todo', 'equipment']
  },
  {
    id: 'comm',
    label: '소통',
    icon: MessageSquare,
    widgets: ['feedback', 'party', 'cafeteria']
  },
  {
    id: 'aux',
    label: '보조 장치',
    icon: Music,
    widgets: ['audio', 'ranking']
  }
];

// Draggable Sidebar Icon Component
const LibraryItem = ({ type, config }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `library-${type}`,
    data: { type: 'spawner', widgetType: type }
  });

  const Icon = config.icon;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`w-11 h-11 rounded-2xl transition-all relative group flex items-center justify-center border-[1px] cursor-grab active:cursor-grabbing
        ${isDragging ? 'opacity-40 grayscale' : 'bg-peg-knob/40 border-transparent text-black/30 hover:text-black/60 hover:bg-peg-knob/60'}
      `}
    >
      <Icon size={18} />
      <div className={`absolute -right-1 top-0 w-2.5 h-2.5 rounded-full border-[2px] border-[#E8E6DF] bg-[#DAD7CD] scale-75`} />

      {/* Tooltip Label */}
      <div className="absolute right-[calc(100%+25px)] px-3 py-1.5 bg-[#F4F2EC] text-black text-[9px] font-mono tracking-widest uppercase rounded-lg opacity-0 pointer-events-none transition-all group-hover:opacity-100 group-hover:translate-x-0 translate-x-4 border-[1px] border-black/10 shadow-2xl whitespace-nowrap z-[210]">
        <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-[#F4F2EC] border-r-[1px] border-t-[1px] border-black/10 rotate-45" />
        {config.label}
      </div>
    </div>
  );
};

function App() {
  const [myCourses, setMyCourses] = useState([courseData[0]]);
  const [selectedCourseId, setSelectedCourseId] = useState(courseData[0].id);
  const [isRunning, setIsRunning] = useState(false);

  // Layout State (Instances)
  const [layout, setLayout] = useState([
    { instanceId: 'timer-initial', type: 'timer', colStart: 1, rowStart: 1, colSpan: 4, rowSpan: 4 },
    { instanceId: 'calendar-initial', type: 'calendar', colStart: 5, rowStart: 1, colSpan: 8, rowSpan: 4 },
  ]);
  const [activeId, setActiveId] = useState(null);
  const [activeDragData, setActiveDragData] = useState(null);

  // Sidebar Stealth State
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const idleTimerRef = useRef(null);

  // Theme State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [currentThemeKey, setCurrentThemeKey] = useState('classic');
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    // Apply theme colors to CSS variables
    const theme = {
      classic: { bg: '#F4F2EC', text: '#171615', border: '#171615', accent: '#0077FF', lines: 'rgba(0, 0, 0, 0.05)', sidebar: '#E8E6DF' },
      spring: { bg: '#FDF5F7', text: '#4A2B2B', border: '#4A2B2B', accent: '#FF8FAB', lines: 'rgba(255, 143, 171, 0.15)', sidebar: '#F9E6EB' },
      summer: { bg: '#F0F9FF', text: '#0C4A6E', border: '#0C4A6E', accent: '#0EA5E9', lines: 'rgba(14, 165, 233, 0.1)', sidebar: '#E0F2FE' },
      autumn: { bg: '#FFF7ED', text: '#431407', border: '#431407', accent: '#EA580C', lines: 'rgba(234, 88, 12, 0.1)', sidebar: '#FFEDD5' },
      winter: { bg: '#F8FAFC', text: '#1E293B', border: '#1E293B', accent: '#64748B', lines: 'rgba(100, 116, 139, 0.1)', sidebar: '#F1F5F9' },
      dark: { bg: '#121212', text: '#E0E0E0', border: '#E0E0E0', accent: '#BB86FC', lines: 'rgba(255, 255, 255, 0.05)', sidebar: '#1E1E1E' }
    }[currentThemeKey] || { bg: '#F4F2EC', text: '#171615', border: '#171615', accent: '#0077FF', lines: 'rgba(0, 0, 0, 0.05)', sidebar: '#E8E6DF' };

    const root = document.documentElement;
    root.style.setProperty('--color-peg-bg', theme.bg);
    root.style.setProperty('--color-peg-text', theme.text);
    root.style.setProperty('--color-peg-border', theme.border);
    root.style.setProperty('--color-peg-accent-blue', theme.accent);
    root.style.setProperty('--color-peg-lines', theme.lines);
    root.style.setProperty('--color-peg-sidebar', theme.sidebar);
  }, [currentThemeKey]);

  const startAutoHideTimer = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (isSidebarVisible) {
      idleTimerRef.current = setTimeout(() => {
        setIsSidebarVisible(false);
      }, 7000);
    }
  }, [isSidebarVisible]);

  useEffect(() => {
    startAutoHideTimer();
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [isSidebarVisible, startAutoHideTimer]);

  const toggleSidebarManual = () => {
    setIsSidebarVisible(prev => !prev);
    if (!isSidebarVisible === false) setActiveCategory(null); // Reset to root when closing
  };


  const currentCourse = myCourses.find(c => c.id === selectedCourseId) || myCourses[0] || { id: 'none', title: '과목 없음', professor: '-' };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } })
  );

  // Helper: Check if two rectangles intersect
  const rectsIntersect = (a, b) => {
    return (
      a.colStart < b.colStart + b.colSpan &&
      a.colStart + a.colSpan > b.colStart &&
      a.rowStart < b.rowStart + b.rowSpan &&
      a.rowStart + a.rowSpan > b.rowStart
    );
  };

  // Helper: Recursively resolve collisions by pushing items down
  const resolveCollisions = (currentLayout, activeInstanceId) => {
    const activeItem = currentLayout.find(i => i.instanceId === activeInstanceId);
    if (!activeItem) return currentLayout;

    let newLayout = currentLayout.map(item => ({ ...item }));
    let hasCollisions = true;
    let iterations = 0;
    const MAX_ITERATIONS = 50;

    while (hasCollisions && iterations < MAX_ITERATIONS) {
      hasCollisions = false;
      iterations++;

      for (let i = 0; i < newLayout.length; i++) {
        const itemA = newLayout[i];

        for (let j = 0; j < newLayout.length; j++) {
          if (i === j) continue;
          const itemB = newLayout[j];

          if (rectsIntersect(itemA, itemB)) {
            const itemToPush = (itemA.instanceId === activeInstanceId) ? itemB :
              (itemB.instanceId === activeInstanceId) ? itemA :
                (itemA.rowStart <= itemB.rowStart) ? itemB : itemA;
            const pusher = (itemToPush === itemB) ? itemA : itemB;

            itemToPush.rowStart = pusher.rowStart + pusher.rowSpan;
            hasCollisions = true;
          }
        }
      }
    }
    return newLayout;
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
    setActiveDragData(event.active.data.current);
  };

  const handleDragEnd = (event) => {
    const { active, delta } = event;

    if (!active) return;

    const data = active.data.current;
    const gridContainer = document.querySelector('.pegboard-grid');
    if (!gridContainer) return;

    const colWidth = (gridContainer.offsetWidth - (GRID_COLS - 1) * GRID_GAP) / GRID_COLS;
    const rowHeight = 140;

    if (data?.type === 'spawner') {
      // For NEW widgets from library, use absolute drop position
      const rect = gridContainer.getBoundingClientRect();
      const dropX = (active.rect.current.translated?.left || 0) - rect.left;
      const dropY = (active.rect.current.translated?.top || 0) - rect.top;

      const targetCol = Math.max(1, Math.min(GRID_COLS, Math.round(dropX / (colWidth + GRID_GAP)) + 1));
      const targetRow = Math.max(1, Math.round(dropY / (rowHeight + GRID_GAP)) + 1);

      const template = WIDGET_LIBRARY[data.widgetType];
      const newInstanceId = `${data.widgetType}-${Date.now()}`;

      const newColStart = Math.max(1, Math.min(GRID_COLS - template.colSpan + 1, targetCol));
      const newRowStart = targetRow;

      setLayout(prev => {
        const newLayout = [...prev, {
          instanceId: newInstanceId,
          type: data.widgetType,
          colStart: newColStart,
          rowStart: newRowStart,
          colSpan: template.colSpan,
          rowSpan: template.rowSpan
        }];
        return resolveCollisions(newLayout, newInstanceId);
      });
    } else {
      // For EXISTING widgets, use relative delta for robust movement
      const colDelta = Math.round(delta.x / (colWidth + GRID_GAP));
      const rowDelta = Math.round(delta.y / (rowHeight + GRID_GAP));

      setLayout((items) => {
        const updatedItems = items.map((item) => {
          if (item.instanceId === active.id) {
            const newColStart = Math.max(1, Math.min(GRID_COLS - item.colSpan + 1, item.colStart + colDelta));
            const newRowStart = Math.max(1, item.rowStart + rowDelta);
            return { ...item, colStart: newColStart, rowStart: newRowStart };
          }
          return item;
        });
        return resolveCollisions(updatedItems, active.id);
      });
    }

    setActiveId(null);
    setActiveDragData(null);
  };

  const handleResize = (instanceId, newColSpan, newRowSpan) => {
    setLayout((prev) => {
      const updated = prev.map((item) =>
        item.instanceId === instanceId
          ? {
            ...item,
            colSpan: Math.max(1, Math.min(GRID_COLS - item.colStart + 1, newColSpan)),
            rowSpan: Math.max(1, newRowSpan),
          }
          : item
      );
      return resolveCollisions(updated, instanceId);
    });
  };

  const removeWidget = (instanceId) => {
    setLayout(prev => prev.filter(item => item.instanceId !== instanceId));
  };

  const renderWidget = (item, dragHandleProps = {}) => {
    const template = WIDGET_LIBRARY[item.type];
    const Component = template.component;
    const commonProps = { dragHandleProps, onRemove: () => removeWidget(item.instanceId) };

    switch (item.type) {
      case 'timer':
        return <Component {...commonProps} selectedCourse={currentCourse} setSelectedCourse={(course) => setSelectedCourseId(course.id)} myCourses={myCourses} isRunning={isRunning} setIsRunning={setIsRunning} />;
      case 'courses':
        return <Component {...commonProps} myCourses={myCourses} setMyCourses={setMyCourses} />;
      case 'equipment':
        return <Component {...commonProps} selectedCourse={currentCourse} setSelectedCourse={(course) => setSelectedCourseId(course.id)} myCourses={myCourses} />;
      case 'audio':
        return <Component {...commonProps} selectedCourse={currentCourse} isRunning={isRunning} />;
      case 'party':
        return <Component {...commonProps} />;
      case 'cafeteria':
        return <Component {...commonProps} />;
      case 'todo':
        return <Component {...commonProps} />;
      case 'ranking':
        return <Component {...commonProps} />;
      default:
        return <Component {...commonProps} />;
    }
  };

  const activeInstance = layout.find(item => item.instanceId === activeId);

  return (
    <div className="relative min-h-screen bg-peg-bg flex overflow-x-hidden select-none">
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {/* Hardware Spawner Sidebar */}
        <aside
          className={`fixed right-0 top-1/2 -translate-y-1/2 z-[200] flex flex-col items-center py-6 px-3 bg-peg-sidebar border-l-[2px] border-y-[2px] border-black/10 rounded-l-3xl shadow-[-8px_0_30px_rgba(0,0,0,0.1),inset_1px_1px_0_rgba(255,255,255,0.8)] gap-4 transition-all duration-700 ease-[cubic-bezier(0.2,0,0,1)]
            ${isSidebarVisible ? 'translate-x-0' : 'translate-x-[calc(100%-8px)]'}
          `}
        >
          <div
            onClick={toggleSidebarManual}
            className="absolute -left-6 top-1/2 -translate-y-1/2 w-6 h-24 bg-peg-sidebar rounded-l-xl border-l-[2px] border-y-[2px] border-black/10 flex flex-col items-center justify-center cursor-pointer shadow-[-4px_0_15px_rgba(0,0,0,0.05),inset_1px_1px_0_rgba(255,255,255,0.8)] group active:scale-95 transition-all"
          >
            {isSidebarVisible ? (
              <ChevronRight size={16} className="text-black/40 group-hover:text-black/80 transition-colors" />
            ) : (
              <>
                <ChevronLeft size={16} className="text-peg-accent-blue animate-bounce-horizontal" />
                <div className="w-1.5 h-1.5 rounded-full bg-peg-accent-blue shadow-[0_0_8px_rgba(0,71,255,0.6)] mt-2 animate-pulse" />
              </>
            )}
          </div>

          <div className="flex flex-col items-center gap-1 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-peg-knob flex items-center justify-center border-[1px] border-black/5 shadow-inner">
              <Zap size={18} className="text-peg-accent-blue" />
            </div>
            <span className="text-[7px] font-mono text-black/40 uppercase tracking-[0.2em] font-bold">Mod_Rack</span>
          </div>

          <div className="w-full h-[1px] bg-black/5 shadow-[0_1px_0_rgba(255,255,255,0.8)] mb-2" />

          <div className="flex flex-col gap-3">
            {!activeCategory ? (
              // Root View: Groups
              SIDEBAR_GROUPS.map(group => (
                <button
                  key={group.id}
                  onClick={() => setActiveCategory(group.id)}
                  className="w-11 h-11 rounded-2xl bg-peg-knob/40 border-[1px] border-transparent text-black/30 hover:text-black/60 hover:bg-peg-knob/60 transition-all flex items-center justify-center relative group"
                >
                  <group.icon size={18} />
                  {/* Tooltip Label */}
                  <div className="absolute right-[calc(100%+25px)] px-3 py-1.5 bg-[#F4F2EC] text-black text-[9px] font-mono tracking-widest uppercase rounded-lg opacity-0 pointer-events-none transition-all group-hover:opacity-100 group-hover:translate-x-0 translate-x-4 border-[1px] border-black/10 shadow-2xl whitespace-nowrap z-[210]">
                    <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-[#F4F2EC] border-r-[1px] border-t-[1px] border-black/10 rotate-45" />
                    {group.label}
                  </div>
                </button>
              ))
            ) : (
              // Inner View: Widgets + Back Button
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setActiveCategory(null)}
                  className="w-11 h-11 rounded-2xl bg-black/5 border-[1px] border-dashed border-black/10 text-black/40 hover:text-black/80 hover:bg-black/10 transition-all flex items-center justify-center mb-2"
                >
                  <ChevronLeft size={16} />
                </button>
                {SIDEBAR_GROUPS.find(g => g.id === activeCategory).widgets.map(type => (
                  <LibraryItem
                    key={type}
                    type={type}
                    config={WIDGET_LIBRARY[type]}
                    isSidebarVisible={isSidebarVisible}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="w-full h-[1px] bg-black/5 shadow-[0_1px_0_rgba(255,255,255,0.8)] mt-auto" />

          <button
            onClick={() => setIsSettingsOpen(true)}
            className="w-11 h-11 rounded-2xl bg-[#DAD7CD]/40 border-transparent text-black/30 hover:text-black/60 hover:bg-[#DAD7CD]/60 transition-all flex items-center justify-center"
          >
            <Settings size={18} />
          </button>
        </aside>

        {/* Main Content Area */}
        <main className="flex-grow p-8 lg:p-12 overflow-auto custom-scrollbar">
          <div className="pegboard-grid grid grid-cols-12 gap-6 auto-rows-[140px] relative min-h-[1400px]">
            {layout.map((item) => (
              <SortableWidget
                key={item.instanceId}
                id={item.instanceId}
                colSpan={item.colSpan}
                rowSpan={item.rowSpan}
                onResize={(colSpan, rowSpan) => handleResize(item.instanceId, colSpan, rowSpan)}
                onRemove={() => removeWidget(item.instanceId)}
                style={{
                  gridColumnStart: item.colStart,
                  gridColumnEnd: `span ${item.colSpan}`,
                  gridRowStart: item.rowStart,
                  gridRowEnd: `span ${item.rowSpan}`
                }}
              >
                {renderWidget(item)}
              </SortableWidget>
            ))}

            <DragOverlay dropAnimation={null}>
              {activeId ? (
                <div className="transform scale-[1.02] drop-shadow-[20px_20px_40px_rgba(0,0,0,0.3)] bg-white/80 rounded-2xl overflow-hidden border-[1px] border-black/20 backdrop-blur-sm pointer-events-none">
                  {activeDragData?.type === 'spawner' ? (
                    <div className="p-8 flex flex-col items-center gap-4">
                      <Zap size={32} className="text-peg-accent-blue animate-pulse" />
                      <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-peg-accent-blue italic">
                        Spawning_{WIDGET_LIBRARY[activeDragData.widgetType].label}...
                      </span>
                    </div>
                  ) : (
                    activeInstance ? renderWidget(activeInstance) : null
                  )}
                </div>
              ) : null}
            </DragOverlay>
          </div>
        </main>
      </DndContext>

      {/* Settings & Theme Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentTheme={currentThemeKey}
        onThemeSelect={setCurrentThemeKey}
      />
    </div>
  );
}

export default App;
