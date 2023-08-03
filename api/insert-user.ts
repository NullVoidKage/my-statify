// insert-user.ts
import { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from '@vercel/postgres';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  const { SpotifyUserName } = request.body;

  if (!SpotifyUserName) {
    return response.status(400).json({ error: 'SpotifyUserName is required' });
  }

  try {
    const result = await sql`
      INSERT INTO STATIFY_DB (SpotifyUserName)
      SELECT ${SpotifyUserName}
      WHERE NOT EXISTS (
          SELECT 1 FROM STATIFY_DB WHERE SpotifyUserName = ${SpotifyUserName}
      );
    `;

    return response.status(200).json({ result });
  } catch (error) {
    return response.status(500).json({ error });
  }
}
