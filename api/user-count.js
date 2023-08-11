const { sql } = require('@vercel/postgres');

module.exports = async function getUserData(request, response) {
  try {
    const result = await sql`
      SELECT COUNT(*) FROM STATIFY_DB
    `;

    const totalCount = parseInt(result.rows[0].count, 10);

    return response.status(200).json({ totalCount });
  
  } catch (error) {
    return response.status(500).json({ error });
  }
};
