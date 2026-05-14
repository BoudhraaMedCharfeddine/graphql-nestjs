# NestJS GraphQL Task Manager API

A code-first GraphQL API built with NestJS, Apollo Server v4, TypeORM and SQLite. Covers JWT authentication and full CRUD for tasks.

## Stack

- **NestJS** — framework
- **GraphQL** (code-first) — via `@nestjs/graphql` + `@apollo/server`
- **TypeORM** + **SQLite** — persistence (no Docker needed)
- **JWT** — authentication via `@nestjs/jwt` + Passport
- **class-validator** — input validation

## Getting started

```bash
npm install
npm run start:dev
```

GraphQL Playground: http://localhost:3000/graphql

The SQLite database file `taskmanager.sqlite` is created automatically on first start.

---

## Authentication

### Register

```graphql
mutation {
  register(input: {
    email: "alice@example.com"
    username: "alice"
    password: "password123"
  }) {
    token
    user {
      id
      username
      email
    }
  }
}
```

### Login

```graphql
mutation {
  login(input: {
    email: "alice@example.com"
    password: "password123"
  }) {
    token
    user {
      id
      username
    }
  }
}
```

Both mutations return a JWT token. Pass it as a header for all protected operations:

```json
{ "Authorization": "Bearer <your_token>" }
```

In the Playground, add this header in the **Headers** tab at the bottom of the editor.

---

## Users

### Get current user profile *(auth required)*

```graphql
query {
  me {
    id
    username
    email
    createdAt
  }
}
```

---

## Tasks

All task operations require the `Authorization` header.

### List your tasks

```graphql
query {
  tasks {
    id
    title
    description
    status
    createdAt
    updatedAt
  }
}
```

### Get a single task

```graphql
query {
  task(id: "uuid-of-the-task") {
    id
    title
    description
    status
  }
}
```

### Create a task

`status` is optional and defaults to `PENDING`.

```graphql
mutation {
  createTask(input: {
    title: "Write unit tests"
    description: "Cover auth and tasks resolvers"
    status: IN_PROGRESS
  }) {
    id
    title
    status
    createdAt
  }
}
```

### Update a task

Only `id` is required — all other fields are optional.

```graphql
mutation {
  updateTask(input: {
    id: "uuid-of-the-task"
    title: "Write unit tests (updated)"
    status: DONE
  }) {
    id
    title
    status
    updatedAt
  }
}
```

### Delete a task

Returns `true` on success.

```graphql
mutation {
  deleteTask(id: "uuid-of-the-task")
}
```

---

## Task status values

| Value | Description |
|---|---|
| `PENDING` | Not started yet (default) |
| `IN_PROGRESS` | Currently being worked on |
| `DONE` | Completed |

---

## Project structure

```
src/
├── main.ts
├── app.module.ts
├── auth/
│   ├── auth.module.ts
│   ├── auth.resolver.ts       # register, login mutations
│   ├── auth.service.ts
│   ├── jwt.strategy.ts
│   └── dto/
│       ├── register.input.ts
│       ├── login.input.ts
│       └── auth.response.ts
├── users/
│   ├── users.module.ts
│   ├── users.resolver.ts      # me query
│   ├── users.service.ts
│   └── entities/user.entity.ts
├── tasks/
│   ├── tasks.module.ts
│   ├── tasks.resolver.ts      # tasks, task queries + createTask, updateTask, deleteTask mutations
│   ├── tasks.service.ts
│   ├── entities/task.entity.ts
│   └── dto/
│       ├── create-task.input.ts
│       └── update-task.input.ts
└── common/
    ├── guards/gql-auth.guard.ts
    └── decorators/current-user.decorator.ts
```
