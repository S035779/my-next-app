'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import AdminConfirmModal from './AdminConfirmModal';

type Variant = 'danger' | 'warning' | 'neutral';

type Props = {
    /** ボタン表示 */
    label: string;
    pendingLabel?: string;

    /** confirm modal */
    confirmTitle: string;
    confirmDescription?: string;
    confirmBody?: React.ReactNode;
    confirmOkLabel?: string;
    confirmCancelLabel?: string;
    variant?: Variant;

    formId?: string;
    onConfirm?: () => void;

    /** E2E testid */
    triggerTestId?: string;
    confirmOkTestId?: string;
    confirmCancelTestId?: string;
};

function resolveFormById(formId?: string): HTMLFormElement | null {
    if (!formId) return null;
    const el = document.getElementById(formId);
    return el instanceof HTMLFormElement ? el : null;
}

export default function AdminDangerActionButton({
    label,
    pendingLabel,
    confirmTitle,
    confirmDescription,
    confirmBody,
    confirmOkLabel = '実行する',
    confirmCancelLabel = 'キャンセル',
    variant = 'danger',
    formId,
    onConfirm,
    triggerTestId = 'danger-action-trigger',
    confirmOkTestId = 'confirm-ok',
    confirmCancelTestId = 'confirm-cancel',
}: Props) {
    const { pending } = useFormStatus();
    const [open, setOpen] = useState(false);

    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const formRef = useRef<HTMLFormElement | null>(null);

    // フォーム解決（初期化）
    useEffect(() => {
        formRef.current = resolveFormById(formId);
        if (formRef.current) return;

        const btn = triggerRef.current;
        const f1 = btn?.form ?? null;
        if (f1) {
            formRef.current = f1;
            return;
        }
        const f2 = btn?.closest('form');
        formRef.current = f2 instanceof HTMLFormElement ? f2 : null;
    }, [formId]);

    const confirmLabel = useMemo(() => {
        if (!pendingLabel) return confirmOkLabel;
        return pending ? pendingLabel : confirmOkLabel;
    }, [pending, pendingLabel, confirmOkLabel]);

    const triggerText = pending ? (pendingLabel ?? label) : label;

    const doConfirm = () => {
        if (onConfirm) {
            onConfirm();
            return;
        }
        formRef.current?.requestSubmit();
    };

    return (
        <>
            <button
                ref={triggerRef}
                type="button"
                data-testid={triggerTestId}
                disabled={pending}
                aria-busy={pending}
                onClick={() => setOpen(true)}
                className="inline-flex items-center rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {triggerText}
            </button>

            <AdminConfirmModal
                open={open}
                pending={pending}
                variant={variant}
                title={confirmTitle}
                description={confirmDescription}
                body={confirmBody}
                confirmLabel={confirmLabel}
                cancelLabel={confirmCancelLabel}
                onConfirm={doConfirm}
                onCancel={() => {
                    if (pending) return;
                    setOpen(false);
                    triggerRef.current?.focus();
                }}
                allowCloseWhenPending={false}
                confirmTestId={confirmOkTestId}
                cancelTestId={confirmCancelTestId}
                initialFocus="confirm"
            />
        </>
    );
}
