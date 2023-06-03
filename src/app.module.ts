import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MoviesModule } from "./movies/movies.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeOrmConfig } from "./typeorm.config";
import { UserModule } from "./user/user.module";
import { MovieEntity } from "./movies/entities/movie.entity";

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([MovieEntity]),
    MoviesModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
