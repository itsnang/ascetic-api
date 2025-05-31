import { inject, injectable } from "tsyringe";
import AppDataSource from "@/core/common/db/data-source";
import { Repository } from "typeorm";
import { UserEntity } from "../entity/user.entity";

interface IUserRepository {
  getUsers(): Promise<UserEntity[]>;
}

@injectable()
export class UserRepository implements IUserRepository {
  private userRepository: Repository<UserEntity>;
  constructor(
    @inject("AppDataSource")
    private appDataSource: AppDataSource
  ) {
    this.userRepository = this.appDataSource.getRepository(UserEntity);
  }

  getUsers = async (): Promise<UserEntity[]> => {
    const users = await this.userRepository.find();
    return users;
  };
}
