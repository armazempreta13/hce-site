import React, { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CloseIcon, ChatBubbleOvalLeftEllipsisIcon, PaperPlaneIcon, RefreshIcon, PaperClipIcon, ArrowLeftIcon } from './icons';
import { getIconComponent } from './ui/IconMap';

// ==================== TYPES ====================
type NodeId = string;
interface Option { text: string; nextNode: NodeId; icon?: string }
interface Node {
    type: 'questionWithOptions' | 'questionWithInput' | 'message' | 'messageWithLink' | 'internalRedirect' | 'externalRedirect';
    botMessages: string[];
    options?: Option[];
    requestsFileUpload?: boolean;
    nextStateKey?: string;
    nextNode?: NodeId;
    link?: string;
    linkText?: string;
    external?: boolean;
    icon?: string;
}
interface Msg {
    id: number;
    sender: 'bot' | 'user';
    text?: string;
    options?: Option[];
    link?: { text: string; url: string; external?: boolean; icon?: string };
    ts: string;
}
interface State {
    msgs: Msg[];
    nodeId: NodeId;
    data: Record<string, string>;
    hist: NodeId[];
    ctx: Record<string, any>;
}

// ==================== CONFIG ====================
const C = {
    KEY: 'hceChatState',
    MAX: 100,
    DELAY: 600,
    TYPE: 300,
    SIZE: 10485760,
    TYPES: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
};

// ==================== UTILS ====================
const U = {
    ts: () => new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    
    store: {
        save: (s: State) => {
            try {
                localStorage.setItem(C.KEY, JSON.stringify({ ...s, msgs: s.msgs.slice(-C.MAX) }));
            } catch { localStorage.removeItem(C.KEY); }
        },
        load: (): State | null => {
            try {
                const d = localStorage.getItem(C.KEY);
                return d ? { ...JSON.parse(d), hist: JSON.parse(d).hist || [], ctx: JSON.parse(d).ctx || {} } : null;
            } catch { 
                localStorage.removeItem(C.KEY);
                return null;
            }
        },
        clear: () => localStorage.removeItem(C.KEY)
    },
    
    file: (f: File) => f.size > C.SIZE ? 'Arquivo > 10MB' : !C.TYPES.includes(f.type) ? 'Tipo inválido' : null,
    
    interp: (t: string, d: Record<string, string>) => t.replace(/\{(\w+)\}/g, (_, k) => d[k] || ''),
    
    wa: (n: string, i: string) => `https://wa.me/5561993619554?text=${encodeURIComponent(`Olá! Meu nome é ${n} e gostaria de falar sobre: ${i}`)}`,
    
    db: <T extends (...a: any[]) => any>(f: T, ms: number) => {
        let t: number;
        return (...a: Parameters<T>) => {
            clearTimeout(t);
            t = window.setTimeout(() => f(...a), ms);
        };
    }
};

// ==================== TYPING INDICATOR ====================
const Typing = memo(() => (
    <div className="flex items-center space-x-1 p-3.5 animate-chat-fade-in-up">
        {[0, 0.2, 0.4].map((d, i) => (
            <div key={i} className="w-2 h-2 bg-slate-400 rounded-full animate-typing-dot" style={{ animationDelay: `${d}s` }} />
        ))}
    </div>
));

