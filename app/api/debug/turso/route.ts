import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Try to load and use LibSQL directly without Prisma
    const { createClient } = require('@libsql/client')

    const url = process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL
    if (!url) throw new Error('No TURSO_DATABASE_URL or DATABASE_URL found')

    const client = createClient({
      url,
      authToken: process.env.TURSO_AUTH_TOKEN,
    })

    const result = await client.execute('SELECT COUNT(*) as count FROM User')

    return NextResponse.json({
      success: true,
      userCount: result.rows[0].count,
      message: 'LibSQL connection successful'
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
    }, { status: 500 })
  }
}
