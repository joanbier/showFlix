import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { AuthMiddleware } from "./auth/auth.middleware";
import { MovieEntity } from "../movies/entities/movie.entity";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, MovieEntity])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: "user", method: RequestMethod.GET },
        { path: "user/all", method: RequestMethod.GET },
        { path: "user", method: RequestMethod.PUT },
        { path: "user/:id", method: RequestMethod.DELETE },
      );
  }
}
