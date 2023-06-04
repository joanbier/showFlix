import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { MoviesService } from "./movies.service";
import { PaginationResponse } from "../shared/interfaces/pagination-response.interface";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { MovieEntity } from "./entities/movie.entity";
import { CreateMovieDto } from "./dto/creat-movie.dto";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { MovieRO } from "./movies.interface";
import { CsvSeederService } from "../utilities/csv-seeder.service";
import { Roles } from "../user/auth/roles-decorator";
import { UserRole } from "../user/auth/user-role.enum";
import { RolesGuard } from "../user/auth/roles.guard";
import { User } from "../user/auth/user.decorator";

@Controller("movies")
@ApiTags("movies")
export class MoviesController {
  constructor(
    private moviesService: MoviesService,
    private csvSeederService: CsvSeederService,
  ) {
    // this.csvSeederService
    //   .seedFromCsv("./src/utilities/imdb_top_1000.csv")
    //   .then(() => console.log("imported csv to database!"));
  }

  @Get()
  @ApiOperation({ summary: "Get all movies in pagination" })
  @ApiResponse({
    status: 200,
  })
  async getAllMovies(
    @Query("page") page = 1,
    @Query("limit") limit = 10,
  ): Promise<PaginationResponse<MovieEntity>> {
    return await this.moviesService.findAll(page, limit);
  }

  @Get("/query")
  @ApiOperation({
    summary: "Get filtered movies in pagination",
    description: `Allowed params: \n
    a) flexible query: "series_title", "overview", "genre", "director", "star1", "star2", "star3","star4"
    b) strict query: "imdb_rating", "created", "poster_link", "certificate", "runtime", "released_year",
    c) to get range use: "released_year_min" and "released_year_max" at once
    d) to get data from minimum value: "released_year_min", "imdb_rating_min"
    `,
  })
  @ApiQuery({
    name: "series_title",
    description: "Title query parameter",
    required: false,
    examples: {
      example1: {
        summary: "get movies contains 'the' in the title",
        value: "The",
      },
    },
  })
  @ApiQuery({
    name: "genre",
    description: "Genre query parameter",
    required: false,
    examples: {
      example1: {
        summary: "get horrors",
        value: "horror",
      },
      example2: {
        summary: "get comedies",
        value: "comedy",
      },
    },
  })
  @ApiQuery({
    name: "released_year_min",
    description: "released_year_min query parameter",
    required: false,
    examples: {
      example1: {
        summary: "get movies from & after 1969",
        value: "1969",
      },
      example2: {
        summary: "get movies from & after 1995",
        value: "1995",
      },
    },
  })
  @ApiQuery({
    name: "released_year_max",
    description: "released_year_max query parameter",
    required: false,
    examples: {
      example1: {
        summary: "get movies to 1999",
        value: "1999",
      },
      example2: {
        summary: "get movies to 2005",
        value: "2005",
      },
    },
  })
  @ApiResponse({
    status: 200,
    type: MovieEntity,
  })
  async getFilteredMovies(
    @Query() query,
  ): Promise<PaginationResponse<MovieEntity>> {
    return await this.moviesService.query(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get one movie by id" })
  @ApiResponse({
    status: 200,
    type: MovieEntity,
  })
  async findOne(@Param() param): Promise<MovieRO> {
    return await this.moviesService.findOne(param.id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.Admin)
  @ApiCreatedResponse({ description: "Created Succesfully" })
  @ApiOperation({ summary: "create a movie" })
  async createMovie(@Body() movieData: CreateMovieDto): Promise<MovieRO> {
    return await this.moviesService.createMovie(movieData);
  }

  @ApiOperation({ summary: "Update movie" })
  @ApiResponse({
    status: 201,
    description: "The movie has been successfully updated.",
  })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @UseGuards(RolesGuard)
  @Roles(UserRole.Admin)
  @Put(":id")
  async updateMovie(@Param() params, @Body() movieData: CreateMovieDto) {
    return this.moviesService.updateMovie(params.id, movieData);
  }

  @ApiOperation({ summary: "Delete movie" })
  @ApiResponse({
    status: 201,
    description: "The movie has been successfully deleted.",
  })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @UseGuards(RolesGuard)
  @Roles(UserRole.Admin)
  @Delete(":id")
  async deleteMovie(@Param() params) {
    return this.moviesService.deleteMovie(params.id);
  }

  @Post(":id/comments")
  @ApiOperation({ summary: "Add a comment to the movie" })
  @ApiResponse({ status: 200, description: "comment has been added" })
  @ApiResponse({ status: 404, description: "content of comment is required." })
  @ApiBearerAuth()
  async addComment(
    @Param("id") movieId,
    @User("id") userId: string,
    @Body("comment") commentData: CreateCommentDto,
  ): Promise<string> {
    if (!commentData) {
      throw new NotFoundException(`content of comment is required`);
    }
    return await this.moviesService.createComment(movieId, commentData, userId);
  }

  @Delete(":movieId/comments/:commentId")
  @ApiOperation({ summary: "Delete comment" })
  @ApiResponse({
    status: 201,
    description: "The comment from the movie has been successfully deleted.",
  })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @ApiBearerAuth()
  async deleteComment(@Param() params) {
    const { movieId, commentId } = params;
    return await this.moviesService.deleteComment(movieId, commentId);
  }
}
