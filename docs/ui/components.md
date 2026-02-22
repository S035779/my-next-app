# Component Guidelines

## Admin Components

- AdminConfirmActionButton
  - 破壊的操作（削除・無効化・再計算など）に対して、確認モーダルを挟んで実行するボタン。

## Rules

### AdminConfirmActionButton

#### Props（要点）

- `label`: トリガーボタン表示
- `pendingLabel`: 実行中表示（disable + aria-busy）
- `confirmTitle / confirmMessage / confirmOkLabel / confirmCancelLabel`: モーダル表示
- `onConfirm`: 確認OK時の実処理（async推奨）
- `triggerTestId`: E2E用の test id

---

#### 1) POSTフォーム submit で使う（推奨：既存の server action form と相性◎）

```tsx
<DeleteUserConfirmForm action={deleteUserAction} data-testid="user-delete-form">
  <input type="hidden" name="id" value={String(user.id)} />
  <input type="hidden" name="from" value={backHref} />

  <AdminConfirmActionButton
    variant="danger"
    label="削除"
    pendingLabel="削除中..."
    confirmTitle="削除の確認"
    confirmMessage="このユーザーを削除します。削除後は元に戻せません。実行しますか？"
    confirmOkLabel="削除する"
    confirmCancelLabel="キャンセル"
    triggerTestId="user-delete"
    onConfirm={async () => {
      // form submit をしたい場合は、このコンポーネント内で requestSubmit する実装に寄せる
      // （= 現在の DeleteUserButton の方式）
    }}
  />
</DeleteUserConfirmForm>
```

※「form submit」用途は requestSubmit() が絡むため、formId 指定 or closest('form') で拾う実装に統一する。

#### 2) server action を直接叩く（formなし）+ router.refresh()

```tsx
'use client';

import { useRouter } from 'next/navigation';
import AdminConfirmActionButton from '@/src/components/admin/AdminConfirmActionButton';
import { dangerousAction } from '@/src/actions/users';

export function DangerousActionButton({ userId }: { userId: number }) {
  const router = useRouter();

  return (
    <AdminConfirmActionButton
      variant="danger"
      label="再計算"
      pendingLabel="実行中..."
      confirmTitle="実行の確認"
      confirmMessage="再計算を実行します。よろしいですか？"
      confirmOkLabel="実行する"
      confirmCancelLabel="キャンセル"
      triggerTestId="user-recalc"
      onConfirm={async () => {
        const res = await dangerousAction({ id: userId });

        // Result型の場合
        if (!res.ok) {
          // モーダル内表示 or ボタン下表示など方針に合わせる
          throw new Error(res.message);
        }

        // RSCを再取得して表示を最新化
        router.refresh();
      }}
    />
  );
}
```

---

#### onConfirm の戻り値設計

server action を直接叩く系は、戻り値を統一すると UI とテストが安定する。
推奨：Result型（例外で制御しない）

```ts
export type ActionResult =
  | { ok: true }
  | { ok: false; message: string; code?: string };
```

- ok: false は UI 側で表示（モーダル内 or ボタン下）
- 想定外エラーのみ throw（ログ用途）
