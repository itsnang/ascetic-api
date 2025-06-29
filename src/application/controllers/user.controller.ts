import { logger } from "../../core/common/utils";
import { inject, injectable } from "tsyringe";
import { UserService } from "../services/user.service";
import { User, NewUser } from "@/data/schema/user.schema";

@injectable()
export class UserController {
  constructor(@inject("IUserService") private userService: UserService) {}

  getAllUsers = async (): Promise<User[]> => {
    logger.info({ message: "getAllUsers" });
    try {
      return await this.userService.getUsers();
    } catch (error: unknown) {
      logger.error("Error getAllUsers", error as Error);
      throw error;
    }
  };

  getUserById = async (id: number): Promise<User | undefined> => {
    logger.info({ message: "getUserById", id });
    try {
      return await this.userService.getUserById(id);
    } catch (error: unknown) {
      logger.error("Error getUserById", error as Error);
      throw error;
    }
  };

  createUser = async (userData: NewUser): Promise<User> => {
    logger.info({ message: "createUser", userData });
    try {
      return await this.userService.createUser(userData);
    } catch (error: unknown) {
      logger.error("Error createUser", error as Error);
      throw error;
    }
  };

  updateUser = async (
    id: number,
    userData: Partial<NewUser>
  ): Promise<User | undefined> => {
    logger.info({ message: "updateUser", id, userData });
    try {
      return await this.userService.updateUser(id, userData);
    } catch (error: unknown) {
      logger.error("Error updateUser", error as Error);
      throw error;
    }
  };

  deleteUser = async (id: number): Promise<boolean> => {
    logger.info({ message: "deleteUser", id });
    try {
      return await this.userService.deleteUser(id);
    } catch (error: unknown) {
      logger.error("Error deleteUser", error as Error);
      throw error;
    }
  };

  // Keep the old method for backward compatibility
  userServiceHanlder = async (): Promise<User[]> => {
    return this.getAllUsers();
  };
}
