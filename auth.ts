import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Basic input presence check
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        // Load admin credentials from env
        const adminUsername = process.env.ADMIN_USERNAME;
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH_B64
          ? Buffer.from(process.env.ADMIN_PASSWORD_HASH_B64, "base64").toString(
              "utf8"
            )
          : process.env.ADMIN_PASSWORD_HASH;

        if (!adminUsername || !adminPasswordHash) {
          return null;
        }

        // Username must match exactly
        if (credentials.username !== adminUsername) {
          return null;
        }

        // Verify password against stored bcrypt hash
        const isValid = await bcrypt.compare(
          credentials.password as string,
          adminPasswordHash
        );

        if (!isValid) {
          return null;
        }

        // Success: return a minimal user object
        return {
          id: "admin",
          name: adminUsername,
          email: `${adminUsername}@admin.local`,
        };
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");
      const isOnLogin = nextUrl.pathname === "/admin/login";

      if (isOnAdmin && !isOnLogin) {
        if (!isLoggedIn) return false;
        return true;
      }

      return true;
    },
  },
  session: {
    strategy: "jwt",
  },
});
