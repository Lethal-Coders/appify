import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/lib/prisma'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log('[NextAuth] signIn callback START', {
        userEmail: user?.email,
        provider: account?.provider,
        hasProfile: !!profile
      })
      try {
        return true
      } catch (error) {
        console.error('[NextAuth] signIn callback ERROR', error)
        return false
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id
      }
      return token
    },
    session: async ({ session, token }) => {
      console.log('[NextAuth] session callback', { session: !!session, token: !!token })
      if (session?.user) {
        // Prefer token.id, fallback to token.sub
        ; (session.user as any).id = (token as any).id || token.sub || (session.user as any).id
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
  events: {
    async signIn(message) {
      console.log('[NextAuth] signIn event', message)
    },
    async createUser(message) {
      console.log('[NextAuth] createUser event', message.user)
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin', // Redirect to sign in page on error
  },
  useSecureCookies: process.env.NODE_ENV === 'production',
  debug: process.env.NODE_ENV === 'development',
}
