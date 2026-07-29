import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

/**
 * تسجيل دخول بسيط بيوزرنيم وباسورد بس، من متغيرات البيئة.
 * مناسب لموقع بيدار من شخص واحد (أو فريق صغير كلهم بيستخدموا نفس الحساب).
 * غيّر ADMIN_USERNAME و ADMIN_PASSWORD في .env وقتما تحب.
 */
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const validUsername = process.env.ADMIN_USERNAME;
        const validPassword = process.env.ADMIN_PASSWORD;

        if (!validUsername || !validPassword) {
          throw new Error("ADMIN_USERNAME/ADMIN_PASSWORD غير موجودين في .env");
        }

        if (
          credentials?.username === validUsername &&
          credentials?.password === validPassword
        ) {
          return {
            id: "admin",
            name: validUsername,
            email: process.env.ADMIN_EMAIL ?? "admin@trendsphere.local",
            role: "admin",
          };
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? "admin";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as typeof session.user & { id: string; role: string }).id =
          token.id as string;
        (session.user as typeof session.user & { id: string; role: string }).role =
          (token.role as string) ?? "admin";
      }
      return session;
    },
  },
};

/** الصلاحيات المسموح لها بدخول لوحة التحكم */
export const ADMIN_ROLES = ["admin", "editor", "author"] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];
