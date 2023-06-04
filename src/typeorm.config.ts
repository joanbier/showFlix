// import { TypeOrmModuleOptions } from "@nestjs/typeorm";
// import * as dotenv from "dotenv";
// dotenv.config();
//
// export const typeOrmConfig: TypeOrmModuleOptions = {
// type: "mysql",
// host: process.env.DB_HOST || "localhost",
// port: +process.env.DB_PORT || 8889,
// username: process.env.DB_USERNAME || "root",
// password: process.env.DB_PASSWORD || "root",
// database: process.env.DB_NAME || "showflix",
// entities: [__dirname + "/**/*.entity{.ts,.js}"],
// synchronize: Boolean(process.env.DB_SYNCHRONIZE) || true,
// dropSchema: Boolean(process.env.DB_DROP_SCHEMA) || true,
// };

import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import * as url from "url";
import * as dotenv from "dotenv";
dotenv.config();

const dbUrl = process.env.CLEARDB_DATABASE_URL;

let typeOrmConfig: TypeOrmModuleOptions;
if (dbUrl) {
  const connectionUrl = new url.URL(dbUrl);
  typeOrmConfig = {
    type: "mysql",
    host: connectionUrl.hostname,
    port: Number(connectionUrl.port),
    username: connectionUrl.username,
    password: connectionUrl.password,
    database: connectionUrl.pathname.substr(1),
    entities: [__dirname + "/**/*.entity{.ts,.js}"],
    synchronize: true,
  };
} else {
  typeOrmConfig = {
    type: "mysql",
    host: "localhost",
    port: 8889,
    username: "root",
    password: "root",
    database: "showflix",
    entities: [__dirname + "/**/*.entity{.ts,.js}"],
    synchronize: true,
  };
}

export default typeOrmConfig;
