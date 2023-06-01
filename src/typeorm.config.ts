import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: "mysql",
  host: "localhost",
  port: 8889,
  username: "root",
  password: "root",
  database: "showflix",
  entities: [__dirname + "/**/*.entity{.ts,.js}"],
  synchronize: true,
  dropSchema: true,
};
