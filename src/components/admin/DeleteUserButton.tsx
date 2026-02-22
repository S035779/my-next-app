'use client';

import { useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import AdminConfirmModal from './AdminConfirmModal';

type Props = {
    formId?: string;

    label?: string;
    pendingLabel?: string;

    confirmTitle?: string;
    confirmMessage?: string;
    confirmOkLabel?: string;
    confirmCancelLabel?: string;
};

export default function DeleteUserButton({
    formId,
    label = '削除',
    pendingLabel = '削除中...',
    confirmTitle = '削除の確認',
    confirmMessage = 'このユーザーを削除します。よろしいですか？',
    confirmOkLabel = '削除する',
    confirmCancelLabel = 'キャンセル',
}: Props) {
    const { pending } = useFormStatus();

    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const formRef = useRef<HTMLFormElement | null>(null);

    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (formId) {
            const el = document.getElementById(formId);
            formRef.current = el instanceof HTMLFormElement ? el : null;
            return;
        }

        const btn = triggerRef.current;
        const byFormProp = btn?.form ?? null;
        const byClosest = btn?.closest('form');
        formRef.current =
            byFormProp ??
            (byClosest instanceof HTMLFormElement ? byClosest : null);
    }, [formId]);

    const openModal = () => {
        if (pending) return;
        setOpen(true);
    };

    const close = () => {
        if (pending) return;
        setOpen(false);
        triggerRef.current?.focus();
    };

    const submitTarget = () => {
        if (pending) return;
        formRef.current?.requestSubmit();
    };

    return (
        <>
            <button
                ref={triggerRef}
                type="button"
                data-testid="user-delete"
                disabled={pending}
                aria-busy={pending}
                onClick={openModal}
                className="inline-flex items-center rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
                onConfirm={submitTarget}
                okTestId="confirm-ok"
                cancelTestId="confirm-cancel"
            />
        </>
    );
}
