// select-user.ts
import { VercelRequest, VercelResponse } from "@vercel/node";
import { sql } from "@vercel/postgres";

export default async function getUserData(
  request: VercelRequest,
  response: VercelResponse
) {
  // Get the SpotifyUserID from the query parameters
  const { SpotifyUserID } = request.query;

  if (Array.isArray(SpotifyUserID)) {
    return response
      .status(400)
      .json({ error: "Only one SpotifyUserID should be provided" });
  }

  if (!SpotifyUserID) {
    return response.status(400).json({ error: "SpotifyUserID is required" });
  }

  try {
    const result = await sql`
      SELECT * FROM STATIFY_DB WHERE SpotifyID = ${SpotifyUserID}
    `;

    if (result.rows.length === 0) {
      return response.status(404).json({ error: 'User not found' });
    }
  
    return response.status(200).json(result.rows[0]);
  
  } catch (error) {
    return response.status(500).json({ error });
  }
}
