import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IsEmail } from "class-validator";
import * as argon2 from "argon2";
import { UserRole } from "../auth/user-role.enum";

@Entity("user")
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.User,
  })
  role: UserRole;

  @Column()
  username: string;

  @Column()
  @IsEmail()
  email: string;

  @Column({ default: "" })
  image: string;

  @Column()
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await argon2.hash(this.password);
  }
}
