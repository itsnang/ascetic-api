import "reflect-metadata";
import { DataSource } from "typeorm";
import rootEntity from "./root-entity";

export const InitDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: 3306,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: false,
  entities: [...rootEntity],
  migrations: [],
  subscribers: [],
  migrationsTableName: "migrations"
});
