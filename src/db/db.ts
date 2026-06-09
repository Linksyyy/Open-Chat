import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import * as schema from "./schemas";

const client = new Client({ connectionString: process.env.DATABASE_URL });
await client.connect();

export default drizzle({ client, schema });
