import {
  BeforeInsert,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { IsEmail } from "class-validator";
import * as argon2 from "argon2";
import { UserRole } from "../auth/user-role.enum";
import { MovieEntity } from "../../movies/entities/movie.entity";
import { CommentEntity } from "../../movies/entities/comment.entity";

@Entity("user")
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  username: string;

  @Column()
  @IsEmail()
  email: string;

  @Column()
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await argon2.hash(this.password);
  }

  @Column({ default: "" })
  image: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.User,
  })
  role: UserRole;

  @ManyToMany(() => MovieEntity, {
    eager: true,
    onDelete: "CASCADE",
  })
  @JoinTable()
  favoriteMovies: MovieEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.user)
  comments: CommentEntity[];
}
