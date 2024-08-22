import { getServerSession } from "next-auth/next";
import { authOptions } from "../[...nextauth]/options"; // Adjust the import path as needed
import {User} from "../../../../models/User";
import { NextResponse } from 'next/server';


// Define the GET handler
export async function GET(req) {
  try {
    // Extract the session from the request using the provided context
    const session = await getServerSession({ req, authOptions });
   

    if (!session) {
     
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
  
    
    try {
      const users = await User.find({ email: session.user.email }).limit(1);
      const user = users[0];
     
      if (!user) {
      
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
      }

      return NextResponse.json(user.languages, { status: 200 });
    } catch (dbError) {
     
      return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }

  } catch (sessionError) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
