import { logger } from "../../core/common/utils";
import { injectable } from "tsyringe";

import { Settings } from "luxon";
Settings.defaultZone = "UTC+7";

interface IUserService {
  getUsers(): Promise<any>;
}

@injectable()
export class UserService implements IUserService {
  getUsers = async (): Promise<any> => {
    try {
      return "All users";
    } catch (error) {
      logger.error("failed to get all users", error as Error);
      throw error;
    }
  };
}
