import { inject, injectable } from "tsyringe";
import AppDataSource from "@/core/common/db/data-source";
import { users, User, NewUser } from "../schema/user.schema";
import { eq } from "drizzle-orm";

interface IUserRepository {
  getUsers(): Promise<User[]>;
  getUserById(id: number): Promise<User | undefined>;
  createUser(userData: NewUser): Promise<User>;
  updateUser(id: number, userData: Partial<NewUser>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByName(name: string): Promise<User | undefined>;
}

@injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @inject("AppDataSource")
    private appDataSource: AppDataSource
  ) {}

  getUsers = async (): Promise<User[]> => {
    const db = this.appDataSource.getDb();
    return await db.select().from(users);
  };

  getUserById = async (id: number): Promise<User | undefined> => {
    const db = this.appDataSource.getDb();
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  };

  createUser = async (userData: NewUser): Promise<User> => {
    const db = this.appDataSource.getDb();
    const result = await db.insert(users).values(userData).returning();
    return result[0];
  };

  updateUser = async (
    id: number,
    userData: Partial<NewUser>
  ): Promise<User | undefined> => {
    const db = this.appDataSource.getDb();
    const result = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return result[0];
  };

  deleteUser = async (id: number): Promise<boolean> => {
    const db = this.appDataSource.getDb();
    const result = await db.delete(users).where(eq(users.id, id));
    return result.rowCount ? true : false;
  };

  getUserByEmail = async (email: string): Promise<User | undefined> => {
    const db = this.appDataSource.getDb();
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  };

  getUserByName = async (name: string): Promise<User | undefined> => {
    const db = this.appDataSource.getDb();
    const result = await db.select().from(users).where(eq(users.name, name));
    return result[0];
  };
}
