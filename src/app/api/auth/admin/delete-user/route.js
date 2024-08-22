import { User } from '../../../../../models/User'; // Adjust path as necessary
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../[...nextauth]/options"; 

export async function DELETE(req) {
  try {
    // Extract the session from the request using the provided context
    const session = await getServerSession({ req, authOptions });

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
      const { userId } = await req.json(); // Get userId from request body

      if (!userId) {
        return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
      }

      const user = await User.findByIdAndDelete(userId);

      if (!user) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
      }

      return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
  } catch (sessionError) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

// For unsupported methods
export async function handler(req) {
  return NextResponse.json({ message: `Method ${req.method} Not Allowed` }, { status: 405 });
}
