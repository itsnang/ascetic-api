import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

async function runMigrations() {
  // Use DATABASE_URL if available, otherwise fall back to individual parameters
  const databaseUrl = process.env.DATABASE_URL;

  const client = databaseUrl
    ? new Pool({ connectionString: databaseUrl })
    : new Pool({
        host: process.env.DB_HOST || "localhost",
        port: parseInt(process.env.DB_PORT || "5432"),
        user: process.env.DB_USER || "postgres",
        password: process.env.DB_PASSWORD || "password",
        database: process.env.DB_NAME || "local_wear"
      });

  const db = drizzle(client);

  console.log("Running migrations...");

  try {
    await migrate(db, { migrationsFolder: "./migrations" });
    console.log("Migrations completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigrations();
