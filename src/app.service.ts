import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MovieEntity } from "./movies/entities/movie.entity";
import { Repository } from "typeorm";

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(MovieEntity)
    private readonly movieRepository: Repository<MovieEntity>,
  ) {}
  async getMoviesSample(): Promise<MovieEntity[]> {
    return this.movieRepository
      .createQueryBuilder()
      .select()
      .orderBy("RAND()")
      .limit(10)
      .getMany();
  }
}
