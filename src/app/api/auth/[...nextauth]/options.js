import { connect } from "@/database/mongo.config";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { User as UserModel } from "@/models/User";


export const authOptions = {
  pages: {
    signIn: "/login",
  },

  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      try {
        // Ensure the database is connected
        await connect();

        let findUser = await UserModel.findOne({ email: user.email });
        if (findUser) {
          // User already exists, update role if necessary
          return true;
        }

        // Create a new user with a default role
        await UserModel.create({
          email: user.email,
          name: user.name,
          role: "User", // default role
        });
        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },

    async jwt({ token, user }) {
      if (user) {
        token.user = {
          ...user,
          role: user?.role ?? "User", // Ensure the role is always set
        };
      }
      return token;
    },

    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
  },

  providers: [
    Credentials({
      name: "Welcome Back",
      type: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "Enter your email",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // Ensure the database is connected
          await connect();

          const user = await UserModel.findOne({ email: credentials?.email });

          if (!user) {
            throw new Error("No user found with this email");
          }

          // Add logic here to verify the password if needed
          // For example, using bcrypt:
          // const isValidPassword = await bcrypt.compare(credentials.password, user.password);
          // if (!isValidPassword) throw new Error("Invalid credentials");

          return user;
        } catch (error) {
          console.error("Error in authorize callback:", error);
          return null;
        }
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // ...add more providers here
  ],
};
