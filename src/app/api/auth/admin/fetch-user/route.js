import { User } from '../../../../../models/User'; // Adjust path as necessary
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../[...nextauth]/options"; 

export async function GET(req) {
  try {
    // Extract the session from the request using the provided context
    const session = await getServerSession({ req, authOptions });

    if (!session) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const users = await User.find({ role: 'User' });

    return new Response(JSON.stringify(users), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    
    return new Response(JSON.stringify({ message: 'Internal server error', error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
