import { injectable } from "tsyringe";
import { logger } from "../utils";
import DrizzleDataSource from "./drizzle-data-source";
import InternalServerException from "../exceptions/internal-server.exception";

@injectable()
class AppDataSource {
  private drizzleDataSource: DrizzleDataSource;

  constructor() {
    this.drizzleDataSource = new DrizzleDataSource();
  }

  getDb = () => {
    return this.drizzleDataSource.getDb();
  };

  getClient = () => {
    return this.drizzleDataSource.getClient();
  };

  initialize = async (isLogEnable = true): Promise<void> => {
    try {
      await this.drizzleDataSource.initialize(isLogEnable);
      return;
    } catch (error) {
      logger.error("Database initialization failed", error as Error);
      throw new InternalServerException({ context: error as Error });
    }
  };

  destroy = async (): Promise<void> => {
    await this.drizzleDataSource.destroy();
  };
}

export default AppDataSource;
