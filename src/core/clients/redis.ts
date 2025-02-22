import { logger } from "../../core/common/utils";
import Redis, { RedisOptions, Redis as RedisConnection } from "ioredis";
import { get } from "lodash";
import { injectable } from "tsyringe";

const CACHE_PREFIX = "CACHE_";
const MASTER_CONNECTION_NAME = "MASTER_CONNECTION";
const REDIS_CONNECTION_TIMEOUT = 5000; // 5 seconds
const MAX_RETRY_TIMES = 3;

interface IConfig {
  connectionName: string;
}

interface IConnection {
  host: string;
  port: number;
}

export interface IRedisCache {
  /**
   * Close all connections
   */
  close(): Promise<void>;
  /**
   * Get value from cache
   * @param key The key of the value to get
   */
  get<T>(key: string): Promise<T | null>;
  /**
   * Get the value of a key and delete the key
   * @param key The key of the value to get
   */
  getdel<T>(key: string): Promise<T | null>;
  /**
   * Set data to cache
   * @param key The key to set
   * @param value The value to set
   * @param ttl The time to live in milliseconds
   */
  set(key: string, value: string | Buffer | number, ttl?: number): Promise<void>;
  /**
   * Delete data from cache
   * @param key The key to delete
   */
  delete(key: string): Promise<void>;
  /**
   * Delete data from cache by pattern
   * @param pattern The pattern to match
   */
  deleteByPattern(pattern: string): Promise<void>;
  /**
   * Get TTL from cache
   */
  getTtl(key: string): Promise<number | null>;
}

@injectable()
export class RedisCache implements IRedisCache {
  private connection: RedisConnection | null = null;
  private readerConnection: RedisConnection | null = null;

  private retryStrategy = (times: number, connection: IConnection): number | null => {
    if (times >= MAX_RETRY_TIMES) {
      logger.error(
        `Too Many Attempts To Reconnect. Please Check The Server Status! ${connection.host}:${connection.port}`
      );
      return null;
    }
    return Math.min(times * 200, 1000);
  };

  private reconnectOnError = (error: any): boolean => {
    const targetError = "READONLY";
    if (error.message.includes(targetError)) {
      logger.error("Reconnect on error", error as Error);
      return true;
    }
    return false;
  };

  private init = (): RedisConnection | null => {
    const host = get(process.env, "REDIS_HOST", "");
    const port = Number(get(process.env, "REDIS_PORT", 6379));
    const config: IConfig = {
      connectionName: MASTER_CONNECTION_NAME
    };
    try {
      const options: RedisOptions = {
        connectTimeout: REDIS_CONNECTION_TIMEOUT,
        reconnectOnError: (error: Error): boolean | 1 | 2 => this.reconnectOnError(error),
        retryStrategy: (times: number): number | void | null =>
          this.retryStrategy(times, { host, port }),
        enableReadyCheck: false,
        db: 0,
        lazyConnect: true,
        ...config
      };
      const client = new Redis(port, host, options);

      client.on("error", (error: any) => {
        logger.error("RedisCache::init redis server error", error as Error);
      });

      return client;
    } catch (error: any) {
      logger.error("RedisCache::init redis server error", error as Error);
      return null;
    }
  };

  private readerInit = (): RedisConnection | null => {
    const host = get(process.env, "REDIS_READER_HOST", "");
    const port = Number(get(process.env, "REDIS_PORT", 6379));
    const config: IConfig = {
      connectionName: MASTER_CONNECTION_NAME
    };
    try {
      const options: RedisOptions = {
        connectTimeout: REDIS_CONNECTION_TIMEOUT,
        reconnectOnError: (error: Error): boolean | 1 | 2 => this.reconnectOnError(error),
        retryStrategy: (times: number): number | void | null =>
          this.retryStrategy(times, { host, port }),
        enableReadyCheck: false,
        db: 0,
        lazyConnect: true,
        ...config
      };

      const client = new Redis(port, host, options);

      client.on("error", (error: any) => {
        logger.error("RedisCache::init redis server error", error as Error);
      });

      return client;
    } catch (error: any) {
      logger.error("RedisCache::init redis server error", error as Error);
      return null;
    }
  };

  close = async (): Promise<void> => {
    try {
      logger.info("Closing redis connection");
      const result = await this.connection?.quit();
      const readerResult = await this.readerConnection?.quit();

      logger.debug(`Closing Result ${result}`);
      logger.debug(`Closing Result Reader ${readerResult}`);
      this.readerConnection = null;
      this.connection = null;
    } catch (error: any) {
      logger.error("Closing redis connection error", error as Error);
    }
  };

