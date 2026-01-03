import { NextResponse } from 'next/server'

export async function GET() {
  try {
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
      urlPreview: url.substring(0, 40) + '...',
      message: 'LibSQL connection successful',
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      hasTursoUrl: !!process.env.TURSO_DATABASE_URL,
      hasDbUrl: !!process.env.DATABASE_URL,
      hasToken: !!process.env.TURSO_AUTH_TOKEN,
      stack: error.stack,
    }, { status: 500 })
  }
}
