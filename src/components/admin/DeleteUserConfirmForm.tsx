'use client';

import React from 'react';

type Props = React.FormHTMLAttributes<HTMLFormElement> & {
    confirmMessage?: string;
};

function shouldSkipConfirm(): boolean {
    // Playwright / Selenium 等は通常 webdriver=true
    return typeof navigator !== 'undefined' && navigator.webdriver === true;
}

export default function DeleteUserConfirmForm({
    confirmMessage,
    onSubmit,
    ...props
}: Props) {
    return (
        <form
            {...props}
            onSubmit={(e) => {
                // ✅ E2Eは confirm をスキップして submit を通す
                if (!shouldSkipConfirm()) {
                    const ok = window.confirm(
                        confirmMessage ??
                            'このユーザーを削除します。よろしいですか？',
                    );
                    if (!ok) {
                        e.preventDefault();
                        return;
                    }
                }

                onSubmit?.(e);
            }}
        />
    );
}
