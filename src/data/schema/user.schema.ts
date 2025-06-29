import { pgTable, serial, varchar, timestamp, text } from "drizzle-orm/pg-core";

export const users = pgTable("Users", {
  user_id: serial("user_id").primaryKey(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  password_hash: varchar("password_hash", { length: 255 }).notNull(),
  first_name: varchar("first_name", { length: 50 }),
  last_name: varchar("last_name", { length: 50 }),
  phone_number: varchar("phone_number", { length: 20 }),
  address_line1: varchar("address_line1", { length: 100 }),
  address_line2: varchar("address_line2", { length: 100 }),
  city: varchar("city", { length: 50 }),
  state_province: varchar("state_province", { length: 50 }),
  postal_code: varchar("postal_code", { length: 10 }),
  country: varchar("country", { length: 50 }),
  registration_date: timestamp("registration_date").defaultNow().notNull(),
  last_login: timestamp("last_login"),
  user_type: varchar("user_type", { length: 10 }).default("customer").notNull()
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
