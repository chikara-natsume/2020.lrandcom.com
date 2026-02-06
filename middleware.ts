import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const MEDIA_ALLOWED_QUERY_KEYS = new Set(['u', 'w', 'h', 'q', 'fit', 'sig'])

const TRUSTED_CRAWLER_PATTERNS = [
  /googlebot/i,
  /bingbot/i,
  /duckduckbot/i,
  /slurp/i,
  /facebookexternalhit/i,
  /twitterbot/i,
  /linkedinbot/i,
  /slackbot/i,
  /discordbot/i,
]

const BLOCKED_AUTOMATION_PATTERNS = [
  /python-requests/i,
  /curl\//i,
  /wget\//i,
  /scrapy/i,
  /aiohttp/i,
  /httpclient/i,
  /go-http-client/i,
]

const hasOnlyAllowedMediaQueryKeys = (request: NextRequest): boolean => {
  for (const key of request.nextUrl.searchParams.keys()) {
    if (!MEDIA_ALLOWED_QUERY_KEYS.has(key)) {
      return false
    }
  }
  return true
}

const isTrustedCrawler = (userAgent: string): boolean => {
  return TRUSTED_CRAWLER_PATTERNS.some((pattern) => pattern.test(userAgent))
}

const isBlockedAutomation = (userAgent: string): boolean => {
  return BLOCKED_AUTOMATION_PATTERNS.some((pattern) => pattern.test(userAgent))
}

export function middleware(request: NextRequest): NextResponse {
  const pathname = request.nextUrl.pathname
  const userAgent = request.headers.get('user-agent') || ''

  if (pathname === '/api/media' && !hasOnlyAllowedMediaQueryKeys(request)) {
    return new NextResponse(null, { status: 400 })
  }

  if (!isTrustedCrawler(userAgent) && isBlockedAutomation(userAgent)) {
    return new NextResponse(null, { status: 403 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/articles/:path*', '/api/media', '/_next/data/:path*/articles/:path*'],
}
