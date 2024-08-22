// path: api/auth/folders/route.js
import { connect } from '../../../../database/mongo.config';
import Sticker from '../../../../models/fetchImage';

// Handle GET request
export async function GET(req) {
  await connect();

  try {
    const folders = await Sticker.distinct('folder');
    return new Response(JSON.stringify({ folders }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching titles:', error.message); // More detailed error
    return new Response(
      JSON.stringify({ error: 'Failed to fetch titles' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
