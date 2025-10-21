import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'
import type { NextRequest } from 'next/server'

async function auth(req: NextRequest, ctx: any) {
  // Force NextAuth to use NEXTAUTH_URL instead of request host
  const url = new URL(req.url)
  if (process.env.NEXTAUTH_URL && url.host !== new URL(process.env.NEXTAUTH_URL).host) {
    const nextAuthUrl = new URL(process.env.NEXTAUTH_URL)
    url.host = nextAuthUrl.host
    url.protocol = nextAuthUrl.protocol

    // Create a modified request with the correct host
    const modifiedReq = new Request(url.toString(), {
      method: req.method,
      headers: req.headers,
      body: req.body,
    })

    // Update the host header
    modifiedReq.headers.set('host', nextAuthUrl.host)
    modifiedReq.headers.set('x-forwarded-host', nextAuthUrl.host)
    modifiedReq.headers.set('x-forwarded-proto', nextAuthUrl.protocol.replace(':', ''))

    return NextAuth(modifiedReq as any, ctx, authOptions)
  }

  return NextAuth(req as any, ctx, authOptions)
}

export { auth as GET, auth as POST }
