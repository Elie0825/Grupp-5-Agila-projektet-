import { Pool } from 'pg';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Skapa en ny databas-pool baserat på miljövariabeln från Vercel
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // krävs för Neon
  }
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const client = await pool.connect();

    const result = await client.query("SELECT * FROM movies");

    client.release();
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Neon database error:", err);
    res.status(500).json({ error: "Failed to fetch data from database" });
  }
}
