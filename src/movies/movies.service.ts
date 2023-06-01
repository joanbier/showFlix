import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { MovieEntity } from "./entities/movie.entity";
import { DeleteResult, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { PaginationResponse } from "../shared/interfaces/pagination-response.interface";
import { CommentEntity } from "./entities/comment.entity";
import { MovieRO } from "./movies.interface";
import { CreateMovieDto } from "./dto/creat-movie.dto";

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(MovieEntity)
    private readonly movieRepository: Repository<MovieEntity>,
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
  ) {}

  async findAll(
    page: number,
    limit: number,
  ): Promise<PaginationResponse<MovieEntity>> {
    const [movies, total] = await this.movieRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: ["comments"],
    });

    return {
      data: movies,
      page,
      limit,
      total,
      lastPage: Math.ceil(total / limit),
    };
  }

  async query(params): Promise<PaginationResponse<MovieEntity>> {
    const page = params.page ? +params.page : 1;
    const limit = params.limit ? +params.limit : 10;
    delete params.page;
    delete params.limit;
    const qB = this.movieRepository.createQueryBuilder("movieEntity");

    const loopParams = () => {
      for (let paramName in params) {
        const value = params[paramName];

        switch (paramName) {
          case "series_title":
          case "overview":
          case "genre":
          case "director":
          case "star1":
          case "star2":
          case "star3":
          case "star4":
            qB.andWhere(`movieEntity.${paramName} LIKE :${paramName}`, {
              [paramName]: `%${value}%`,
            });
            break;
          case "imdb_rating":
          case "created":
          case "poster_link":
          case "certificate":
          case "runtime":
          case "released_year":
            qB.andWhere(`movieEntity.${paramName} = :${paramName}`, {
              [paramName]: value,
            });
            break;
          case "released_year_min":
            qB.andWhere(
              `movieEntity.released_year BETWEEN :minVal AND :maxVal`,
              {
                minVal: value,
                maxVal: params["released_year_max"] ?? new Date().getFullYear(),
              },
            );
            break;
          case "imdb_rating_min":
            qB.andWhere(`movieEntity.imdb_rating >= :minValue`, {
              minValue: value,
            });
            break;
          case "released_year_max":
            if (!("released_year_min" in params)) {
              qB.andWhere(`movieEntity.released_year <= :maxValue`, {
                maxValue: value,
              });
            }
            break;
          default:
            throw new Error(`Invalid parameter: ${paramName}`);
        }
      }
    };

    loopParams();
    const [movies, total] = await qB
      .leftJoinAndSelect("movieEntity.comments", "comments")
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data: movies,
      page,
      limit,
      total,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<MovieRO> {
    const movie = await this.movieRepository.findOne({
      where: { id },
      relations: ["comments"],
    });
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
    return { movie };
  }

  async createMovie(movieData: CreateMovieDto): Promise<MovieRO> {
    const movie = new MovieEntity();
    movie.poster_link = movieData.poster_link;
    movie.series_title = movieData.series_title;
    movie.released_year = movieData.released_year;
    movie.certificate = movieData.certificate;
    movie.runtime = movieData.runtime;
    movie.genre = movieData.genre;
    movie.overview = movieData.overview;
    movie.imdb_rating = movieData.imdb_rating;
    movie.meta_score = movieData.meta_score;
    movie.director = movieData.director;
    movie.star1 = movieData.star1;
    movie.star2 = movieData.star2;
    movie.star3 = movieData.star3;
    movie.star4 = movieData.star4;
    movie.no_of_votes = movieData.no_of_votes;
    movie.gross = movieData.gross;

    const newMovie = await this.movieRepository.save(movie);

    return { movie: newMovie };
  }

  async updateMovie(id: string, movieData: CreateMovieDto): Promise<MovieRO> {
    let toUpdate = await this.movieRepository.findOneBy({ id: id });
    if (!toUpdate) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
    let updated = Object.assign(toUpdate, movieData);
    const movie = await this.movieRepository.save(updated);
    return { movie };
  }

  async deleteMovie(id): Promise<DeleteResult> {
    const movie = await this.movieRepository.findOne({
      where: { id },
      relations: ["comments"],
    });
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
    return await this.movieRepository.delete(id);
  }

  async createComment(movieId: string, commentData): Promise<MovieRO> {
    let movie = await this.movieRepository.findOneBy({ id: movieId });

    if (!movie) {
      throw new NotFoundException(`Movie with ID ${movieId} not found`);
    }

    const comment = new CommentEntity();
    comment.body = commentData;

    movie.comments.push(comment);

    await this.commentRepository.save(comment);
    movie = await this.movieRepository.save(movie);
    return { movie };
  }

  async deleteComment(movieId: string, commentId: string): Promise<MovieRO> {
    let movie = await this.movieRepository.findOneBy({ id: movieId });
    const comment = await this.commentRepository.findOneBy({ id: commentId });

    if (!comment || !movie) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: "comment or movie not found",
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const deleteIndex = movie.comments.findIndex(
      (item) => item.id === comment.id,
    );

    if (deleteIndex >= 0) {
      const deleteComments = movie.comments.splice(deleteIndex, 1);
      console.log(deleteComments);
      await this.commentRepository.delete(deleteComments[0].id);
      movie = await this.movieRepository.save(movie);
      return { movie };
    } else {
      return { movie };
    }
  }
}
