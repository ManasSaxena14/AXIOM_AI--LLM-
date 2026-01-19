import React, { useState, useEffect } from 'react';
import { User, Copy, Check } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const Message = ({ role, content, isNew = false }) => {
    const isAssistant = role === 'assistant';
    const [displayedContent, setDisplayedContent] = useState(isAssistant && isNew ? '' : content);
    const [copiedId, setCopiedId] = useState(null);


    useEffect(() => {
        if (!isAssistant || !isNew || displayedContent.length >= content.length) return;

        const timer = setTimeout(() => {
            const nextLength = Math.min(displayedContent.length + 5, content.length);
            setDisplayedContent(content.substring(0, nextLength));
        }, 10);

        return () => clearTimeout(timer);
    }, [isAssistant, isNew, content, displayedContent]);

    const handleCopy = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };


    const renderContent = (text) => {
        if (!text) return null;

        const segments = [];
        const codeBlockRegex = /```(\w*)\n([\s\S]*?)(?:```|$)/g;
        let lastIndex = 0;
        let match;

        while ((match = codeBlockRegex.exec(text)) !== null) {

            if (match.index > lastIndex) {
                const plainText = text.substring(lastIndex, match.index);
                plainText.split('\n').forEach((line, i) => {
                    if (line.trim()) segments.push(<p key={`p-${lastIndex}-${i}`} className="mb-4 last:mb-0 leading-relaxed">{line}</p>);
                });
            }

            const language = match[1] || 'javascript';
            const code = match[2].trim();
            const blockId = `code-${match.index}`;

            segments.push(
                <div key={blockId} className="my-6 rounded-xl overflow-hidden border border-white/10 group/code relative">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#1e1e1e] border-b border-white/5">
                        <span className="text-[10px] font-bold text-axiom-text-tertiary uppercase tracking-wider">{language}</span>
                        <button
                            onClick={() => handleCopy(code, blockId)}
                            className="flex items-center gap-1.5 text-[10px] font-bold text-axiom-text-tertiary hover:text-white transition-colors"
                        >
                            {copiedId === blockId ? <Check size={12} className="text-axiom-brand" /> : <Copy size={12} />}
                            {copiedId === blockId ? 'COPIED' : 'COPY'}
                        </button>
                    </div>
                    <SyntaxHighlighter
                        language={language}
                        style={vscDarkPlus}
                        customStyle={{
                            margin: 0,
                            padding: '1.25rem',
                            fontSize: '13px',
                            lineHeight: '1.6',
                            background: '#0d0d0d',
                            fontFamily: 'var(--font-mono)',
                        }}
                    >
                        {code}
                    </SyntaxHighlighter>
                </div>
            );

            lastIndex = match.index + match[0].length;
        }


        if (lastIndex < text.length) {
            const remainingText = text.substring(lastIndex);
            remainingText.split('\n').forEach((line, i) => {
                if (line.trim()) segments.push(<p key={`p-last-${i}`} className="mb-4 last:mb-0 leading-relaxed">{line}</p>);
            });
        }

        return segments;
    };

    return (
        <div className={`w-full group animate-fade-in`}>
            <div className={`flex gap-6 py-8 border-b border-axiom-border/5 last:border-none ${isAssistant ? '' : 'flex-row-reverse'}`}>
                {/* Professional Minimal Avatar */}
                <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center border transition-colors ${isAssistant
                    ? 'bg-axiom-surface border-axiom-border overflow-hidden'
                    : 'bg-axiom-accent/10 border-axiom-accent/20 text-axiom-accent'
                    }`}>
                    {isAssistant ? <img src="/logo-symbol.png" alt="AxiomAI" className="w-6 h-auto mix-blend-screen" /> : <User size={18} strokeWidth={2.5} />}
                </div>

                {/* Message Content (No Bubbles) */}
                <div className={`flex-1 overflow-hidden pt-1`}>
                    <div className={`text-[15px] leading-relaxed tracking-tight ${isAssistant ? 'text-axiom-text-primary' : 'text-white font-medium'
                        }`}>
                        {renderContent(displayedContent)}
                    </div>

                    {isAssistant && displayedContent === content && (
                        <div className="flex gap-4 mt-6 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="text-[10px] font-bold text-axiom-text-tertiary hover:text-white uppercase tracking-widest">
                                Copy
                            </button>
                            <button className="text-[10px] font-bold text-axiom-text-tertiary hover:text-white uppercase tracking-widest">
                                Regenerate
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Message;
