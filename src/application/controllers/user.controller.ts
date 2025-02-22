import { logger } from "../../core/common/utils";
import { inject, injectable } from "tsyringe";
import { UserService } from "../services/user.service";

@injectable()
export class UserController {
  constructor(@inject("IUserService") private userService: UserService) {}

  userServiceHanlder = async (): Promise<any> => {
    logger.info({ message: "userServiceHanlder" });
    try {
      return await this.userService.getUsers();
    } catch (error: unknown) {
      logger.error("Error userServiceHanlder", error as Error);
      throw error;
    }
  };
}
