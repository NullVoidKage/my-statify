import { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from '@vercel/postgres';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  const { SpotifyID } = request.body; // Change this line to receive the Spotify ID

  if (!SpotifyID) {
    return response.status(400).json({ error: 'SpotifyID is required' }); // Change the error message accordingly
  }

  try {
    const result = await sql`
      DELETE FROM STATIFY_DB
      WHERE SpotifyID = ${SpotifyID}; // Change this line to match the Spotify ID
    `;

    // Check the number of affected rows to determine if the deletion was successful
    if (result.rows.length === 0) {
      return response.status(404).json({ message: 'User not found' });
    }

    return response.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    return response.status(500).json({ error });
  }
}
