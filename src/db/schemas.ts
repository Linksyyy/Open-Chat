import {
  pgTable,
  uuid,
  varchar,
  pgEnum,
  timestamp,
  char,
  text,
} from "drizzle-orm/pg-core";
import { v7 } from "uuid";
import { nanoid } from "nanoid";

export const rolesEnum = pgEnum("roles", ["guest", "admin"]);
export const notificationsTypesEnum = pgEnum("notification_type", [
  "chat_invite",
]);

export const users = pgTable("users", {
  id: uuid().primaryKey().$defaultFn(v7),
  username: varchar({ length: 255 }).unique().notNull(),
  password_hash: varchar({ length: 255 }).notNull(),
  created_at: timestamp().notNull().defaultNow(),
});

export const chats = pgTable("groups", {
  id: uuid().primaryKey().$defaultFn(v7),
  name: varchar({ length: 255 }).notNull(),
  creator_id: uuid()
    .references(() => users.id, { onDelete: "set null" })
    .notNull(),
});

export const memberships = pgTable("memberships", {
  id: uuid().primaryKey().$defaultFn(v7),
  user_id: uuid()
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  group_id: uuid()
    .references(() => chats.id, { onDelete: "cascade" })
    .notNull(),
  role: rolesEnum().default("guest"),
  entered_at: timestamp().defaultNow(),
});

export const messages = pgTable("messages", {
  // i will use NanoId here
  id: char({ length: 21 }).primaryKey().$defaultFn(nanoid),
  sender_id: uuid()
    .references(() => users.id)
    .notNull(),
  group_id: uuid()
    .references(() => chats.id, { onDelete: "cascade" })
    .notNull(),
  content: text().notNull(),
  sended_at: timestamp().defaultNow(),
});

export const notifications = pgTable("notifications", {
  id: uuid().primaryKey().$defaultFn(v7),
  sender_id: uuid()
    .references(() => users.id)
    .notNull(),
  group_id: uuid()
    .references(() => chats.id, { onDelete: "cascade" })
    .notNull(),
  type: notificationsTypesEnum().notNull(),
});
