import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { X } from 'lucide-react';
import WidgetOptionsPopup from './WidgetOptionsPopup';

const SortableWidget = ({ id, children, colSpan, rowSpan, onResize, onRemove, style: gridStyle = {} }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        isDragging,
    } = useDraggable({
        id,
        data: { type: 'widget', instanceId: id }
    });

    // Resizing State
    const [localIsResizing, setLocalIsResizing] = React.useState(false);
    const isResizing = React.useRef(false);
    const startPos = React.useRef({ x: 0, y: 0 });
    const startSize = React.useRef({ colSpan, rowSpan });

    // Options Popup State
    const [isOptionsOpen, setIsOptionsOpen] = useState(false);

    const handleResizeStart = (e) => {
        e.stopPropagation();
        e.preventDefault();
        isResizing.current = true;
        setLocalIsResizing(true);
        startPos.current = { x: e.clientX, y: e.clientY };
        startSize.current = { colSpan, rowSpan };
        e.currentTarget.setPointerCapture(e.pointerId);
    };

    const handleResizeMove = (e) => {
        if (!isResizing.current) return;

        const gridContainer = document.querySelector('.pegboard-grid');
        if (!gridContainer) return;

        const GRID_COLS = 12;
        const GRID_GAP = 24;
        const colWidth = (gridContainer.offsetWidth - (GRID_COLS - 1) * GRID_GAP) / GRID_COLS;
        const rowHeight = 140;

        const deltaX = e.clientX - startPos.current.x;
        const deltaY = e.clientY - startPos.current.y;

        const colDelta = Math.round(deltaX / (colWidth + GRID_GAP));
        const rowDelta = Math.round(deltaY / (rowHeight + GRID_GAP));

        const newColSpan = Math.max(1, startSize.current.colSpan + colDelta);
        const newRowSpan = Math.max(1, startSize.current.rowSpan + rowDelta);

        if (newColSpan !== colSpan || newRowSpan !== rowSpan) {
            onResize(newColSpan, newRowSpan);
        }
    };

    const handleResizeEnd = (e) => {
        isResizing.current = false;
        setLocalIsResizing(false);
        e.currentTarget.releasePointerCapture(e.pointerId);
    };

    // Merged style: grid positioning + dnd transformation
    const style = {
        ...gridStyle,
        transform: CSS.Translate.toString(transform),
        zIndex: isDragging ? 50 : (localIsResizing ? 40 : 'auto'),
        touchAction: localIsResizing ? 'none' : 'auto',
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`
                ${isDragging ? 'opacity-0' : 'flex'}
                transition-opacity duration-200 relative group
            `}
        >
            {/* Remove Button - Top Left Hidden by default */}
            <button
                onClick={(e) => { e.stopPropagation(); onRemove(); }}
                className="absolute -top-2 -left-2 w-5 h-5 bg-peg-accent-red text-white rounded-full z-[60] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-lg border-[2px] border-white active:scale-95 cursor-pointer"
            >
                <X size={10} strokeWidth={4} />
            </button>

            {/* Main Content with Double Click for Options */}
            {React.cloneElement(children, {
                dragHandleProps: {
                    ...attributes,
                    ...listeners,
                    onDoubleClick: () => setIsOptionsOpen(true)
                }
            })}

            {/* Widget Options Popup */}
            {isOptionsOpen && (
                <WidgetOptionsPopup
                    title={id.split('-')[0].toUpperCase()}
                    onClose={() => setIsOptionsOpen(false)}
                />
            )}

            {/* Hardware-styled Resize Handle */}
            <div
                className="absolute bottom-1 right-1 w-6 h-6 cursor-nwse-resize z-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                onPointerDown={handleResizeStart}
                onPointerMove={handleResizeMove}
                onPointerUp={handleResizeEnd}
            >
                <div className="w-3 h-3 border-r-2 border-b-2 border-peg-text/20 rounded-br-[2px] relative">
                    <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-r-2 border-b-2 border-peg-text/40 rounded-br-[1px]" />
                </div>
            </div>
        </div>
    );
};

export default SortableWidget;
