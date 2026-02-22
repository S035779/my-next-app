# Database Schema

## Users

| Column | Type | Description |
|--------|------|-------------|
id | uuid | PK |
email | string | unique |
name | string | |
created_at | timestamp | |

Constraints:

- email unique

Indexes:

- email index