import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: +process.env.DB_PORT || 8889,
  username: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "showflix",
  entities: [__dirname + "/**/*.entity{.ts,.js}"],
  synchronize: process.env.DB_SYNCHRONIZE === "true" || true,
  dropSchema: process.env.DB_DROP_SCHEMA === "true" || true,
};
