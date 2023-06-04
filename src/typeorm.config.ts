import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import * as dotenv from "dotenv";
dotenv.config();

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: +process.env.DB_PORT || 8889,
  username: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "showflix",
  entities: [__dirname + "/**/*.entity{.ts,.js}"],
  synchronize: Boolean(process.env.DB_SYNCHRONIZE) || true,
  dropSchema: Boolean(process.env.DB_DROP_SCHEMA) || true,
};
