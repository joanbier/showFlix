import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UsePipes,
  Put,
  HttpException,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UserRO } from "./user.interface";
import { User } from "./user.decorator";
import { ValidationPipe } from "../shared/pipes/validation.pipe";
import { LoginUserDto } from "./dto/login-user.dto";

@ApiBearerAuth()
@ApiTags("user")
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findMe(@User("email") email: string): Promise<UserRO> {
    return await this.userService.findByEmail(email);
  }

  @Put()
  async update(
    @User("id") userId: string,
    @Body("user") userData: UpdateUserDto,
  ) {
    return await this.userService.update(userId, userData);
  }

  @UsePipes(new ValidationPipe())
  @Post()
  async create(@Body("user") userData: CreateUserDto) {
    return this.userService.create(userData);
  }

  @Delete("/:id")
  async delete(@Param() params) {
    return await this.userService.delete(params.id);
  }

  @UsePipes(new ValidationPipe())
  @Post("/login")
  async login(@Body("user") loginUserDto: LoginUserDto): Promise<UserRO> {
    console.log(loginUserDto);
    const _user = await this.userService.findOne(loginUserDto);

    const errors = { User: " not found" };
    if (!_user) throw new HttpException({ errors }, 401);

    const token = await this.userService.generateJWT(_user);
    const { email, username, image } = _user;
    const user = { email, token, username, image };
    return { user };
  }
}
