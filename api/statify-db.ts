import { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from '@vercel/postgres';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS STATIFY_DB (
        id SERIAL PRIMARY KEY,
        SpotifyUserName varchar(255),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    return response.status(200).json({ message: 'Table created or already exists' });
  } catch (error) {
    return response.status(500).json({ error });
  }
}
