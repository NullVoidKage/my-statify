import { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from '@vercel/postgres';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  const { SpotifyUserID } = request.query; // Change this line to receive the Spotify ID

  if (!SpotifyUserID) {
    return response.status(400).json({ error: 'SpotifyID is required' }); // Change the error message accordingly
  }

  try {
    // Convert SpotifyUserID to string if it's an array
    const spotifyUserIdString = Array.isArray(SpotifyUserID) ? SpotifyUserID[0] : SpotifyUserID;

    const result = await sql`
      DELETE FROM STATIFY_DB
      WHERE SpotifyID = ${spotifyUserIdString}; // Change this line to match the Spotify ID
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
