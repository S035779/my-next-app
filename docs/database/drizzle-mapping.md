# ER to Drizzle Mapping

## Example

ER:

User

- id
- email
- name

Drizzle:

```ts
export const users = mysqlTable("users", {
  id: varchar("id", { length: 36 }).primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
});
```

Rules

- snake_case DB
- camelCase TS
- timestamps 必須
