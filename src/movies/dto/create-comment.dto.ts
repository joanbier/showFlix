import { IsString, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCommentDto {
  @ApiProperty()
  @IsString()
  @Length(1, 500)
  readonly body: string;
}
