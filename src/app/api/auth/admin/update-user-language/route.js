import { User } from '../../../../../models/User'; // Adjust the path as necessary
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../[...nextauth]/options";

export async function PUT(req) {
  try {
    const session = await getServerSession({ req, authOptions });

    if (!session) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const { userId, languages, action } = await req.json();

    if (!userId || !languages || !action) {
      return new Response(JSON.stringify({ message: 'User ID, languages, and action are required' }), { status: 400 });
    }

    if (!Array.isArray(languages)) {
      return new Response(JSON.stringify({ message: 'Languages should be an array' }), { status: 400 });
    }

    let updatedUser;
    if (action === 'add') {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { $addToSet: { languages: { $each: languages.map(lang => lang.toLowerCase()) } } }, // Add only the new languages
        { new: true }
      );
    } else if (action === 'delete') {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { $pull: { languages: { $in: languages.map(lang => lang.toLowerCase()) } } }, // Remove only the specified languages
        { new: true }
      );
    } else {
      return new Response(JSON.stringify({ message: 'Invalid action' }), { status: 400 });
    }

    if (!updatedUser) {
      return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
    }

    return new Response(JSON.stringify(updatedUser), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {

    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
