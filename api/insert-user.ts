// insert-user.ts
import { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from '@vercel/postgres';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  const { SpotifyID, SpotifyUserName } = request.body;

  if (!SpotifyID || !SpotifyUserName) {
    return response.status(400).json({ error: 'Both SpotifyID and SpotifyUserName are required' });
  }

  try {
    const result = await sql`
      INSERT INTO STATIFY_DB (SpotifyID, SpotifyUserName)
      SELECT ${SpotifyID}, ${SpotifyUserName}
      WHERE NOT EXISTS (
          SELECT 1 FROM STATIFY_DB WHERE SpotifyID = ${SpotifyID}
      );
    `;

    return response.status(200).json({ result });
  } catch (error) {
    return response.status(500).json({ error });
  }
}
