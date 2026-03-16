import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { todoDataMock } from '../data/mockData';

const TodoListWidget = ({ dragHandleProps }) => {
    const [todos, setTodos] = useState(todoDataMock);
    const [inputValue, setInputValue] = useState('');

    const addTodo = () => {
        if (!inputValue.trim()) return;
        const newTodo = {
            id: `todo_${Date.now()}`,
            text: inputValue,
            completed: false
        };
        setTodos([newTodo, ...todos]);
        setInputValue('');
    };

    const toggleTodo = (id) => {
        setTodos(todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
    };

    const deleteTodo = (id) => {
        setTodos(todos.filter(todo => todo.id !== id));
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            addTodo();
        }
    };

    return (
        <div className="w-full h-full border-[1px] border-[var(--color-peg-border)] rounded-xl bg-[var(--color-peg-bg)] shadow-[0_2px_4px_rgba(0,0,0,0.05)] flex flex-col transition-all relative z-10 hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] overflow-hidden">
            {/* Header */}
            <div
                {...dragHandleProps}
                className="h-10 border-b-[1px] border-[var(--color-peg-border)] px-4 bg-gradient-to-b from-[#FAFAFA] to-[var(--color-peg-bg)] shrink-0 flex items-center justify-between cursor-move"
            >
                <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--color-peg-text)] pointer-events-none">
                        [모듈 05] TASK_REGISTRY
                    </span>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-peg-accent-yellow shadow-[0_0_8px_rgba(255,214,10,0.6)] animate-pulse border-[1px] border-[#000000]/10"></div>
            </div>

            <div className="p-4 flex-grow flex flex-col bg-[var(--color-peg-bg)] overflow-hidden">
                {/* Input Area */}
                <div className="flex space-x-2 mb-4">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="NEW_TASK_ENTRY..."
                        className="flex-grow bg-[#E8E6E0] border-[1px] border-peg-border/30 rounded px-3 py-1.5 font-mono text-[11px] text-peg-text placeholder:text-peg-text/30 focus:outline-none focus:border-peg-accent-blue transition-colors shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]"
                    />
                    <button
                        onClick={addTodo}
                        className="w-8 h-8 bg-peg-text text-white flex items-center justify-center rounded-[2px] shadow-[0_1px_2px_rgba(0,0,0,0.2)] active:translate-y-[1px] active:shadow-none transition-all hover:bg-peg-accent-blue"
                    >
                        <Plus size={16} />
                    </button>
                </div>

                {/* Todo List */}
                <div className="flex-grow overflow-y-auto no-scrollbar space-y-2">
                    {todos.map(todo => (
                        <div
                            key={todo.id}
                            className={`group flex items-center p-2.5 border-[1px] rounded-lg transition-all ${todo.completed
                                    ? 'bg-[#F2F1ED] border-peg-border/20 opacity-60'
                                    : 'bg-white border-peg-border/40 hover:border-peg-accent-blue/50 hover:shadow-[0_2px_4px_rgba(0,0,0,0.02)]'
                                }`}
                        >
                            <button
                                onClick={() => toggleTodo(todo.id)}
                                className={`mr-3 transition-colors ${todo.completed ? 'text-peg-accent-blue' : 'text-peg-border hover:text-peg-text'}`}
                            >
                                {todo.completed ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                            </button>

                            <span className={`flex-grow text-[12px] font-medium transition-all ${todo.completed ? 'line-through text-peg-text/40' : 'text-peg-text'
                                }`}>
                                {todo.text}
                            </span>

                            <button
                                onClick={() => deleteTodo(todo.id)}
                                className="opacity-0 group-hover:opacity-100 p-1 text-peg-text/20 hover:text-red-500 transition-all ml-2"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}

                    {todos.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center opacity-20 py-10">
                            <div className="text-[10px] font-mono uppercase tracking-[0.2em] mb-1">NO_DATA_FOUND</div>
                            <div className="text-[8px] font-mono">IDLE_STATE_ACTIVE</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TodoListWidget;
