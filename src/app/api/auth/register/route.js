import { NextResponse } from 'next/server';
import { connect } from '@/database/mongo.config';
import { User } from '@/models/User';
import { registerSchema } from '@/validator/authSchema';
import vine, { errors } from '@vinejs/vine';
import ErrorReporter from '@/validator/ErrorReporter';
import bcrypt from 'bcryptjs';

// Connect to the DB
connect();

export async function POST(request) {
  try {
    const body = await request.json();
    vine.errorReporter = () => new ErrorReporter();
    const validator = vine.compile(registerSchema);
    const output = await validator.validate(body);

    try {
      const user = await User.findOne({ email: output.email });
      if (user) {
        return NextResponse.json(
          {
            status: 400, msg: 'Email is already used.',
            errors: {
              email: 'Email is already used.',
            },
          },
          { status: 400 },
        );
      } else {
        // Hash the password
        const salt = bcrypt.genSaltSync(10);
        output.password = bcrypt.hashSync(output.password, salt);
        await User.create(output);
        return NextResponse.json(
          { status: 200, msg: 'Account Created successfully!' },
          { status: 200 }
        );
      }
    } catch (error) {
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  } catch (error) {
    // Check if the error is an instance of the custom ErrorReporter error
    if (error instanceof errors.E_VALIDATION_ERROR) {
      return NextResponse.json(
        { status: 400, errors: error.messages },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { status: 500, error: "Internal server error" },
      { status: 500 }
    );
  }
}