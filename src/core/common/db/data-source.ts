import "reflect-metadata";
import { logger } from "../utils";
import { DataSource, EntityTarget, ObjectLiteral, Repository } from "typeorm";
import { injectable } from "tsyringe";
import { InitDataSource } from "./init-data-source";
import InternalServerException from "../exceptions/internal-server.exception";

@injectable()
class AppDataSource {
  private dataSource: DataSource;
  constructor() {
    this.dataSource = InitDataSource;
  }

  getRepository = <T extends ObjectLiteral>(target: EntityTarget<T>): Repository<T> => {
    return this.dataSource.getRepository<T>(target);
  };

  initialize = async (isLogEnable = true): Promise<void> => {
    try {
      await this.dataSource.initialize();
      if (isLogEnable) {
        logger.info("TypeOrm initialization is successful");
      }
      return;
    } catch (error) {
      logger.error("TypeOrm initialization is failure with an error", error as Error);
      throw new InternalServerException({ context: error as Error });
    }
  };

  destroy = async (): Promise<void> => {
    if (this.dataSource.isInitialized) {
      await this.dataSource.destroy();
    }
  };
}

export default AppDataSource;
