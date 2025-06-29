# Local Wear API

A REST API for managing local wear/clothing business operations. Built with Node.js, Express, TypeScript, PostgreSQL and Drizzle ORM.

## Tech Stack

- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Cache**: Redis
- **Auth**: JWT
- **Validation**: Zod
- **Documentation**: Swagger UI

## Quick Start

### Prerequisites
- Node.js (v14+)
- PostgreSQL
- Redis

### Setup

1. **Install dependencies**
```bash
npm install
```

2. **Environment variables**
Create `.env` file:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=local_wear

PORT=8080
JWT_SECRET=your_jwt_secret

REDIS_HOST=localhost
REDIS_PORT=6379
```

3. **Database setup**
```bash
# Create database
createdb local_wear

# Run migrations
npm run db:push
```

4. **Start the application**
```bash
npm run dev
```

API will be available at `http://localhost:8080`

## API Documentation

Swagger UI: `http://localhost:8080/api-docs`

### Endpoints
- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/:id` - Get user by ID
- `POST /api/v1/users` - Create user
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user

## Scripts

- `npm run dev` - Development server
- `npm run build` - Build for production
- `npm run db:generate` - Generate migrations
- `npm run db:push` - Push schema to database
- `npm run db:studio` - Open database studio

## Project Structure

```
src/
├── application/     # Controllers & services
├── core/           # Utilities & config
├── data/           # Database schemas & repositories
├── middlewares/    # Express middlewares
└── routes/         # API routes
```
