// import CredentialsProvider from "next-auth/providers/credentials";
// import { jwtDecode } from "jwt-decode";
// import NextAuth from "next-auth";

// type JwtPayload = {
//   username: string;
//   sub: string;
//   rol: string;
//   iat: number;
//   exp: number;
// };

// export const authConfig = {
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         cedula: { label: "Cédula", type: "text" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (!credentials?.cedula || !credentials?.password) {
//           throw new Error("Cedula and password are required.");
//         }

//         const res = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
//           {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//               cedula: credentials.cedula,
//               password: credentials.password,
//             }),
//           }
//         );

//         if (!res.ok) return null;

//         const data = await res.json();

//         if (!data.access_token) return null;

//         const decoded = jwtDecode<JwtPayload>(data.access_token);

//         return {
//           id: decoded.sub,
//           username: decoded.username,
//           role: decoded.rol,
//           accessToken: data.access_token,
//         };
//       },
//     }),
//   ],
//   session: {
//     strategy: "jwt" as const,
//   },
//   pages: {
//     signIn: "/sign-in",
//   },
//   callbacks: {
//     async jwt({ token, user }: { token: any; user: any }) {
//       if (user) {
//         token.id = user.id;
//         token.username = user.username;
//         token.role = user.role;
//         token.accessToken = user.accessToken;
//       }
//       return token;
//     },
//     async session({ session, token }: { session: any; token: any }) {
//       if (token) {
//         session.user = {
//           id: token.id,
//           username: token.username,
//           role: token.role,
//         };
//         session.accessToken = token.accessToken;
//       }
//       return session;
//     },
//   },
// };

// export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
