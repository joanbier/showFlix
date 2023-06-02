import { Test, TestingModule } from "@nestjs/testing";
import { MoviesController } from "./movies.controller";
import { MoviesService } from "./movies.service";
import { MovieEntity } from "./entities/movie.entity";
import { PaginationResponse } from "../shared/interfaces/pagination-response.interface";
import { CommentEntity } from "./entities/comment.entity";
import { Repository } from "typeorm";
import { getRepositoryToken } from "@nestjs/typeorm";
import { CsvSeederService } from "../utilities/csv-seeder.service";

describe("MoviesController", () => {
  let moviesController: MoviesController;
  let moviesService: MoviesService;
  let movieRepository: Repository<MovieEntity>;
  let commentRepository: Repository<CommentEntity>;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        MoviesService,
        CsvSeederService,
        {
          provide: getRepositoryToken(MovieEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(CommentEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    moviesController = moduleRef.get<MoviesController>(MoviesController);
    moviesService = moduleRef.get<MoviesService>(MoviesService);
    movieRepository = moduleRef.get<Repository<MovieEntity>>(
      getRepositoryToken(MovieEntity),
    );
    commentRepository = moduleRef.get<Repository<CommentEntity>>(
      getRepositoryToken(CommentEntity),
    );
  });

  describe("getAllMovies", () => {
    it("should return a PaginationResponse of movies", async () => {
      const page = 1;
      const limit = 2;
      const movies: MovieEntity[] = [
        {
          id: "000b68d9-4c70-4041-a15d-e6992e2e9f19",
          created: "2023-05-31T15:55:19.000Z",
          poster_link: "https://dsfdsf.jpg",
          series_title: "Eastern Promises",
          released_year: 2007,
          certificate: "R",
          runtime: "100 min",
          genre: "Action, Crime, Drama",
          imdb_rating: 7,
          overview:
            "A teenager who dies during childbirth leaves clues in her journal that could tie her child to a rape involving a violent Russian mob family.",
          meta_score: "82",
          director: "David Cronenberg",
          star1: "Naomi Watts",
          star2: "Viggo Mortensen",
          star3: "Armin Mueller-Stahl",
          star4: "Josef Altin",
          no_of_votes: 227760,
          gross: "17,114,882",
          comments: [],
        },
        {
          id: "007df440-1e55-44a1-a4e1-a92c0a0d0c84",
          created: "2023-05-31T16:27:21.000Z",
          poster_link:
            "https://m.media-amazon.com/images/M/MV5BMTg5Mjk2NDMtZTk0Ny00YTQ0LWIzYWEtMWI5MGQ0Mjg1OTNkXkEyXkFqcGdeQXVyNzkwMjQ5NzM@.jpg",
          series_title: "Shaun of the Dead",
          released_year: 2004,
          certificate: "UA",
          runtime: "99 min",
          genre: "Comedy, Horror",
          imdb_rating: 7,
          overview:
            "A man's uneventful life is disrupted by the zombie apocalypse.",
          meta_score: "76",
          director: "Edgar Wright",
          star1: "Simon Pegg",
          star2: "Nick Frost",
          star3: "Kate Ashfield",
          star4: "Lucy Davis",
          no_of_votes: 512249,
          gross: "13,542,874",
          comments: [],
        },
      ];
      const total = 1000;
      const expectedResponse: PaginationResponse<MovieEntity> = {
        data: movies,
        page,
        limit,
        total,
        lastPage: Math.ceil(total / limit),
      };

      jest.spyOn(moviesService, "findAll").mockResolvedValue({
        data: movies,
        page,
        limit,
        total,
        lastPage: Math.ceil(total / limit),
      });

      const result = await moviesController.getAllMovies(page, limit);

      expect(result).toEqual(expectedResponse);
      expect(moviesService.findAll).toHaveBeenCalledWith(page, limit);
    });
  });
});
