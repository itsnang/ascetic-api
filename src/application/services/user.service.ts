import { logger } from "../../core/common/utils";
import { inject, injectable } from "tsyringe";

import { Settings } from "luxon";
import { UserRepository } from "@/data/repository/user.repository";
Settings.defaultZone = "UTC+7";

interface IUserService {
  getUsers(): Promise<any>;
}

@injectable()
export class UserService implements IUserService {
  constructor(@inject("IUserRepository") private userRepository: UserRepository) {}
  getUsers = async (): Promise<any> => {
    try {
      const users = await this.userRepository.getUsers();
      return users;
    } catch (error) {
      logger.error("failed to get all users", error as Error);
      throw error;
    }
  };
}
