import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { MovieEntity } from "./movie.entity";
import { UserEntity } from "../../user/entities/user.entity";

@Entity()
export class CommentEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  body: string;

  @ManyToOne(() => MovieEntity, (movie) => movie.comments, {
    onDelete: "CASCADE",
  })
  movie: MovieEntity;

  @ManyToOne(() => UserEntity, (user) => user.comments)
  user: UserEntity;
}
