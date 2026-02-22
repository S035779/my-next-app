'use client';

import { useEffect, useId, useRef } from 'react';

type Props = {
    open: boolean;
    title: string;
    message: string;
    okLabel: string;
    cancelLabel?: string;
    pending?: boolean;
    onConfirm: () => void;
    onCancel: () => void;

    okTestId?: string;
    cancelTestId?: string;
};

export default function AdminConfirmModal({
    open,
    title,
    message,
    okLabel = '実行する',
    cancelLabel = 'キャンセル',
    pending = false,
    onConfirm,
    onCancel,
    okTestId = 'confirm-ok',
    cancelTestId = 'confirm-cancel',
}: Props) {
    const baseId = useId();
    const titleId = `${baseId}-title`;
    const descId = `${baseId}-desc`;

    const cancelRef = useRef<HTMLButtonElement | null>(null);
    const okRef = useRef<HTMLButtonElement | null>(null);

    // open時はOKにフォーカス
    useEffect(() => {
        if (!open) return;
        okRef.current?.focus();
    }, [open]);

    if (!open) return null;

    const close = () => {
        if (pending) return;
        onCancel();
    };

    return open ? (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descId}
            className="fixed inset-0 z-50 flex items-center justify-center"
            onKeyDown={(e) => {
                if (e.key === 'Escape') {
                    e.preventDefault();
                    close();
                    return;
                }
                if (e.key !== 'Tab') return;

                // 最小フォーカストラップ（Cancel ↔ OK）
                const first = cancelRef.current;
                const last = okRef.current;
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
            }}
        >
            {/* overlay */}
            <div
                className="absolute inset-0 bg-black/30"
                onClick={() => {
                    if (pending) return;
                    close();
                }}
            />

            <div className="relative w-[min(92vw,420px)] rounded-2xl border border-gray-200 bg-white p-4 shadow-lg">
                <div className="space-y-1">
                    <div
                        id={titleId}
                        className="text-base font-semibold text-gray-900"
                    >
                        {title}
                    </div>
                    <p id={descId} className="text-sm text-gray-600">
                        {message}
                    </p>
                </div>

                <div className="mt-4 flex items-center justify-end gap-2">
                    <button
                        ref={cancelRef}
                        type="button"
                        data-testid={cancelTestId}
                        onClick={close}
                        disabled={pending}
                        className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                        {cancelLabel}
                    </button>

                    <button
                        ref={okRef}
                        type="button"
                        data-testid={okTestId}
                        onClick={() => {
                            if (pending) return;
                            onConfirm();
                        }}
                        disabled={pending}
                        aria-busy={pending}
                        className="inline-flex items-center rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                    >
                        {okLabel}
                    </button>
                </div>
            </div>
        </div>
    ) : null;
}
