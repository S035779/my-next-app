# Naming Conventions (Strict)

## actions

- list\<ResourcePlural>
- get\<Resource>ById
- create\<Resource>
- update\<Resource>
- delete\<Resource>
- search\<ResourcePlural>（検索がある場合）

例: listUsers, getUserById, createUser, updateUser, deleteUser, searchUsers

## db repo

- list
- findById
- insert
- updateById
- deleteById
- findBy\<UniqueKey>（必要なら）

## api routes

- /api/\<resource> : GET(list/search), POST(create)
- /api/\<resource>/[id] : GET, PATCH, DELETE

## UI routes

- /admin/\<resource>
- /admin/\<resource>/new
- /admin/\<resource>/[id]