  get = async <T>(key: string): Promise<T | null> => {
    let data = null;
    if (!this.connection && !this.readerConnection) {
      logger.info("Redis connection is undefined, creating a new connection");
      this.readerConnection = this.readerInit();
    }
    try {
      logger.info(`GET from cache using key: ${key}`);
      const rawData = await this.readerConnection?.get(CACHE_PREFIX + key);
      logger.debug(`Result ${rawData}`);
      if (!rawData) {
        return null;
      }
      data = rawData;
      return data as T;
    } catch (error: any) {
      logger.error(`GET key: ${CACHE_PREFIX + key}, error:`, error as Error);
      return null;
    } finally {
      await this.close();
    }
  };

  getdel = async <T>(key: string): Promise<T | null> => {
    let data = null;
    if (!this.connection) {
      logger.info("Redis connection is undefined, creating a new connection");
      this.connection = this.init();
    }
    try {
      logger.info(`GET from cache using key: ${key}`);
      const rawData = await this.connection?.getdel(CACHE_PREFIX + key);
      logger.debug(`Result ${rawData}`);
      if (!rawData) {
        return null;
      }
      data = rawData;
      return data as T;
    } catch (error: any) {
      logger.error(`GET key: ${CACHE_PREFIX + key}, error:`, error as Error);
      return null;
    } finally {
      await this.close();
    }
  };

  set = async (
    key: string,
    value: string | Buffer | number,
    ttl?: number
  ): Promise<void> => {
    if (!this.connection) {
      logger.info("Redis connection is undefined, creating a new connection");
      this.connection = this.init();
    }
    try {
      if (ttl) {
        logger.debug(`PSETEX ${CACHE_PREFIX + key} ${ttl} ${value}`);
        await this.connection?.psetex(CACHE_PREFIX + key, ttl, value);
      } else {
        logger.debug(`SET ${CACHE_PREFIX + key} ${value}`);
        await this.connection?.set(CACHE_PREFIX + key, value);
      }
      logger.info(`Cache key ${CACHE_PREFIX + key} set successfully`);
    } catch (error: any) {
      logger.error(`SET key: ${CACHE_PREFIX + key} error:`, error as Error);
    }
  };

  delete = async (key: string): Promise<void> => {
    if (!this.connection) {
      logger.info("Redis connection is undefined, creating a new connection");
      this.connection = this.init();
    }
    try {
      logger.debug(`Delete ${CACHE_PREFIX + key}`);
      const result = await this.connection?.del(CACHE_PREFIX + key);
      logger.debug(`Result ${result}`);
    } catch (error: any) {
      logger.error(`Delete key: ${CACHE_PREFIX + key} error:`, error as Error);
    }
  };

  deleteByPattern = async (pattern: string): Promise<void> => {
    const luaScript = `
      local cursor = "0"
      local pattern = ARGV[1]
      local count = 0

      repeat
          local result = redis.call('SCAN', cursor, 'MATCH', pattern)
          cursor = result[1]
          local keys = result[2]

          for _, key in ipairs(keys) do
              redis.call('DEL', key)
              count = count + 1
          end
      until cursor == "0"

      return count
    `;

    if (!this.connection) {
      logger.info("Redis connection is undefined, creating a new connection");
      this.connection = this.init();
    }
    const key = `${CACHE_PREFIX + pattern}`;
    const increment = 5;
    const numKeys = 0;
    try {
      logger.debug(`Keys ${key}`);
      await this.connection?.eval(luaScript, numKeys, key, increment, (err, result) => {
        if (err) {
          logger.error(`Error deleting ${key}: ${result}`);
        } else {
          logger.debug(`Delete ${key}: ${result}`);
        }
      });
    } catch (error: any) {
      logger.error(`Keys pattern: ${key} error:`, error as Error);
    }
  };

  getTtl = async (key: string): Promise<number | null> => {
    let data = null;
    if (!this.connection && !this.readerConnection) {
      logger.info("Redis connection is undefined, creating a new connection");
      this.readerConnection = this.readerInit();
    }
    try {
      // Get the TTL of the key
      logger.info(`GET ttl from cache using key: ${key}`);
      const rawData = await this.readerConnection?.ttl(CACHE_PREFIX + key);
      logger.debug(`Result ${rawData}`);
      if (!rawData) {
        return null;
      }
      data = rawData;
      return data;
    } catch (error) {
      logger.error(`GET key: ${CACHE_PREFIX + key}, error:`, error as Error);
      return null;
    } finally {
      await this.close();
    }
  };
}
