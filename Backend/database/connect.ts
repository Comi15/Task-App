import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

export const connectToDb = async () => {
  try {
    const client = await pool.connect();
    if (!client) {
      throw new Error("Unable to connect to the db");
    }
    return client;
  } catch (err:any) {
    return null;
  }
};
