import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { MoviesController } from "./movies.controller";
import { MoviesService } from "./movies.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MovieEntity } from "./entities/movie.entity";
import { CommentEntity } from "./entities/comment.entity";
import { CsvSeederService } from "../utilities/csv-seeder.service";
import { AuthMiddleware } from "../user/auth/auth.middleware";
import { UserModule } from "../user/user.module";
import { UserEntity } from "../user/entities/user.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([MovieEntity, CommentEntity, UserEntity]),
    UserModule,
  ],
  controllers: [MoviesController],
  providers: [MoviesService, CsvSeederService],
})
export class MoviesModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes("movies");
  }
}
