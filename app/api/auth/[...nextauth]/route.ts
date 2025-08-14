import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { findDocument, insertDocument } from "@/lib/db";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          // Check if user exists in MongoDB
          const user = await findDocument("users", { email: credentials.email });
          
          if (user) {
            // User exists, verify password
            const isValidPassword = await bcrypt.compare(credentials.password, user.password);
            if (isValidPassword) {
              const userToReturn = {
                id: user._id.toString(),
                email: user.email,
                name: user.name,
                role: user.role,
              };
              return userToReturn;
            }
          } else {
            // Create new user if credentials match demo accounts
            if (credentials.email === "admin@example.com" && credentials.password === "password") {
              const hashedPassword = await bcrypt.hash("password", 12);
              const newUser = {
                email: "admin@example.com",
                name: "Admin User",
                password: hashedPassword,
                role: "admin",
                createdAt: new Date(),
              };
              
              const result = await insertDocument("users", newUser);
              const userToReturn = {
                id: result.insertedId.toString(),
                email: newUser.email,
                name: newUser.name,
                role: newUser.role,
              };
              return userToReturn;
            } else if (credentials.email === "learner@example.com" && credentials.password === "password") {
              const hashedPassword = await bcrypt.hash("password", 12);
              const newUser = {
                email: "learner@example.com",
                name: "Demo Learner",
                password: hashedPassword,
                role: "learner",
                createdAt: new Date(),
              };
              
              const result = await insertDocument("users", newUser);
              const userToReturn = {
                id: result.insertedId.toString(),
                email: newUser.email,
                name: newUser.name,
                role: newUser.role,
              };
              return userToReturn;
            }
          }
          
          return null;
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      }
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      
      // If token exists but is missing role, fetch it from the database
      if (token && !token.role && token.email) {
        try {
          const userDoc = await findDocument("users", { email: token.email });
          if (userDoc && userDoc.role) {
            token.role = userDoc.role;
          }
        } catch (error) {
          console.error("Error fetching user role from database:", error);
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      
      return session;
    },
  },
});

export { handler as GET, handler as POST };