// ==================== MESSAGE ITEM ====================
const MsgItem = memo(({ m, onOpt }: { m: Msg; onOpt: (o: Option) => void }) => (
    <div className={`flex flex-col animate-chat-fade-in-up ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
        {m.sender === 'bot' ? (
            <>
                {m.text && (
                    <div className="bg-white p-3.5 rounded-2xl rounded-bl-md shadow-sm border border-slate-200 max-w-[80vw] sm:max-w-xs">
                        <p className="text-body text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: m.text.replace(/\n/g, '<br />') }} />
                    </div>
                )}
                {m.options && (
                    <div className="grid gap-2.5 pt-3 w-full">
                        {m.options.map((o, i) => {
                            const Icon = getIconComponent(o.icon);
                            return (
                                <button 
                                    key={i}
                                    onClick={() => onOpt(o)}
                                    className="group flex items-center w-full text-left bg-white border border-slate-200/80 text-primary hover:bg-slate-50 hover:border-slate-300 font-medium text-sm px-4 py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                                >
                                    {Icon && <Icon className="w-5 h-5 mr-3 text-primary/70" />}
                                    {o.text}
                                </button>
                            );
                        })}
                    </div>
                )}
                {m.link && (
                    <div className="pt-3 w-full">
                        <a 
                            href={m.link.url}
                            target={m.link.external ? '_blank' : '_self'}
                            rel="noopener noreferrer"
                            className="group flex items-center justify-center w-full bg-white border border-slate-200/80 text-primary hover:bg-slate-50 hover:border-slate-300 font-medium text-sm px-4 py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                        >
                            {(() => {
                                const Icon = getIconComponent(m.link.icon);
                                return Icon ? <Icon className="w-5 h-5 mr-3 text-primary/70" /> : null;
                            })()}
                            {m.link.text}
                        </a>
                    </div>
                )}
            </>
        ) : (
            <div className="bg-primary text-white p-3.5 rounded-2xl rounded-br-md shadow-sm max-w-[80vw] sm:max-w-xs">
                <p className="text-sm leading-relaxed">{m.text}</p>
            </div>
        )}
        <p className="text-xs mt-1.5 px-2 text-slate-400">{m.ts}</p>
    </div>
), (p, n) => p.m.id === n.m.id);

// ==================== MAIN ====================
const Chatbot: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [typing, setTyping] = useState(false);
    const [inp, setInp] = useState('');
    const [tree, setTree] = useState<Record<NodeId, Node> | null>(null);
    const [st, setSt] = useState<State>({
        msgs: [],
        nodeId: 'start',
        data: {},
        hist: [],
        ctx: {}
    });
    
    const endRef = useRef<HTMLDivElement>(null);
    const fileRef = useRef<HTMLInputElement>(null);
    const timerRef = useRef<number[]>([]);
    const nav = useNavigate();

    // ==================== CLEANUP ====================
    const clear = useCallback(() => {
        timerRef.current.forEach(clearTimeout);
        timerRef.current = [];
    }, []);

    useEffect(() => () => clear(), [clear]);

    // ==================== LOAD TREE ====================
    useEffect(() => {
        let ok = true;
        const ctrl = new AbortController();
        
        (async () => {
            try {
                const r = await fetch('/chatbot-data.json', { signal: ctrl.signal });
                if (!r.ok) throw new Error('Load fail');
                const d = await r.json();
                if (ok) setTree(d);
            } catch (e) {
                if (e instanceof Error && e.name !== 'AbortError') console.error('Tree err:', e);
            }
        })();
        
        return () => {
            ok = false;
            ctrl.abort();
        };
    }, []);

    // ==================== PERSISTENCE ====================
    useEffect(() => {
        const saved = U.store.load();
        if (saved) setSt(saved);
    }, []);

    useEffect(() => {
        if (st.msgs.length > 0) {
            const save = U.db(() => U.store.save(st), 500);
            save();
        }
    }, [st]);

    // ==================== AUTO SCROLL ====================
    useEffect(() => {
        requestAnimationFrame(() => {
            endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
        });
    }, [st.msgs.length, typing]);

    // ==================== ADD MESSAGE ====================
    const addM = useCallback((m: Omit<Msg, 'id' | 'ts'>) => {
        setSt(p => ({
            ...p,
            msgs: [...p.msgs, { ...m, id: Date.now() + Math.random(), ts: U.ts() }]
        }));
    }, []);

    // ==================== PROCESS NODE ====================
    const proc = useCallback((nid: NodeId, dat: Record<string, string>) => {
        if (!tree) return;
        
        const n = tree[nid];
        if (!n) {
            console.error(`Node ${nid} not found`);
            return;
        }

        clear();
        setTyping(true);

        const show = (i = 0) => {
            if (i >= n.botMessages.length) {
                const t = window.setTimeout(() => {
                    setTyping(false);
                    
                    if (n.type === 'questionWithInput') {
                        return;
                    }
                    
                    if (n.type === 'internalRedirect' && n.link && n.nextNode) {
                        setTimeout(() => nav(n.link!), 800);
                        setSt(p => ({ ...p, nodeId: n.nextNode! }));
                        proc(n.nextNode, dat);
                    } else if (n.type === 'messageWithLink' && n.nextNode) {
                        addM({ 
                            sender: 'bot', 
                            link: { 
                                text: n.linkText!, 
                                url: U.wa(dat.userName || '', dat.projectInfo || ''),
                                external: n.external, 
                                icon: n.icon 
                            }
                        });
                        setSt(p => ({ ...p, nodeId: n.nextNode! }));
                        proc(n.nextNode, dat);
                    } else if (n.options?.length) {
                        addM({ sender: 'bot', options: n.options });
                    } else if (n.nextNode) {
                        setSt(p => ({ ...p, nodeId: n.nextNode! }));
                        proc(n.nextNode, dat);
                    }
                }, C.TYPE);
                timerRef.current.push(t);
                return;
            }
            
            const t = window.setTimeout(() => {
                addM({ sender: 'bot', text: U.interp(n.botMessages[i], dat) });
                show(i + 1);
            }, C.DELAY);
            timerRef.current.push(t);
        };

        const t = window.setTimeout(() => show(), C.TYPE);
        timerRef.current.push(t);
    }, [tree, addM, clear, nav]);

    // ==================== HANDLE OPTION ====================
    const handleOpt = useCallback((o: Option) => {
        setSt(p => ({
            ...p,
            msgs: p.msgs.map(m => ({ ...m, options: undefined })),
            hist: [...p.hist, p.nodeId],
            nodeId: o.nextNode
        }));
        addM({ sender: 'user', text: o.text });
        proc(o.nextNode, st.data);
    }, [addM, proc, st.data]);

    // ==================== HANDLE SUBMIT ====================
    const handleSub = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        const v = inp.trim();
        if (!v || !tree) return;

        const n = tree[st.nodeId];
        if (!n?.nextNode || !n?.nextStateKey) return;

        addM({ sender: 'user', text: v });
        
        setSt(p => {
            const newD = { ...p.data, [n.nextStateKey!]: v };
            const newCtx = { ...p.ctx };
            
            if (n.nextStateKey === 'userName') newCtx.userName = v;
            if (n.nextStateKey === 'projectInfo') newCtx.projectType = v;
            
            proc(n.nextNode!, newD);
            
            return { 
                ...p, 
                nodeId: n.nextNode!, 
                data: newD, 
                hist: [...p.hist, p.nodeId],
                ctx: newCtx
            };
        });

        setInp('');
    }, [inp, tree, st.nodeId, addM, proc]);

    // ==================== HANDLE FILE ====================
    const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f || !tree) return;

        const err = U.file(f);
        if (err) {
            alert(err);
            e.target.value = '';
            return;
        }

        const n = tree[st.nodeId];
        if (!n?.nextNode) return;

        addM({ sender: 'user', text: `📎 ${f.name}` });

        setSt(p => {
            const newD = { ...p.data, file: f.name };
            proc(n.nextNode!, newD);
            return { 
                ...p, 
                nodeId: n.nextNode!, 
                data: newD, 
                hist: [...p.hist, p.nodeId] 
            };
        });
        
        e.target.value = '';
    }, [tree, st.nodeId, addM, proc]);

    // ==================== BACK ====================
    const back = useCallback(() => {
        if (st.hist.length === 0) return;
        
        const prevId = st.hist[st.hist.length - 1];
        setSt(p => ({
            ...p,
            nodeId: prevId,
            hist: p.hist.slice(0, -1),
            msgs: p.msgs.slice(0, -2) // Remove última pergunta e resposta
        }));
        
        if (tree && tree[prevId]) {
            proc(prevId, st.data);
        }
    }, [st.hist, st.data, tree, proc]);

    // ==================== RESET ====================
    const reset = useCallback(() => {
        clear();
        setTyping(false);
        setInp('');
        U.store.clear();
        setSt({ msgs: [], nodeId: 'start', data: {}, hist: [], ctx: {} });
        proc('start', {});
    }, [clear, proc]);

    // ==================== TOGGLE ====================
    const toggle = useCallback(() => {
        if (!open) {
            const saved = U.store.load();
            if (saved) {
                setSt(saved);
                if (saved.msgs.length === 0) proc('start', saved.data);
            } else if (st.msgs.length === 0) {
                proc('start', {});
            }
        }
        setOpen(!open);
    }, [open, st.msgs.length, proc]);

    // ==================== KEYBOARD ====================
    useEffect(() => {
        if (!open) return;
        
        const handle = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false);
        };
        
        window.addEventListener('keydown', handle);
        return () => window.removeEventListener('keydown', handle);
    }, [open]);

    // ==================== COMPUTED ====================
    const node = useMemo(() => tree?.[st.nodeId] ?? null, [tree, st.nodeId]);
    const showInp = !typing && node?.type === 'questionWithInput';
    const canBack = st.hist.length > 0;

    // ==================== RENDER ====================
    return (
        <>
            <div className="fixed bottom-6 right-6 z-[50]">
                <button
                    onClick={toggle}
                    className={`w-16 h-16 bg-gradient-to-br from-primary to-slate-800 text-white flex items-center justify-center rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-primary/40 ${!open ? 'animate-pulse-slow' : ''}`}
                    aria-label={open ? "Fechar" : "Abrir"}
                >
                    <div className="absolute">
                        <ChatBubbleOvalLeftEllipsisIcon className={`w-8 h-8 transition-all duration-300 ${open ? 'opacity-0 rotate-45 scale-50' : 'opacity-100'}`} />
                    </div>
                    <div className="absolute">
                        <CloseIcon className={`w-7 h-7 transition-all duration-300 ${open ? 'opacity-100' : 'opacity-0 -rotate-45 scale-50'}`} />
                    </div>
                </button>
            </div>

            <div
                className={`fixed bottom-28 left-3 right-3 sm:right-6 sm:left-auto w-auto max-w-sm rounded-3xl z-60 flex flex-col transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] origin-bottom-right bg-slate-50 shadow-2xl shadow-primary/20 border border-slate-200/50 ${open ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}
                style={{ height: 'clamp(360px, 70vh, 540px)' }}
            >
                <header className="bg-gradient-to-br from-primary to-slate-800 p-5 rounded-t-3xl flex items-center justify-between text-white flex-shrink-0 shadow-lg">
                    <div className="flex items-center gap-4">
                        {canBack && (
                            <button 
                                onClick={back} 
                                className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                                aria-label="Voltar"
                            >
                                <ArrowLeftIcon className="w-5 h-5" />
                            </button>
                        )}
                        <div className="relative">
                            <img src="https://i.imgur.com/spMimAM.png" alt="HCE" className="w-10 h-10 rounded-full bg-white p-1.5" />
                            <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-400 ring-2 ring-primary"></span>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Assistente HCE</h3>
                            <p className="text-xs text-white/70">Online</p>
                        </div>
                    </div>
                    <button onClick={reset} className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-colors" aria-label="Reiniciar">
                        <RefreshIcon className="w-5 h-5" />
                    </button>
                </header>

                <div className="flex-1 p-5 space-y-2 overflow-y-auto pb-24">
                    {st.msgs.map(m => <MsgItem key={m.id} m={m} onOpt={handleOpt} />)}
                    {typing && <Typing />}
                    <div ref={endRef} />
                </div>

                <footer className="p-2 mt-auto border-t border-slate-200/80 bg-white rounded-b-3xl">
                    {showInp ? (
                        <div className="flex items-center gap-2 p-2">
                            {node?.requestsFileUpload && (
                                <>
                                    <button 
                                        type="button"
                                        onClick={() => fileRef.current?.click()}
                                        className="w-10 h-10 bg-slate-200 text-slate-600 rounded-full flex items-center justify-center flex-shrink-0 transition-colors hover:bg-slate-300"
                                        aria-label="Anexar"
                                    >
                                        <PaperClipIcon className="w-5 h-5" />
                                    </button>
                                    <input ref={fileRef} type="file" onChange={handleFile} accept={C.TYPES.join(',')} className="hidden" />
                                </>
                            )}
                            <input
                                type="text"
                                value={inp}
                                onChange={e => setInp(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSub(e as any)}
                                placeholder="Digite sua resposta..."
                                className="w-full bg-slate-100 border-transparent focus:border-primary focus:ring-primary rounded-full px-4 py-2.5 text-sm transition-all text-slate-800 placeholder:text-slate-500"
                                autoFocus
                            />
                            <button 
                                onClick={handleSub as any}
                                className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 transition-transform hover:scale-110 disabled:opacity-50"
                                disabled={!inp.trim()}
                            >
                                <PaperPlaneIcon className="w-5 h-5" />
                            </button>
                        </div>
                    ) : (
                        <div className="text-center text-xs text-slate-400 py-2">HCE Esquadrias</div>
                    )}
                </footer>
            </div>
        </>
    );
};

export default Chatbot;