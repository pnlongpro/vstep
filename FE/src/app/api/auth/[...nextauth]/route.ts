import NextAuth, { type AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.error("[NextAuth] Missing credentials");
          return null;
        }

        try {
          console.log("[NextAuth] Attempting login to:", `${API_URL}/auth/login`);
          const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          console.log("[NextAuth] Response status:", response.status);

          if (!response.ok) {
            const errorText = await response.text();
            console.error("[NextAuth] Login failed:", response.status, errorText);
            return null;
          }

          const data = await response.json();
          console.log("[NextAuth] Login successful for user:", data.user?.email);

          if (data.user) {
            return {
              id: data.user.id,
              email: data.user.email,
              name: `${data.user.firstName} ${data.user.lastName}`,
              accessToken: data.accessToken,
              refreshToken: data.refreshToken,
              role: data.user.roles?.[0]?.name || "Student",
            };
          }

          return null;
        } catch (error) {
          console.error("[NextAuth] Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.accessToken = token.accessToken as string;
        session.user.refreshToken = token.refreshToken as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  secret: process.env.NEXTAUTH_SECRET || "vstep-secret-key-change-in-production",
  debug: true,
  logger: {
    error: (code, metadata) => {
      console.error("[NextAuth Error]", code, metadata);
    },
    warn: (code) => {
      console.warn("[NextAuth Warn]", code);
    },
    debug: (code, metadata) => {
      console.log("[NextAuth Debug]", code, metadata);
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
