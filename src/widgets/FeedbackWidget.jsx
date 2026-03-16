import React, { useState } from 'react';
import { feedbackMock } from '../data/mockData';
import { X, MessageSquare, ArrowRight, User, Clock, Upload } from 'lucide-react';

const FeedbackWidget = ({ dragHandleProps }) => {
    const [feedbacks, setFeedbacks] = useState(feedbackMock);
    const [selectedPost, setSelectedPost] = useState(null);
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [uploadForm, setUploadForm] = useState({ title: '', text: '', sameProf: true, takeCount: 0 });

    const openPost = (post) => setSelectedPost(post);
    const closePost = () => {
        setSelectedPost(null);
        setNewComment('');
    };

    const handleUploadSubmit = (e) => {
        e.preventDefault();
        if (!uploadForm.title || !uploadForm.text) return;

        const newPost = {
            id: `fb_${Date.now()}`,
            ...uploadForm,
            author: '익명_나',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            comments: []
        };

        setFeedbacks([newPost, ...feedbacks]);
        setIsUploadOpen(false);
        setUploadForm({ title: '', text: '', sameProf: true, takeCount: 0 });
    };

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        const updatedComment = {
            id: `c_${Date.now()}`,
            author: '익명_나',
            text: newComment.trim(),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        const updatedFeedbacks = feedbacks.map(fb => {
            if (fb.id === selectedPost.id) {
                const updatedFb = { ...fb, comments: [...fb.comments, updatedComment] };
                setSelectedPost(updatedFb);
                return updatedFb;
            }
            return fb;
        });

        setFeedbacks(updatedFeedbacks);
        setNewComment('');
    };

    const getTakeCountText = (count) => {
        const c = count ?? 0;
        if (c >= 2) return '수강 2회 이상';
        return `수강 ${c}회`;
    };

    return (
        <div className="w-full h-full border-[1px] border-peg-border rounded-xl bg-peg-bg shadow-[0_2px_4px_rgba(0,0,0,0.05)] flex flex-col transition-all overflow-hidden z-20 hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] relative">
            {/* Header */}
            <div
                {...dragHandleProps}
                className="h-10 border-b-[1px] border-peg-border px-4 bg-gradient-to-b from-[#FAFAFA] to-peg-bg shrink-0 flex items-center justify-between cursor-move"
            >
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-peg-text pointer-events-none">
                    [모듈 05] 상호 피드백 보드 (Terminal)
                </span>

                <button
                    onClick={() => setIsUploadOpen(true)}
                    className="flex items-center gap-1.5 bg-peg-text text-white px-3 py-1.5 rounded text-[10px] font-mono font-bold hover:bg-peg-accent-blue transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.1)] active:scale-[0.95]"
                >
                    <Upload size={10} />
                    <span>내 작업물 업로드</span>
                </button>
            </div>

            {/* List View */}
            <div className="p-4 flex-grow flex overflow-x-auto gap-4 snap-x snap-mandatory bg-peg-bg scrollbar-hide">
                {feedbacks.map((fb) => (
                    <div
                        key={fb.id}
                        onClick={() => openPost(fb)}
                        className="snap-start shrink-0 w-[240px] bg-white border-[1px] border-peg-border rounded-lg p-3 flex flex-col shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:border-peg-text transition-all cursor-pointer group"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-[9px] font-mono font-bold text-peg-text bg-[#F0F0F0] px-1.5 py-0.5 rounded uppercase tracking-tighter">
                                {fb.sameProf ? 'PROF: SAME' : 'PROF: DIFF'}
                            </span>
                            <div className="flex items-center gap-1 text-peg-text/40 group-hover:text-peg-accent-blue transition-colors">
                                <MessageSquare size={10} />
                                <span className="text-[10px] font-mono font-bold">{fb.comments.length.toString().padStart(2, '0')}</span>
                            </div>
                        </div>

                        <h3 className="text-[12px] font-bold text-peg-text mb-1 truncate">{fb.title}</h3>
                        <p className="text-[11px] text-peg-text/60 leading-relaxed line-clamp-2 mb-3 h-[32px]">
                            {fb.text}
                        </p>

                        <div className="mt-auto pt-2 border-t-[1px] border-dashed border-peg-border/50 flex justify-between items-center bg-[#FAFAFA]/50 -mx-3 -mb-3 px-3 py-2 rounded-b-lg">
                            <span className="text-[9px] font-mono text-peg-text/50">{fb.author}</span>
                            <span className="text-[9px] font-mono text-peg-text/40">{fb.timestamp}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Post Detail Modal */}
            {selectedPost && (
                <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-30 flex flex-col slide-up animate-in fade-in zoom-in-95 duration-200">
                    <div className="h-10 border-b-[1px] border-peg-border px-4 flex items-center justify-between bg-white shrink-0">
                        <span className="text-[10px] font-mono font-bold text-peg-text uppercase tracking-widest flex items-center gap-2">
                            <MessageSquare size={12} className="text-peg-accent-blue" />
                            Feed Trace: {selectedPost.id}
                        </span>
                        <button onClick={closePost} className="text-peg-text hover:text-peg-accent-red transition-colors p-1">
                            <X size={16} />
                        </button>
                    </div>

                    <div className="flex-grow overflow-y-auto p-4 custom-scrollbar">
                        <div className="mb-6 border-b-[1px] border-peg-border pb-4">
                            <div className="flex gap-2 mb-3">
                                <span className="text-[9px] font-mono font-bold text-white bg-peg-text px-1.5 py-0.5 rounded">
                                    {selectedPost.sameProf ? 'PROF: SAME' : 'PROF: DIFF'}
                                </span>
                                <span className="text-[9px] font-mono font-bold text-peg-text bg-[#F0F0F0] px-1.5 py-0.5 rounded">
                                    {getTakeCountText(selectedPost.takeCount)}
                                </span>
                            </div>
                            <h2 className="text-[16px] font-bold text-peg-text mb-2 leading-tight">{selectedPost.title}</h2>
                            <p className="text-[13px] text-peg-text/80 leading-relaxed bg-[#FAFAFA] p-3 rounded-lg border-[1px] border-dashed border-peg-border/50">
                                {selectedPost.text}
                            </p>
                        </div>

                        {/* Comments List */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="h-[1px] flex-grow bg-peg-border"></span>
                                <span className="text-[9px] font-mono font-bold text-peg-text/40 uppercase tracking-widest">Responses ({selectedPost.comments.length})</span>
                                <span className="h-[1px] flex-grow bg-peg-border"></span>
                            </div>

                            {selectedPost.comments.length === 0 ? (
                                <div className="py-6 text-center">
                                    <span className="text-[10px] font-mono text-peg-text/30 italic">No traces found in this stream...</span>
                                </div>
                            ) : (
                                selectedPost.comments.map(c => (
                                    <div key={c.id} className="bg-white border-[1px] border-peg-border p-3 rounded shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                                        <div className="flex justify-between items-center mb-1.5 text-[9px] font-mono">
                                            <span className="text-peg-accent-blue font-bold tracking-tighter">{c.author}</span>
                                            <span className="text-peg-text/40">{c.timestamp}</span>
                                        </div>
                                        <p className="text-[11.5px] text-peg-text/80 leading-snug">{c.text}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Comment Form */}
                    <form onSubmit={handleCommentSubmit} className="p-3 border-t-[1px] border-peg-border bg-white flex shrink-0 shadow-[0_-2px_10px_rgba(0,0,0,0.03)] focus-within:border-peg-accent-blue transition-colors">
                        <span className="text-peg-accent-blue font-mono text-[12px] mr-2 flex items-center font-bold animate-pulse">{'>'}</span>
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="명령어 입력 또는 댓글 작성..."
                            className="flex-grow bg-transparent border-none outline-none font-mono text-[11px] text-peg-text placeholder:text-peg-text/30 flex items-center"
                        />
                        <button type="submit" className="p-1 px-2 text-peg-text/40 hover:text-peg-accent-blue transition-colors group">
                            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </form>
                </div>
            )}

            {/* Upload Modal */}
            {isUploadOpen && (
                <div className="absolute inset-0 bg-white/98 z-40 flex flex-col slide-up animate-in duration-300">
                    <div className="h-10 border-b-[1px] border-peg-border px-4 flex items-center justify-between bg-[#FAFAFA] shrink-0">
                        <span className="text-[10px] font-mono font-bold text-peg-text uppercase tracking-widest flex items-center gap-2">
                            <Upload size={12} className="text-peg-accent-blue" />
                            NEW_POST_STREAM
                        </span>
                        <button onClick={() => setIsUploadOpen(false)} className="text-peg-text hover:text-peg-accent-red transition-colors p-1">
                            <X size={16} />
                        </button>
                    </div>

                    <form onSubmit={handleUploadSubmit} className="flex-grow flex flex-col p-6 overflow-y-auto">
                        <div className="space-y-5">
                            <div>
                                <label className="block text-[10px] font-mono font-bold text-peg-text/50 uppercase tracking-widest mb-1.5 ml-1">Title</label>
                                <input
                                    type="text"
                                    required
                                    value={uploadForm.title}
                                    onChange={e => setUploadForm({ ...uploadForm, title: e.target.value })}
                                    placeholder="작업물 제목 또는 피드백 요청 주제..."
                                    className="w-full bg-white border-[1px] border-peg-border rounded p-3 text-[12px] font-medium outline-none focus:border-peg-accent-blue bg-[#FAFAFA]/30 focus:bg-white transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.01)]"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-mono font-bold text-peg-text/50 uppercase tracking-widest mb-1.5 ml-1">Context</label>
                                    <select
                                        className="w-full bg-white border-[1px] border-peg-border rounded p-2.5 text-[11px] outline-none cursor-pointer hover:border-peg-text transition-colors"
                                        value={uploadForm.sameProf ? "true" : "false"}
                                        onChange={e => setUploadForm({ ...uploadForm, sameProf: e.target.value === "true" })}
                                    >
                                        <option value="true">동일 교수님 (SAME PROF)</option>
                                        <option value="false">타 교수님 (DIFF PROF)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-mono font-bold text-peg-text/50 uppercase tracking-widest mb-1.5 ml-1">Experience</label>
                                    <select
                                        className="w-full bg-white border-[1px] border-peg-border rounded p-2.5 text-[11px] outline-none cursor-pointer hover:border-peg-text transition-colors"
                                        value={uploadForm.takeCount}
                                        onChange={e => setUploadForm({ ...uploadForm, takeCount: parseInt(e.target.value) })}
                                    >
                                        <option value={0}>수강 경험 0회</option>
                                        <option value={1}>수강 경험 1회</option>
                                        <option value={2}>수강 경험 2회 이상</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex-grow min-h-[120px] flex flex-col">
                                <label className="block text-[10px] font-mono font-bold text-peg-text/50 uppercase tracking-widest mb-1.5 ml-1">Content</label>
                                <textarea
                                    required
                                    value={uploadForm.text}
                                    onChange={e => setUploadForm({ ...uploadForm, text: e.target.value })}
                                    placeholder="구체적으로 어떤 피드백을 원하시나요? (예: 그리드 시스템, 레이아웃, 컬러 팔레트 등)"
                                    className="w-full flex-grow bg-[#FAFAFA]/30 focus:bg-white border-[1px] border-peg-border rounded p-3 text-[12px] leading-relaxed outline-none focus:border-peg-accent-blue transition-all resize-none shadow-[inset_0_1px_2px_rgba(0,0,0,0.01)]"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-peg-text text-white py-3 rounded-lg text-[13px] font-bold hover:bg-peg-accent-blue transition-all transform active:scale-[0.98] shadow-lg shadow-peg-text/10 flex items-center justify-center gap-2 group"
                            >
                                <span>INITIALIZE STREAM EXECUTION</span>
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default FeedbackWidget;
