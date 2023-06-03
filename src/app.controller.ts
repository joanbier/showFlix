import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import { MovieEntity } from "./movies/entities/movie.entity";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getMoviesSample(): Promise<MovieEntity[]> {
    return this.appService.getMoviesSample();
  }
}
