const { sql } = require('@vercel/postgres');

module.exports = async function handler(request, response) {
  const { SpotifyUserID } = request.query;

  if (!SpotifyUserID) {
    return response.status(400).json({ error: 'SpotifyID is required' });
  }

  try {
    // Convert SpotifyUserID to string if it's an array
    const spotifyUserIdString = Array.isArray(SpotifyUserID) ? SpotifyUserID[0] : SpotifyUserID;

    const result = await sql`
      DELETE FROM STATIFY_DB
      WHERE SpotifyID = ${spotifyUserIdString};
    `;

    if (result.rowCount === 0) {
      return response.status(404).json({ message: 'User not found' });
    }

    return response.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    return response.status(500).json({ error });
  }
};
