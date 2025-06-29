# Migration Guide: TypeORM to Drizzle ORM with PostgreSQL

## Overview
This project has been migrated from MySQL with TypeORM to PostgreSQL with Drizzle ORM. This guide explains the changes made and the steps to complete the migration.

## Changes Made

### 1. Dependencies Updated
- **Removed**: `typeorm`
- **Added**: `drizzle-orm`, `drizzle-kit`, `pg`, `@types/pg`

### 2. Database Configuration
- **Old**: TypeORM with MySQL configuration in `init-data-source.ts`
- **New**: Drizzle with PostgreSQL configuration in `drizzle-data-source.ts`

### 3. Schema Definition
- **Old**: TypeORM entities in `src/data/entity/user.entity.ts`
- **New**: Drizzle schema in `src/data/schema/user.schema.ts`

### 4. Repository Pattern
- Updated `UserRepository` to use Drizzle queries instead of TypeORM repository methods
- Added more CRUD operations with proper typing

## Next Steps to Complete Migration

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up PostgreSQL Database
1. Install PostgreSQL on your system
2. Create a new database for your application
3. Update your environment variables:

```env
# Database Configuration (PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password_here
DB_NAME=local_wear
```

### 3. Generate Initial Migration
```bash
npm run db:generate
```

### 4. Run Migration
```bash
npm run migrate
```

### 5. Alternative: Push Schema Directly (for development)
```bash
npm run db:push
```

## Environment Variables

Update your `.env` file with PostgreSQL configuration:

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

# Other existing variables...
```

## Database Schema

The user table schema has been converted from TypeORM to Drizzle:

### TypeORM (Old)
```typescript
@Entity("Users")
export class UserEntity {
  @PrimaryGeneratedColumn()
  user_id!: number;
  
  @Column({ type: "varchar", length: 50, unique: true, nullable: false })
  username!: string;
  // ... other fields
}
```

### Drizzle (New)
```typescript
export const users = pgTable('Users', {
  user_id: serial('user_id').primaryKey(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  // ... other fields
});
```

## Repository Changes

The repository now uses Drizzle queries:

### TypeORM (Old)
```typescript
async getUsers(): Promise<UserEntity[]> {
  return await this.userRepository.find();
}
```

### Drizzle (New)
```typescript
async getUsers(): Promise<User[]> {
  const db = this.appDataSource.getDb();
  return await db.select().from(users);
}
```

## Available Scripts

- `npm run db:generate` - Generate migration files from schema changes
- `npm run db:migrate` - Apply migrations using Drizzle Kit
- `npm run db:push` - Push schema changes directly to database (development)
- `npm run db:studio` - Open Drizzle Studio for database management
- `npm run migrate` - Run migrations using custom script

## Validation

Zod validation schemas have been separated from database schemas:
- Database schema: `src/data/schema/user.schema.ts`
- Validation schema: `src/data/schema/user-validation.schema.ts`

## Troubleshooting

### Common Issues

1. **Module 'pg' not found**: Run `npm install` to install dependencies
2. **Connection refused**: Ensure PostgreSQL is running and credentials are correct
3. **Migration errors**: Check database permissions and schema syntax

### Data Migration

If you have existing data in MySQL that needs to be migrated to PostgreSQL:

1. Export data from MySQL
2. Transform data format if needed
3. Import into PostgreSQL
4. Run application migrations

## Benefits of This Migration

1. **Better Type Safety**: Drizzle provides excellent TypeScript support
2. **Performance**: PostgreSQL generally offers better performance for complex queries
3. **Modern Tooling**: Drizzle Kit provides excellent migration and schema management
4. **SQL-like Syntax**: Drizzle queries are closer to SQL, making them more readable
5. **Automatic Types**: Schema types are automatically inferred

## Support

If you encounter issues during migration, check:
1. Database connection settings
2. PostgreSQL service status
3. Environment variable configuration
4. Migration file syntax 
