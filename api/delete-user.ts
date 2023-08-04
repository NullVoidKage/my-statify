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
      DELETE FROM STATIFY_DB
      WHERE SpotifyUserName = ${SpotifyUserName};
    `;

    if (result.rows.length === 0) {
      return response.status(404).json({ message: 'User not found' });
    }

    return response.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    return response.status(500).json({ error });
  }
}
