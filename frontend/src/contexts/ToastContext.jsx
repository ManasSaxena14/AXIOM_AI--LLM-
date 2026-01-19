import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = 'success', duration = 3000) => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, duration);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <ToastContainer toasts={toasts} />
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const ToastContainer = ({ toasts }) => {
    return (
        <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
            {toasts.map((toast) => (
                <ToastItem key={toast.id} {...toast} />
            ))}
        </div>
    );
};

const ToastItem = ({ message, type }) => {
    const icons = {
        success: <CheckCircle size={18} className="text-axiom-brand" />,
        error: <AlertCircle size={18} className="text-red-500" />,
        info: <Info size={18} className="text-blue-400" />
    };

    const borders = {
        success: 'border-axiom-brand/20',
        error: 'border-red-500/20',
        info: 'border-blue-400/20'
    };

    return (
        <div className={`
            min-w-[300px] max-w-md bg-axiom-surface/80 backdrop-blur-2xl border ${borders[type]} 
            rounded-2xl p-4 shadow-2xl flex items-center gap-3 animate-slide-in pointer-events-auto
        `}>
            <div className="flex-shrink-0">
                {icons[type]}
            </div>
            <p className="text-[13px] font-bold tracking-tight text-white flex-1 leading-tight">
                {message}
            </p>
        </div>
    );
};
