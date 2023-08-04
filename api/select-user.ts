// select-user.ts
import { VercelRequest, VercelResponse } from "@vercel/node";
import { sql } from "@vercel/postgres";

export default async function getUserData(
  request: VercelRequest,
  response: VercelResponse
) {
  // You can change this to request.body if you send the data in the request body
  const { SpotifyID } = request.query;

  if (Array.isArray(SpotifyID)) {
    return response
      .status(400)
      .json({ error: "Only one SpotifyID should be provided" });
  }

  if (!SpotifyID) {
    return response.status(400).json({ error: "SpotifyID is required" });
  }

  try {
    const result = await sql`
      SELECT * FROM STATIFY_DB WHERE SpotifyID = ${SpotifyID}
    `;

    if (result.rows.length === 0) {
      return response.status(404).json({ error: 'User not found' });
    }
  
    return response.status(200).json(result.rows[0]);
  
  } catch (error) {
    return response.status(500).json({ error });
  }
}
