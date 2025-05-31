// src/entity/User.ts
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("Users")
export class UserEntity {
  @PrimaryGeneratedColumn() // Marks user_id as a primary key and auto-increments
  user_id!: number; // Using '!' for definite assignment assertion

  @Column({ type: "varchar", length: 50, unique: true, nullable: false })
  username!: string;

  @Column({ type: "varchar", length: 100, unique: true, nullable: false })
  email!: string;

  @Column({ type: "varchar", length: 255, nullable: false })
  password_hash!: string;

  @Column({ type: "varchar", length: 50, nullable: true }) // nullable: true is default, but explicit is good
  first_name?: string; // Using '?' for optional properties

  @Column({ type: "varchar", length: 50, nullable: true })
  last_name?: string;

  @Column({ type: "varchar", length: 20, nullable: true })
  phone_number?: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  address_line1?: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  address_line2?: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  city?: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  state_province?: string;

  @Column({ type: "varchar", length: 10, nullable: true })
  postal_code?: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  country?: string;

  // @CreateDateColumn() automatically sets the creation timestamp
  // You might need to adjust the column name if it differs from 'registration_date'
  // For exact column name matching, use @Column with default: () => "CURRENT_TIMESTAMP"
  @Column({
    type: "datetime",
    default: () => "CURRENT_TIMESTAMP",
    name: "registration_date"
  })
  registration_date!: Date;

  @Column({ type: "datetime", nullable: true })
  last_login?: Date;

  @Column({ type: "varchar", length: 10, default: "customer" })
  user_type!: "customer" | "admin"; // Type safety for ENUM-like values
}
