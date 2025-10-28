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
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log('[NextAuth] signIn callback', { user, account: account?.provider, profile: !!profile })
      return true
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
        ;(session.user as any).id = (token as any).id || token.sub || (session.user as any).id
      }
      return session
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
  },
  useSecureCookies: process.env.NODE_ENV === 'production',
  debug: true,
}
