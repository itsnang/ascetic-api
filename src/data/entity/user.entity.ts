import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "user" })
class UserEntity {
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;

  @Column({ type: "text", nullable: false })
  name: string;

  @Column({ type: "date", nullable: false })
  dob: Date;

  @Column({ type: "int", nullable: false })
  age: number;

  @Column({ type: "text", nullable: false })
  phone_number: string;

  @Column({ type: "text", nullable: false })
  password: string;

  @Column({ type: "text", nullable: false })
  email: string;
}

export default UserEntity;
