'use client';

import { useEffect, useId, useRef } from 'react';

type Props = {
    open: boolean;
    pending?: boolean;

    title: string;
    description: string;

    confirmLabel?: string;
    cancelLabel?: string;

    onConfirm: () => void;
    onCancel: () => void;

    confirmTestId?: string;
    cancelTestId?: string;
};

export default function ConfirmModal({
    open,
    pending = false,
    title,
    description,
    confirmLabel = '実行する',
    cancelLabel = 'キャンセル',
    onConfirm,
    onCancel,
    confirmTestId = 'confirm-ok',
    cancelTestId = 'confirm-cancel',
}: Props) {
    const baseId = useId();
    const titleId = `${baseId}-title`;
    const descId = `${baseId}-desc`;

    const cancelRef = useRef<HTMLButtonElement | null>(null);
    const confirmRef = useRef<HTMLButtonElement | null>(null);

    // open時フォーカス
    useEffect(() => {
        if (!open) return;
        confirmRef.current?.focus();
    }, [open]);

    if (!open) return null;

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Escape') {
            e.preventDefault();
            if (!pending) onCancel();
            return;
        }

        if (e.key !== 'Tab') return;

        const first = cancelRef.current;
        const last = confirmRef.current;
        if (!first || !last) return;

        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
            return;
        }

        if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    };

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descId}
            className="fixed inset-0 z-50 flex items-center justify-center"
            onKeyDown={handleKeyDown}
        >
            {/* overlay */}
            <div
                className="absolute inset-0 bg-black/30"
                onClick={() => {
                    if (!pending) onCancel();
                }}
            />

            <div
                className="relative w-[min(92vw,420px)] rounded-2xl border border-gray-200 bg-white p-4 shadow-lg"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="space-y-1">
                    <div
                        id={titleId}
                        className="text-base font-semibold text-gray-900"
                    >
                        {title}
                    </div>
                    <p id={descId} className="text-sm text-gray-600">
                        {description}
                    </p>
                </div>

                <div className="mt-4 flex items-center justify-end gap-2">
                    <button
                        ref={cancelRef}
                        type="button"
                        data-testid={cancelTestId}
                        disabled={pending}
                        onClick={onCancel}
                        className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                        {cancelLabel}
                    </button>

                    <button
                        ref={confirmRef}
                        type="button"
                        data-testid={confirmTestId}
                        disabled={pending}
                        aria-busy={pending}
                        onClick={onConfirm}
                        className="inline-flex items-center rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
