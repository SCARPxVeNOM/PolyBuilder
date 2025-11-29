import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import { getCsrfToken } from "next-auth/react";
import { SiweMessage } from "siwe";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // Wallet authentication with SIWE
    CredentialsProvider({
      id: "wallet",
      name: "Ethereum",
      credentials: {
        message: {
          label: "Message",
          type: "text",
          placeholder: "0x0",
        },
        signature: {
          label: "Signature",
          type: "text",
          placeholder: "0x0",
        },
      },
      async authorize(credentials, req) {
        try {
          const siwe = new SiweMessage(JSON.parse(credentials?.message || "{}"));
          const nextAuthUrl = new URL(process.env.NEXTAUTH_URL || "http://localhost:3000");

          const result = await siwe.verify({
            signature: credentials?.signature || "",
            domain: nextAuthUrl.host,
            nonce: await getCsrfToken({ req }),
          });

          if (result.success) {
            // Find or create user
            let user = await prisma.user.findUnique({
              where: { walletAddress: siwe.address },
            });

            if (!user) {
              user = await prisma.user.create({
                data: {
                  walletAddress: siwe.address,
                  name: `${siwe.address.slice(0, 6)}...${siwe.address.slice(-4)}`,
                },
              });
            }

            return {
              id: user.id,
              name: user.name,
              email: user.email,
              image: user.image,
            };
          }
          return null;
        } catch (e) {
          return null;
        }
      },
    }),
    
    // OAuth providers (optional)
    ...(process.env.GITHUB_ID && process.env.GITHUB_SECRET
      ? [
          GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
          }),
        ]
      : []),
    
    ...(process.env.GOOGLE_ID && process.env.GOOGLE_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
          }),
        ]
      : []),
  ],
  
  session: {
    strategy: "jwt",
  },
  
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        
        // Fetch additional user data
        const user = await prisma.user.findUnique({
          where: { id: token.sub },
          select: {
            walletAddress: true,
            bio: true,
            githubUrl: true,
            twitterUrl: true,
          },
        });
        
        if (user) {
          session.user.walletAddress = user.walletAddress;
        }
      }
      return session;
    },
  },
  
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
};

