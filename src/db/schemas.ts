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
import { relations } from "drizzle-orm";

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

export const usersRelations = relations(users, ({ many }) => ({
  memberships: many(memberships),
  messages: many(messages),
  createdChats: many(chats),
  notifications: many(notifications),
}));

export const chats = pgTable("chats", {
  id: uuid().primaryKey().$defaultFn(v7),
  name: varchar({ length: 255 }).notNull(),
  creator_id: uuid()
    .references(() => users.id, { onDelete: "set null" })
    .notNull(),
  created_at: timestamp().notNull().defaultNow(),
});

export const chatsRelations = relations(chats, ({ one, many }) => ({
  creator: one(users, {
    fields: [chats.creator_id],
    references: [users.id],
  }),
  memberships: many(memberships),
  messages: many(messages),
  notifications: many(notifications),
}));

export const memberships = pgTable("memberships", {
  id: uuid().primaryKey().$defaultFn(v7),
  user_id: uuid()
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  chat_id: uuid()
    .references(() => chats.id, { onDelete: "cascade" })
    .notNull(),
  role: rolesEnum().default("guest"),
  entered_at: timestamp().defaultNow(),
});

export const membershipsRelations = relations(memberships, ({ one }) => ({
  user: one(users, {
    fields: [memberships.user_id],
    references: [users.id],
  }),
  chat: one(chats, {
    fields: [memberships.chat_id],
    references: [chats.id],
  }),
}));

export const messages = pgTable("messages", {
  id: char({ length: 21 }).primaryKey().$defaultFn(nanoid),
  sender_id: uuid()
    .references(() => users.id)
    .notNull(),
  chat_id: uuid()
    .references(() => chats.id, { onDelete: "cascade" })
    .notNull(),
  content: text().notNull(),
  created_at: timestamp().defaultNow(),
});

export const messagesRelations = relations(messages, ({ one }) => ({
  sender: one(users, {
    fields: [messages.sender_id],
    references: [users.id],
  }),
  chat: one(chats, {
    fields: [messages.chat_id],
    references: [chats.id],
  }),
}));

export const notifications = pgTable("notifications", {
  id: uuid().primaryKey().$defaultFn(v7),
  sender_id: uuid()
    .references(() => users.id)
    .notNull(),
  chat_id: uuid()
    .references(() => chats.id, { onDelete: "cascade" })
    .notNull(),
  type: notificationsTypesEnum().notNull(),
});

export const notificationsRelations = relations(notifications, ({ one }) => ({
  sender: one(users, {
    fields: [notifications.sender_id],
    references: [users.id],
  }),
  chat: one(chats, {
    fields: [notifications.chat_id],
    references: [chats.id],
  }),
}));
