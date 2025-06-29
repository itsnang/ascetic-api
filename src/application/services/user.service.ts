import { logger } from "../../core/common/utils";
import { inject, injectable } from "tsyringe";
import { Settings } from "luxon";
import { UserRepository } from "@/data/repository/user.repository";
import { User, NewUser } from "@/data/schema/user.schema";

Settings.defaultZone = "UTC+7";

interface IUserService {
  getUsers(): Promise<User[]>;
  getUserById(id: number): Promise<User | undefined>;
  createUser(userData: NewUser): Promise<User>;
  updateUser(id: number, userData: Partial<NewUser>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
}

@injectable()
export class UserService implements IUserService {
  constructor(@inject("IUserRepository") private userRepository: UserRepository) {}

  getUsers = async (): Promise<User[]> => {
    try {
      const users = await this.userRepository.getUsers();
      return users;
    } catch (error) {
      logger.error("failed to get all users", error as Error);
      throw error;
    }
  };

  getUserById = async (id: number): Promise<User | undefined> => {
    try {
      return await this.userRepository.getUserById(id);
    } catch (error) {
      logger.error("failed to get user by id", error as Error);
      throw error;
    }
  };

  createUser = async (userData: NewUser): Promise<User> => {
    try {
      return await this.userRepository.createUser(userData);
    } catch (error) {
      logger.error("failed to create user", error as Error);
      throw error;
    }
  };

  updateUser = async (
    id: number,
    userData: Partial<NewUser>
  ): Promise<User | undefined> => {
    try {
      return await this.userRepository.updateUser(id, userData);
    } catch (error) {
      logger.error("failed to update user", error as Error);
      throw error;
    }
  };

  deleteUser = async (id: number): Promise<boolean> => {
    try {
      return await this.userRepository.deleteUser(id);
    } catch (error) {
      logger.error("failed to delete user", error as Error);
      throw error;
    }
  };

  getUserByEmail = async (email: string): Promise<User | undefined> => {
    try {
      return await this.userRepository.getUserByEmail(email);
    } catch (error) {
      logger.error("failed to get user by email", error as Error);
      throw error;
    }
  };

  getUserByUsername = async (username: string): Promise<User | undefined> => {
    try {
      return await this.userRepository.getUserByUsername(username);
    } catch (error) {
      logger.error("failed to get user by username", error as Error);
      throw error;
    }
  };
}
