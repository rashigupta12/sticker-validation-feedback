import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    required: [true, 'Name field is required.'],
    minlength: [2, 'Name must be at least 2 characters long.'],
    type: String,
  },
  email: {
    required: [true, 'Email field is required.'],
    type: String,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
  },
  // avatar: { // Fixed typo from 'avtar' to 'avatar'
  //   type: String,
  //   default: null,
  // },
  role: {
    required: true,
    type: String,
    default: 'User',
  },
  languages: {
    type: [String], // Ensure languages is an array of strings
    default: [],
  },
  // password_reset_token: {
  //   type: String,
  //   trim: true,
  //   default: null,
  // },
  // magic_link_token: {
  //   type: String,
  //   trim: true,
  //   default: null,
  // },
  // magic_link_sent_at: {
  //   type: Date,
  //   default: null,
  // },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export { User };
