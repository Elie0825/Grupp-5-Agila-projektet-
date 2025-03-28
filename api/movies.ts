// api/movies.ts
import { VercelRequest, VercelResponse } from '@vercel/node';
import pool from '../backend/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Aktivera CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'GET') {
    try {
      // Utför databasfrågan
      const result = await pool.query("SELECT * FROM movies");
      const movies = result.rows;
      
      console.log(`${movies.length} filmer hämtade från Neon-databasen`);
      
      // Formatera svaret som frontend förväntar sig
      return res.status(200).json({
        data: movies,
        total: movies.length
      });
    } catch (error) {
      console.error('Neon database error:', error);
      return res.status(500).json({ 
        message: "Något gick fel vid hämtning från databasen",
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}