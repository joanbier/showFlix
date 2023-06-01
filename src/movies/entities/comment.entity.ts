import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { MovieEntity } from "./movie.entity";

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
}
