# Clean API — Node.js TypeScript REST API

Production-ready REST API with Clean Architecture, PostgreSQL, JWT auth, and Swagger docs.

## Stack
- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL (pg)
- **Auth**: JWT (access + refresh tokens)
- **Validation**: express-validator
- **Docs**: Swagger (OpenAPI 3.0)
- **Logging**: Winston
- **Security**: Helmet, CORS, Rate Limiter

## Project Structure
```
src/
├── config/         # DB, env, swagger, migrations
├── middleware/     # auth, validate, error, rateLimiter
├── modules/
│   ├── auth/       # register, login, refresh, logout, me
│   ├── users/      # CRUD
│   └── products/   # CRUD
├── utils/          # AppError, jwt, hash, logger, response
├── types/          # Express augmentation
├── app.ts
└── server.ts
```

## Setup

```bash
# 1. Install deps
npm install

# 2. Configure environment
cp .env.example .env
# Fill in DB credentials and JWT secrets

# 3. Run migrations
npm run db:migrate

# 4. Start dev server
npm run dev
```

## API Endpoints

| Method | Endpoint                  | Auth     | Description          |
|--------|---------------------------|----------|----------------------|
| POST   | /api/v1/auth/register     | Public   | Register             |
| POST   | /api/v1/auth/login        | Public   | Login                |
| POST   | /api/v1/auth/refresh      | Public   | Refresh tokens       |
| POST   | /api/v1/auth/logout       | Required | Logout               |
| GET    | /api/v1/auth/me           | Required | Current user         |
| GET    | /api/v1/users             | Admin    | List users           |
| GET    | /api/v1/users/:id         | Required | Get user             |
| POST   | /api/v1/users             | Admin    | Create user          |
| PATCH  | /api/v1/users/:id         | Required | Update user          |
| DELETE | /api/v1/users/:id         | Required | Delete user          |
| GET    | /api/v1/products          | Public   | List products        |
| GET    | /api/v1/products/:id      | Public   | Get product          |
| POST   | /api/v1/products          | Required | Create product       |
| PATCH  | /api/v1/products/:id      | Required | Update product       |
| DELETE | /api/v1/products/:id      | Required | Delete product       |
| GET    | /health                   | Public   | Health check         |
| GET    | /api/docs                 | Public   | Swagger UI           |

## Response Format
```json
{
  "success": true,
  "message": "Users fetched",
  "data": [...],
  "meta": { "total": 50, "page": 1, "limit": 10, "pages": 5 }
}
```
