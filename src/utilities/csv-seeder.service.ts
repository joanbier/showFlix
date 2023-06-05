import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MovieEntity } from "../movies/entities/movie.entity";
import { Repository } from "typeorm";
import { parse as csvParse } from "csv-parse";
import * as fs from "fs";
import { CommentEntity } from "../movies/entities/comment.entity";
import { UserEntity } from "../user/entities/user.entity";

@Injectable()
export class CsvSeederService {
  constructor(
    @InjectRepository(MovieEntity)
    private readonly moviesEntityRepository: Repository<MovieEntity>,
    @InjectRepository(CommentEntity)
    private readonly commentEntityRepository: Repository<CommentEntity>,
    @InjectRepository(UserEntity)
    private readonly userEntityRepository: Repository<UserEntity>,
  ) {}

  async seedFromCsv(filePath: string): Promise<void> {
    // await this.commentEntityRepository.delete({});
    // await this.moviesEntityRepository.delete({});
    // await this.userEntityRepository.delete({});

    const parser = csvParse({
      columns: true,
      delimiter: ",",
      trim: true,
    });

    const input = fs.createReadStream(filePath);

    const records: any[] = [];

    parser.on("readable", () => {
      let record;
      while ((record = parser.read())) {
        records.push(record);
      }
    });

    parser.on("end", async () => {
      for (const data of records) {
        const movie = new MovieEntity();
        movie.poster_link = data.Poster_Link;
        movie.series_title = data.Series_Title;
        movie.released_year = data.Released_Year;
        movie.certificate = data.Certificate;
        movie.runtime = data.Runtime;
        movie.genre = data.Genre;
        movie.imdb_rating = data.IMDB_Rating;
        movie.overview = data.Overview;
        movie.meta_score = data.Meta_score;
        movie.director = data.Director;
        movie.star1 = data.Star1;
        movie.star2 = data.Star2;
        movie.star3 = data.Star3;
        movie.star4 = data.Star4;
        movie.no_of_votes = data.No_of_Votes;
        movie.gross = data.Gross;
        movie.comments = null;

        await this.moviesEntityRepository.save(movie);
      }
    });

    input.pipe(parser);
  }
}
