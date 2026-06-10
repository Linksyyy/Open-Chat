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

export async function find_user_by_username(username: string) {
  const res = await db
    .select()
    .from(schemas.users)
    .where(eq(schemas.users.username, username));
  return res[0];
}
