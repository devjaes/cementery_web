import NextAuth from "next-auth";
import { AuthRepositoryImp } from "@/features/auth/infrastructure/repositories/auth.repository.imp";
import { jwtDecode } from "jwt-decode";
import CredentialsProvider from "next-auth/providers/credentials";

type JwtPayload = {
  username: string;
  sub: string;
  rol: string;
  iat: number;
  exp: number;
};

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        cedula: { label: "Cedula", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const repo = AuthRepositoryImp.getInstance();
          const res = await repo.signIn({
            cedula: credentials!.cedula,
            password: credentials!.password,
          });

          if (!res.access_token) return null;

          const decoded = jwtDecode<JwtPayload>(res.access_token);
          console.log("decoded", decoded);

          return {
            id: decoded.sub,
            username: decoded.username,
            role: decoded.rol,
            accessToken: res.access_token,
          };
        } catch (error) {
          console.error(error)
          throw new Error("Cedula o contraseña inválidos");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      console.log("user", user);
      if (user) {
        token.accessToken = user.accessToken;
        token.id = user.id;
        token.username = user.username;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.accessToken = token.accessToken;
      session.user.id = token.id;
      session.user.username = token.username;
      session.user.role = token.role;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };
