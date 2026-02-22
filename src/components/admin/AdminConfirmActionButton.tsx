'use client';

import { useEffect, useRef, useState } from 'react';
import AdminConfirmModal from './AdminConfirmModal';

type Variant = 'danger' | 'primary';

type Props = {
    label?: string;
    pendingLabel?: string;

    confirmTitle?: string;
    confirmMessage: string;
    confirmOkLabel?: string;
    confirmCancelLabel?: string;

    formId?: string;

    onConfirm?: () => void | Promise<void>;

    variant?: Variant;

    className?: string;
    triggerTestId?: string;

    okTestId?: string;
    cancelTestId?: string;
};

export default function AdminConfirmActionButton({
    label,
    pendingLabel = '削除中...',
    confirmTitle = '確認',
    confirmMessage,
    confirmOkLabel = '実行する',
    confirmCancelLabel = 'キャンセル',
    formId,
    onConfirm,
    variant = 'danger',
    className,
    triggerTestId,
    okTestId = 'confirm-ok',
    cancelTestId = 'confirm-cancel',
}: Props) {
    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const mountedRef = useRef(false);

    const [open, setOpen] = useState(false);
    const [pending, setPending] = useState(false);

    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
        };
    }, []);

    const openModal = () => {
        if (pending) return;
        setOpen(true);
    };

    const close = () => {
        if (pending) return;
        setOpen(false);
        triggerRef.current?.focus();
    };

    const submitNearestForm = () => {
        if (formId) {
            const el = document.getElementById(formId);
            if (el instanceof HTMLFormElement) {
                el.requestSubmit();
                return;
            }
        }
        const btn = triggerRef.current;
        const form =
            btn?.form ?? (btn?.closest('form') as HTMLFormElement | null);
        form?.requestSubmit();
    };

    const confirm = async () => {
        if (pending) return;
        setPending(true);
        try {
            if (onConfirm) {
                await onConfirm();
            } else {
                submitNearestForm();
            }

            if (mountedRef.current) {
                setOpen(false);
                triggerRef.current?.focus();
            }
        } finally {
            if (mountedRef.current) setPending(false);
        }
    };

    const baseClass =
        variant === 'danger'
            ? 'inline-flex items-center rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed'
            : 'inline-flex items-center rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed';

    return (
        <>
            <button
                ref={triggerRef}
                type="button"
                onClick={openModal}
                disabled={pending}
                aria-busy={pending}
                data-testid={triggerTestId}
                className={className ?? baseClass}
            >
                {pending ? pendingLabel : label}
            </button>

            <AdminConfirmModal
                open={open}
                title={confirmTitle}
                message={confirmMessage}
                okLabel={pending ? pendingLabel : confirmOkLabel}
                cancelLabel={confirmCancelLabel}
                pending={pending}
                onCancel={close}
                onConfirm={confirm}
                okTestId={okTestId}
                cancelTestId={cancelTestId}
            />
        </>
    );
}
