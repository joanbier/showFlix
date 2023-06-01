import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { IsUrl } from "class-validator";
import { CommentEntity } from "./comment.entity";

@Entity()
export class MovieEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created: Date | string;

  @Column()
  @IsUrl()
  poster_link: string;

  @Column()
  series_title: string;

  @Column()
  released_year: number;

  @Column()
  certificate: string;

  @Column()
  runtime: string;

  @Column()
  genre: string;

  @Column()
  imdb_rating: number;

  @Column({ length: 1000 })
  overview: string;

  @Column({ nullable: true })
  meta_score: string;

  @Column()
  director: string;

  @Column({ nullable: true })
  star1: string;

  @Column({ nullable: true })
  star2: string;

  @Column({ nullable: true })
  star3: string;

  @Column({ nullable: true })
  star4: string;

  @Column({ nullable: true })
  no_of_votes: number;

  @Column()
  gross: string;

  @OneToMany(() => CommentEntity, (comment) => comment.movie, {
    onDelete: "CASCADE",
    eager: true,
  })
  @JoinColumn()
  comments: CommentEntity[];
}
