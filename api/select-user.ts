// select-user.ts
import { VercelRequest, VercelResponse } from "@vercel/node";
import { sql } from "@vercel/postgres";

export default async function getUserData(
  request: VercelRequest,
  response: VercelResponse
) {
  // You can change this to request.body if you send the data in the request body
  const { SpotifyUserName } = request.query;

  if (Array.isArray(SpotifyUserName)) {
    return response
      .status(400)
      .json({ error: "Only one SpotifyUserName should be provided" });
  }

  if (!SpotifyUserName) {
    return response.status(400).json({ error: "SpotifyUserName is required" });
  }

  // ... rest of your code ...

  try {
    const result = await sql`
  SELECT SpotifyID, SpotifyUserName FROM STATIFY_DB WHERE SpotifyUserName = ${SpotifyUserName}
`;

  console.log(result)
  
  if (result.rows.length === 0) {
    return response.status(404).json({ error: 'User not found' });
  }
  
  return response.status(200).json(result.rows[0]);
  
  } catch (error) {
    return response.status(500).json({ error });
  }
}
