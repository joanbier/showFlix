import { IsNumber, IsString, IsUrl, Length } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateMovieDto {
  @ApiProperty()
  @IsUrl()
  poster_link: string;

  @ApiProperty()
  @IsString()
  series_title: string;

  @ApiProperty()
  @IsNumber()
  released_year: number;

  @ApiProperty()
  @IsString()
  certificate: string;

  @ApiProperty()
  @IsString()
  runtime: string;

  @ApiProperty()
  @IsString()
  genre: string;

  @ApiProperty()
  @IsNumber()
  imdb_rating: number;

  @ApiProperty({
    description: "Min 1 - Max 1000 signs",
  })
  @IsString()
  @Length(1, 1000)
  overview: string;

  @ApiPropertyOptional()
  @IsString()
  meta_score?: string;

  @ApiProperty()
  @IsString()
  director: string;

  @ApiPropertyOptional()
  @IsString()
  star1?: string;

  @ApiPropertyOptional()
  @IsString()
  star2?: string;

  @ApiPropertyOptional()
  @IsString()
  star3?: string;

  @ApiPropertyOptional()
  @IsString()
  star4?: string;

  @ApiPropertyOptional()
  @IsNumber()
  no_of_votes?: number;

  @ApiProperty()
  @IsString()
  gross: string;
}
