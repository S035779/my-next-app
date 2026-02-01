import { z } from 'zod';

export const userInputSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'メールアドレスは必須です')
    .email('メールアドレス形式で入力してください'),
  name: z
    .string()
    .trim()
    .max(255, '名前は255文字以内で入力してください')
    .optional()
    .or(z.literal('')),
});

export type UserInput = z.infer<typeof userInputSchema>;

export function validateUserInput(formData: FormData):
  | {
      ok: true;
      values: { email: string; name: string | null };
    }
  | {
      ok: false;
      fieldErrors: { email?: string; name?: string };
    } {
  const parsed = userInputSchema.safeParse({
    email: formData.get('email'),
    name: formData.get('name'),
  });

  if (!parsed.success) {
    const fe = parsed.error.flatten().fieldErrors;
    return {
      ok: false,
      fieldErrors: {
        email: fe.email?.[0],
        name: fe.name?.[0],
      },
    };
  }

  const name = parsed.data.name?.trim();
  return {
    ok: true,
    values: {
      email: parsed.data.email,
      name: name ? name : null,
    },
  };
}

export function parseIdOrThrow(formData: FormData): number {
  const raw = formData.get('id');
  if (typeof raw !== 'string') throw new Error('id is required');
  const id = Number(raw);
  if (!Number.isFinite(id)) throw new Error('invalid id');
  return id;
}
