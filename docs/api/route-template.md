# API Route Generation Template

## Steps

1. OpenAPI spec を読む
2. validation schema 作成
3. actions 呼び出し
4. JSONレスポンス返却

## Route Example

```ts
export async function GET() {
  try {
    const data = await listUsers();

    return Response.json({
      ok: true,
      data,
    });
  } catch (error) {
    return Response.json(
      { ok: false, error: { message: "Internal Error" } },
      { status: 500 }
    );
  }
}
```
