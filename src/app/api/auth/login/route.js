import vine, { errors } from "@vinejs/vine";
import { NextResponse } from "next/server";
import { connect } from "@/database/mongo.config";
import ErrorReporter from "@/validator/ErrorReporter";
import { loginSchema } from "@/validator/authSchema";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

// * Connect to the DB
connect();

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Initialize custom error reporter
    vine.errorReporter = () => new ErrorReporter();
    
    // Compile and validate the schema
    const validator = vine.compile(loginSchema);
    const output = await validator.validate(body);
    
    // Find the user by email12
    const user = await User.findOne({ email: output.email });
    if (user) {
      // Compare the provided password with the stored hashed password
      const checkPassword = bcrypt.compareSync(output.password, user.password);
      if (checkPassword) {
        return NextResponse.json(
          { status: 200, message: "User logged in successfully!" },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          {
            status: 400,
            errors: {
              email: "Please check your credentials.",
            },
          },
          { status: 400 } // Correct the status to 400 for bad request
        );
      }
    } else {
      return NextResponse.json(
        {
          status: 400,
          errors: {
            email: "No user found in our system with the provided email.",
          },
        },
        { status: 400 } // Correct the status to 400 for bad request
      );
    }
  } catch (error) {
    if (error instanceof errors.E_VALIDATION_ERROR) {
      return NextResponse.json(
        { status: 400, errors: error.messages },
        { status: 400 } // Correct the status to 400 for validation error
      );
    }
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { status: 500, error: "Internal server error" },
      { status: 500 }
    );
  }
}
