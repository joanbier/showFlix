import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MoviesModule } from "./movies/movies.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeOrmConfig } from "./typeorm.config";
import { UserModule } from "./user/user.module";

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), MoviesModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
