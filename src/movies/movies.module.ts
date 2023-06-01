import { Module } from "@nestjs/common";
import { MoviesController } from "./movies.controller";
import { MoviesService } from "./movies.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MovieEntity } from "./entities/movie.entity";
import { CommentEntity } from "./entities/comment.entity";
import { CsvSeederService } from "../utilities/csv-seeder.service";

@Module({
  imports: [TypeOrmModule.forFeature([MovieEntity, CommentEntity])],
  controllers: [MoviesController],
  providers: [MoviesService, CsvSeederService],
})
export class MoviesModule {}
