import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { injectable } from "tsyringe";
import { logger } from "../utils";
import * as schema from "@/data/schema";
import InternalServerException from "../exceptions/internal-server.exception";

@injectable()
class DrizzleDataSource {
  private client: Pool;
  private db: ReturnType<typeof drizzle>;

  constructor() {
    // Use DATABASE_URL if available, otherwise fall back to individual parameters
    const databaseUrl = process.env.DATABASE_URL;

    if (databaseUrl) {
      this.client = new Pool({
        connectionString: databaseUrl,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000
      });
    } else {
      this.client = new Pool({
        host: process.env.DB_HOST || "localhost",
        port: parseInt(process.env.DB_PORT || "5432"),
        user: process.env.DB_USER || "postgres",
        password: process.env.DB_PASSWORD || "password",
        database: process.env.DB_NAME || "local_wear",
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000
      });
    }

    this.db = drizzle(this.client, { schema, logger: true });
  }

  getDb = () => {
    return this.db;
  };

  getClient = () => {
    return this.client;
  };

  initialize = async (isLogEnable = true): Promise<void> => {
    try {
      // Test the connection
      await this.client.query("SELECT 1");
      if (isLogEnable) {
        logger.info("Drizzle PostgreSQL initialization is successful");
      }
      return;
    } catch (error) {
      logger.error(
        "Drizzle PostgreSQL initialization is failure with an error",
        error as Error
      );
      throw new InternalServerException({ context: error as Error });
    }
  };

  destroy = async (): Promise<void> => {
    await this.client.end();
  };
}

export default DrizzleDataSource;
