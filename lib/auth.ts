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
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log('[NextAuth] signIn callback', { user, account: account?.provider, profile: !!profile })
      return true
    },
    session: async ({ session, user }) => {
      console.log('[NextAuth] session callback', { session: !!session, user: !!user })
      if (session?.user) {
        session.user.id = user.id
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
