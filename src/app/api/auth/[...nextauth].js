// // import NextAuth from "next-auth";
// // import GoogleProvider from "next-auth/providers/google";

// // export const authOptions = {
// //   providers: [
// //     GoogleProvider({
// //       clientId: process.env.GOOGLE_CLIENT_ID,
// //       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
// //     }),
// //   ],
// //   secret: process.env.NEXTAUTH_SECRET,

// //   callbacks: {
// //     async session({ session, token }) {
// //       session.user.id = token.sub;
// //       return session;
// //     },
// //   },
// // };

// // export default NextAuth(authOptions);
// import NextAuth from "next-auth";
// import GoogleProvider from "next-auth/providers/google";

// export const authOptions = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     }),
//   ],
//   secret: process.env.NEXTAUTH_SECRET,

//   callbacks: {
//     async session({ session, token }) {
//       session.user.id = token.sub;

//       // ✅ Send user data to Flask backend to register if not exists
//       try {
//         const res = await fetch(`${API_URL}/google-login`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             name: session.user.name,
//             email: session.user.email,
//             photo: session.user.image,
//           }),
//         });
//         await res.json(); // no error expected if already exists
//       } catch (err) {
//         console.error("Failed to register Google user:", err);
//       }

//       return session;
//     },
//   },
// };

// export default NextAuth(authOptions);
