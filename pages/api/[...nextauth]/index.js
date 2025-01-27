import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

const prisma = new PrismaClient();

export const authOptions = {
  // Use Prisma Adapter to connect to your Prisma client
  adapter: PrismaAdapter(prisma),

  // Define authentication providers
  providers: [
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Find user in the database by email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        // If user doesn't exist or password doesn't match, reject
        if (!user) {
          throw new Error("No user found with this email");
        }
        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValidPassword) {
          throw new Error("Invalid email or password");
        }

        // If everything checks out, return user object
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],

  // Custom session callback to include user role
  callbacks: {
    async session(session, user) {
      session.userId = user.id;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
  },

  // Enable debug mode in development
  debug: process.env.NODE_ENV === "development",

  // Configure session behavior
  session: {
    strategy: "jwt",
  },

  // Secret for signing JWT tokens
  secret: process.env.NEXTAUTH_SECRET,

  // Custom pages for authentication
  pages: {
    signIn: "/auth/login",
    error: "/auth/error", // Error page
  },
};

export default NextAuth(authOptions);
