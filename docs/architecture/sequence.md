# Sequence Diagrams

## Create User

```mermaid
sequenceDiagram

UI->>API: POST /users
API->>Actions: createUser()
Actions->>Repo: insert()
Repo->>DB: SQL
DB-->>Repo: result
Repo-->>Actions: entity
Actions-->>API: response
API-->>UI: JSON