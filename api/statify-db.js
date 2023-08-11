const { sql } = require('@vercel/postgres');

module.exports = async function handler(request, response) {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS STATIFY_DB (
        id SERIAL PRIMARY KEY,
        SpotifyID varchar(255) UNIQUE NOT NULL,
        SpotifyUserName varchar(255),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    return response.status(200).json({ message: 'Table created or already exists' });
  } catch (error) {
    return response.status(500).json({ error });
  }
};
