import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { DeleteResult, Repository } from "typeorm";
import { UserRO } from "./user.interface";
import { validate } from "class-validator";
import { SECRET } from "../config";
import { LoginUserDto } from "./dto/login-user.dto";
const jwt = require("jsonwebtoken");
import * as argon2 from "argon2";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(userData: CreateUserDto): Promise<UserRO> {
    // check uniqueness of username/email
    const { username, email, password } = userData;

    const qB = this.userRepository.createQueryBuilder("user");

    qB.where("user.username = :username", { username }).orWhere(
      "user.email = :email",
      { email },
    );

    const user = await qB.getOne();

    if (user) {
      const errors = { username: "Username and email must be unique." };
      throw new HttpException(
        { message: "Input data validation failed", errors },
        HttpStatus.BAD_REQUEST,
      );
    }

    // create new user
    let newUser = new UserEntity();
    newUser.username = username;
    newUser.email = email;
    newUser.password = password;

    const errors = await validate(newUser);
    if (errors.length > 0) {
      const _errors = { username: "Userinput is not valid." };
      throw new HttpException(
        { message: "Input data validation failed", _errors },
        HttpStatus.BAD_REQUEST,
      );
    } else {
      const savedUser = await this.userRepository.save(newUser);
      return this.buildUserRO(savedUser);
    }
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  async findOne({ email, password }: LoginUserDto): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ email });
    console.log(user);
    if (!user) {
      return null;
    }

    if (await argon2.verify(user.password, password)) {
      return user;
    } else {
      throw new HttpException("incorrect password", 401);
    }
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserEntity> {
    let toUpdate = await this.userRepository.findOneBy({ id });
    delete toUpdate.password;

    const allowedProperties = ["username", "email", "image"];
    const reducedDto = Object.keys(dto)
      .filter((key) => allowedProperties.includes(key))
      .reduce((obj, key) => {
        obj[key] = dto[key];
        return obj;
      }, {});

    let updated = Object.assign(toUpdate, reducedDto);
    return await this.userRepository.save(updated);
  }

  async delete(email: string): Promise<DeleteResult> {
    return await this.userRepository.delete({ email: email });
  }

  async findById(id: string): Promise<UserRO> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      const errors = { User: " not found" };
      throw new HttpException({ errors }, 401);
    }

    return this.buildUserRO(user);
  }

  async findByEmail(email: string): Promise<UserRO> {
    const user = await this.userRepository.findOneBy({ email: email });
    return this.buildUserRO(user);
  }

  public generateJWT(user) {
    let today = new Date();
    let exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        exp: exp.getTime() / 1000,
      },
      SECRET,
    );
  }

  private buildUserRO(user: UserEntity) {
    const userRO = {
      id: user.id,
      username: user.username,
      email: user.email,
      token: this.generateJWT(user),
      image: user.image,
      role: user.role,
    };

    return { user: userRO };
  }
}
