# ER Diagram

```mermaid
erDiagram

  USERS {
    uuid id PK
    string email
    string name
  }

  USERS ||--o{ POSTS : owns