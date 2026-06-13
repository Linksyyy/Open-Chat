import { eq } from "drizzle-orm";
import db from "./db";
import * as schemas from "./schemas";

//All db queries will named as snake_case

export async function create_user(username: string, password_hash: string) {
  return await db
    .insert(schemas.users)
    .values({ username, password_hash })
    .returning();
}

export async function create_group(name: string, creator_id: string) {
  const group = (
    await db.insert(schemas.chats).values({ name, creator_id }).returning()
  )[0];
  await db.insert(schemas.memberships).values({
    user_id: creator_id,
    chat_id: group.id,
  });
  return group;
}

export async function create_message(
  sender_id: string,
  chat_id: string,
  content: string,
) {
  return (
    await db
      .insert(schemas.messages)
      .values({ sender_id, chat_id, content })
      .returning()
  )[0];
}

export async function find_user_by_username(username: string) {
  const res = await db
    .select()
    .from(schemas.users)
    .where(eq(schemas.users.username, username));
  return res[0];
}

export async function find_user_by_id(id: string) {
  const res = await db
    .select()
    .from(schemas.users)
    .where(eq(schemas.users.id, id));
  return res[0];
}

export async function find_chat_by_id(group_id: string) {
  return await db.query.chats.findFirst({
    where: eq(schemas.chats.id, group_id),
    with: {
      memberships: {
        with: {
          user: true,
        },
      },
    },
  });
}

export async function find_user_chats(user_id: string) {
  const memberships = await db.query.memberships.findMany({
    where: eq(schemas.memberships.user_id, user_id),
    with: {
      chat: {
        with: {
          memberships: {
            with: {
              user: true,
            },
          },
        },
      },
    },
  });
  return memberships.map((m) => m.chat);
}

export async function find_messages_by_id(chat_id: string) {
  return await db.query.messages.findMany({
    where: eq(schemas.messages.chat_id, chat_id),
    with: {
      sender: {
        columns: {
          id: true,
          username: true,
        },
      },
    },
    orderBy: (messages, { asc }) => [asc(messages.created_at)],
  });
}

export async function create_notification(
  sender_id: string,
  chat_id: string,
  receiver_id: string,
  type: (typeof schemas.notificationsTypesEnum.enumValues)[number],
) {
  return (
    await db
      .insert(schemas.notifications)
      .values({ sender_id, chat_id, receiver_id, type })
      .returning()
  )[0];
}

export async function find_user_notifications(user_id: string) {
  return await db.query.notifications.findMany({
    where: eq(schemas.notifications.receiver_id, user_id),
    with: {
      sender: {
        columns: {
          id: true,
          username: true,
        },
      },
      chat: {
        columns: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: (n, { desc }) => [desc(n.created_at)],
  });
}

export async function delete_notification(notification_id: string) {
  return await db
    .delete(schemas.notifications)
    .where(eq(schemas.notifications.id, notification_id));
}

export async function add_chat_member(chat_id: string, user_id: string) {
  return await db.insert(schemas.memberships).values({
    chat_id,
    user_id,
    role: "guest",
  });
}

export async function get_user_role_in_chat(chat_id: string, user_id: string) {
  const membership = await db.query.memberships.findFirst({
    where: (m, { and, eq }) => and(eq(m.chat_id, chat_id), eq(m.user_id, user_id)),
  });
  
  if (!membership) return null;

  const chat = await db.query.chats.findFirst({
    where: eq(schemas.chats.id, chat_id),
  });

  if (chat?.creator_id === user_id) return "admin";
  
  return membership.role;
}

export type ChatWithMembers = NonNullable<
  Awaited<ReturnType<typeof find_chat_by_id>>
>;
export type Message = typeof schemas.messages.$inferSelect;
export type NotificationWithDetails = Awaited<
  ReturnType<typeof find_user_notifications>
>[number];
