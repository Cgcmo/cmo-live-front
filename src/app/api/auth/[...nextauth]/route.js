import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import API_URL from '@/app/api';

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
    signOut: "/",
    error: "/",
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account?.provider === "google" && profile?.email) {
        try {
          const res = await fetch(`${API_URL}/google-login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: profile.name,
              email: profile.email,
              photo: profile.picture,
            }),
          });
    
          const result = await res.json();
          if (res.ok && result?.userId) {
            token.userId = result.userId;
          } else if (res.status === 403 && result?.error?.includes("inactive")) {
            // Force redirect via error mechanism
            throw new Error("InactiveAccount");
          }
          
               
          
        } catch (err) {
          console.error("❌ Failed to save Google user:", err);
          throw err; // ✅ Let NextAuth handle the NEXT_REDIRECT
        }        
      }
    
      return token;
    },

    async session({ session, token }) {
      session.user.userId = token.userId; // ✅ expose userId to frontend
      return session;
    },
  

    async redirect({ url, baseUrl }) {
      // Always send user to homepage with error param when inactive
      if (url.includes("InactiveAccount")) {
        return `${baseUrl}/?error=InactiveAccount`;
      }
      return "/dashboard";
    },
    
  },
  debug: true,
};

export const GET = async (req, ctx) => NextAuth(authOptions)(req, ctx);
export const POST = async (req, ctx) => NextAuth(authOptions)(req, ctx);
