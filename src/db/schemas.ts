import { pgTable, uuid, varchar, pgEnum, timestamp } from "drizzle-orm/pg-core";

export const rolesEnum = pgEnum("roles", ["guest", "admin"]);
export const notificationsTypesEnum = pgEnum("notification_type", [
  "chat_invite",
]);

export const users = pgTable("users", {
  id: uuid().primaryKey(),
  username: varchar({ length: 255 }).unique().notNull(),
  password_hash: varchar({ length: 255 }).notNull(),
  created_at: timestamp().notNull().defaultNow(),
});
