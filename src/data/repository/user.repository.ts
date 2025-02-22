import { IRedisCache } from "../../core/clients/redis";
import { logger } from "../../core/common/utils";
import { inject, injectable } from "tsyringe";

interface IUserRepository {}

@injectable()
export class UserRepository implements IUserRepository {}
