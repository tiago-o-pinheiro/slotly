/**
 * CORS proxy – forwards /api/booking/* → BOOKING_API_URL/*
 *
 * Runs server-side only so BOOKING_API_URL stays private and
 * the browser never hits the backend directly.
 */

import { NextRequest, NextResponse } from 'next/server'

const BACKEND = process.env.BOOKING_API_URL ?? 'http://localhost:8095'

const FORWARDED_HEADERS = ['authorization', 'content-type', 'accept'] as const

async function proxy(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
): Promise<NextResponse> {
  const { path } = await params
  const target = new URL(`/${path.join('/')}`, BACKEND)

  // Forward query string
  req.nextUrl.searchParams.forEach((value, key) => {
    target.searchParams.set(key, value)
  })

  // Pick headers to forward
  const headers = new Headers()
  for (const name of FORWARDED_HEADERS) {
    const value = req.headers.get(name)
    if (value) headers.set(name, value)
  }

  // Forward body for methods that carry one
  const hasBody = ['POST', 'PUT', 'PATCH'].includes(req.method)
  let body: BodyInit | null = null
  if (hasBody) {
    body = await req.text()
  }

  try {
    const upstream = await fetch(target.toString(), {
      method: req.method,
      headers,
      body,
    })

    const data = await upstream.text()

    return new NextResponse(data, {
      status: upstream.status,
      headers: {
        'content-type': upstream.headers.get('content-type') ?? 'application/json',
      },
    })
  } catch {
    return NextResponse.json(
      { message: 'Backend unreachable' },
      { status: 502 },
    )
  }
}

export const GET = proxy
export const POST = proxy
export const PUT = proxy
export const PATCH = proxy
export const DELETE = proxy
