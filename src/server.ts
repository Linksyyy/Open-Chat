import { createServer } from "http";
import cookie from "cookie";
import next from "next";
import { Server } from "socket.io";
import * as db from "@/db/queries";
// import { jwtVerify } from "jose";

const socketsMap = new Map();

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(async () => {
  const server = createServer((req, res) => {
    handle(req, res);
  });

  const io = new Server(server);
  io.use(async (socket, next) => {
    try {
      const cookies = socket.handshake.headers.cookie;
      if (cookies) {
        const token = cookie.parse(cookies)["auth-token"];
        if (token) {
          // const secret = new TextEncoder().encode(process.env.JWT_SECRET);
          // const { payload } = await jwtVerify(token, secret);
          // (socket as any).userId = String(payload.userId);
        }
      }
    } catch (e) {
      console.error(e);
    }
    next();
  });

  io.on("connection", async (socket) => {
    const userId = socket.handshake.auth.userId;
    if (!userId) {
      console.error("Connection attempt without userId");
      socket.disconnect();
      return;
    }

    const user = await db.find_user_by_id(userId);
    if (!user) {
      console.error(`User not found for ID: ${userId}`);
      socket.disconnect();
      return;
    }

    console.log(`The user ${user.username} connected`);
    socketsMap.set(user.id, socket.id);

    const userChats = await db.find_user_chats(user.id);
    socket.emit("init", userChats);

    const notifications = await db.find_user_notifications(user.id);
    socket.emit("notifications", notifications);

    socket.on("create-group", async (groupName: string) => {
      const group = await db.create_group(groupName, user.id);
      const chat = await db.find_chat_by_id(group.id);
      socket.emit("group-created", chat);
    });

    socket.on("send-invite", async ({ chatId, username }) => {
      const role = await db.get_user_role_in_chat(chatId, user.id);
      if (role !== "admin") {
        console.log(`User ${user.username} tried to invite without permission`);
        return;
      }

      const receiver = await db.find_user_by_username(username);
      if (!receiver) return;

      const notification = await db.create_notification(
        user.id,
        chatId,
        receiver.id,
        "chat_invite",
      );

      const notificationWithDetails = (
        await db.find_user_notifications(receiver.id)
      ).find((n) => n.id === notification.id);

      const receiverSocketId = socketsMap.get(receiver.id);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("new-notification", notificationWithDetails);
      }
    });

    socket.on("accept-invite", async (notificationId: string) => {
      const notifications = await db.find_user_notifications(user.id);
      const notification = notifications.find((n) => n.id === notificationId);

      if (!notification) return;

      await db.add_chat_member(notification.chat_id, user.id);
      await db.delete_notification(notificationId);

      const chat = await db.find_chat_by_id(notification.chat_id);
      socket.emit("group-created", chat);
      socket.emit("notification-deleted", notificationId);
    });

    socket.on("decline-invite", async (notificationId: string) => {
      await db.delete_notification(notificationId);
      socket.emit("notification-deleted", notificationId);
    });

    socket.on("get-chat-messages", async (chatId: string) => {
      const messages = await db.find_messages_by_id(chatId);
      socket.emit("chat-messages", messages);
    });

    socket.on("join-chat", (chatId) => {
      socket.join(chatId);
      console.log(`User ${user.username} joined chat ${chatId}`);
    });

    socket.on("send-message", async (chatId, content) => {
      console.log(chatId, content);
      const createdMessage = await db.create_message(user.id, chatId, content);
      const messageWithSender = await db.find_message_by_id(createdMessage.id);
      io.to(chatId).emit("message-sended", messageWithSender);
    });
  });
  const port = process.env.PORT || 3000;
  const host = "0.0.0.0";

  server.listen({ port, host }, () => {
    console.log(`> Server listening on port ${port}`);
  });
});
