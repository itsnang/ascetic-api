# Local Wear API

A modern, scalable REST API for managing local wear/clothing business operations. Built with Node.js, Express, TypeScript, and PostgreSQL with Drizzle ORM.

## 🚀 Features

- **User Management**: Complete CRUD operations for user accounts
- **Authentication & Authorization**: JWT-based authentication with middleware protection
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Caching**: Redis integration for improved performance
- **API Documentation**: Swagger/OpenAPI documentation
- **Security**: Comprehensive security middleware (Helmet, CORS, Rate Limiting)
- **Validation**: Request validation using Zod schemas
- **Logging**: Structured logging with Winston
- **Dependency Injection**: Clean architecture with TSyringe
- **Error Handling**: Centralized error handling with custom exceptions
- **Development Tools**: Hot reload, linting, formatting, and database management

## 🛠 Tech Stack

### Core Technologies
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Cache**: Redis
- **Authentication**: JSON Web Tokens (JWT)

### Development & Tools
- **Validation**: Zod
- **Dependency Injection**: TSyringe
- **API Documentation**: Swagger UI
- **Logging**: Winston
- **Process Management**: Nodemon
- **Code Quality**: ESLint, Prettier
- **Database Management**: Drizzle Kit

### Security & Performance
- **Security Headers**: Helmet
- **CORS**: Cross-Origin Resource Sharing
- **Rate Limiting**: Express Rate Limit
- **Compression**: Response compression
- **Input Validation**: Request sanitization

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [PostgreSQL](https://www.postgresql.org/) (v12 or higher)
- [Redis](https://redis.io/) (v6 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd local-wear-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
# Database Configuration (PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password_here
DB_NAME=local_wear

# Application Configuration
PORT=8080
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=3000
```

### 4. Database Setup

#### Start PostgreSQL Service
Make sure PostgreSQL is running on your system.

#### Create Database
```sql
CREATE DATABASE local_wear;
```

#### Generate and Run Migrations
```bash
# Generate migration files from schema
npm run db:generate

# Run migrations
npm run migrate

# Alternative: Push schema directly (development only)
npm run db:push
```

### 5. Start Redis Service
Make sure Redis is running on your system.

### 6. Run the Application

#### Development Mode
```bash
npm run dev
```

#### Production Build
```bash
npm run build
npm start
```

The API will be available at `http://localhost:8080`

## 📚 API Documentation

Once the application is running, you can access the interactive API documentation at:

**Swagger UI**: `http://localhost:8080/api-docs`

### Base URL
```
http://localhost:8080/api/v1
```

### Available Endpoints

#### Users
- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/:id` - Get user by ID
- `POST /api/v1/users` - Create new user
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user

## 🗂 Project Structure

```
local-wear-api/
├── src/
│   ├── application/          # Application layer
│   │   ├── controllers/      # Route controllers
│   │   ├── models/          # Business models
│   │   └── services/        # Business logic services
│   ├── core/                # Core infrastructure
│   │   ├── clients/         # External service clients (Redis, etc.)
│   │   └── common/          # Shared utilities and configurations
│   │       ├── constants/   # Application constants
│   │       ├── db/          # Database configuration
│   │       ├── enums/       # Enumerations
│   │       ├── exceptions/  # Custom exception classes
│   │       └── utils/       # Utility functions
│   ├── data/                # Data layer
│   │   ├── dto/            # Data Transfer Objects
│   │   ├── interface/      # Data interfaces
│   │   ├── repository/     # Data access layer
│   │   └── schema/         # Database schemas & validation
│   ├── middlewares/        # Express middlewares
│   ├── routes/             # Route definitions
│   ├── config/             # Configuration files
│   └── app.ts              # Application entry point
├── scripts/                # Utility scripts
├── migrations/             # Database migrations
├── drizzle.config.ts       # Drizzle ORM configuration
├── package.json
└── tsconfig.json
```

## 🔧 Available Scripts

### Development
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the application for production
- `npm run format` - Format code with Prettier
- `npm run lint` - Lint code with ESLint

### Database
- `npm run db:generate` - Generate migration files from schema changes
- `npm run db:migrate` - Apply migrations using Drizzle Kit
- `npm run db:push` - Push schema changes directly to database (development)
- `npm run db:studio` - Open Drizzle Studio for database management
- `npm run migrate` - Run migrations using custom script

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Prevents API abuse with configurable limits
- **CORS Protection**: Configurable cross-origin resource sharing
- **Security Headers**: Helmet.js for security headers
- **Input Validation**: Zod schemas for request validation
- **Error Handling**: Secure error responses without sensitive data exposure

## 🏗 Architecture

This application follows a **Clean Architecture** pattern with clear separation of concerns:

### Layers
1. **Presentation Layer** (`routes/`, `controllers/`) - Handles HTTP requests/responses
2. **Application Layer** (`services/`) - Contains business logic
3. **Infrastructure Layer** (`core/`) - External services and utilities
4. **Data Layer** (`repository/`, `schema/`) - Data access and persistence

### Design Patterns
- **Dependency Injection**: Using TSyringe for loose coupling
- **Repository Pattern**: Abstracted data access layer
- **Middleware Pattern**: Composable request processing
- **Factory Pattern**: For creating database connections and services

## 🗃 Database Schema

### Users Table
```sql
CREATE TABLE "Users" (
  "user_id" SERIAL PRIMARY KEY,
  "username" VARCHAR(50) UNIQUE NOT NULL,
  "email" VARCHAR(100) UNIQUE NOT NULL,
  "password_hash" VARCHAR(255) NOT NULL,
  "first_name" VARCHAR(50),
  "last_name" VARCHAR(50),
  "phone_number" VARCHAR(20),
  "address_line1" VARCHAR(100),
  "address_line2" VARCHAR(100),
  "city" VARCHAR(50),
  "state_province" VARCHAR(50),
  "postal_code" VARCHAR(10),
  "country" VARCHAR(50),
  "registration_date" TIMESTAMP DEFAULT NOW() NOT NULL,
  "last_login" TIMESTAMP,
  "user_type" VARCHAR(10) DEFAULT 'customer' NOT NULL
);
```

## 🔄 Migration from TypeORM

This project was recently migrated from TypeORM to Drizzle ORM. See [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) for detailed information about the migration process and benefits.

## 🛠 Development

### Code Style
- **TypeScript**: Strict type checking enabled
- **ESLint**: Configured with TypeScript rules
- **Prettier**: Consistent code formatting
- **Path Mapping**: Clean imports with `@/` alias

### Testing
```bash
# Run tests (when implemented)
npm test

# Run tests with coverage
npm run test:coverage
```

### Debugging
The development server runs with Node.js inspector enabled:
```bash
npm run dev
```
Then attach your debugger to `http://localhost:9229`

## 🐳 Docker (Optional)

### Dockerfile
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 8080
CMD ["npm", "start"]
```

### Docker Compose
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      - NODE_ENV=production
    depends_on:
      - postgres
      - redis
  
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: local_wear
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
  redis:
    image: redis:7-alpine
    
volumes:
  postgres_data:
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style and patterns
- Write meaningful commit messages
- Add appropriate error handling
- Update documentation when necessary
- Add tests for new features

## 📝 License

This project is licensed under the [MIT License](LICENSE).

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [troubleshooting section](./MIGRATION_GUIDE.md#troubleshooting) in the migration guide
2. Review the API documentation at `/api-docs`
3. Check existing issues in the repository
4. Create a new issue with detailed information

## 🔮 Future Enhancements

- [ ] User authentication endpoints
- [ ] Product management system
- [ ] Order processing
- [ ] Inventory management
- [ ] Payment integration
- [ ] Email notifications
- [ ] File upload handling
- [ ] Advanced search and filtering
- [ ] Analytics and reporting
- [ ] Multi-tenant support

---

**Built with ❤️ for the local wear community** 
