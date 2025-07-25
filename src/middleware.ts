import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { trackPageView } from './lib/dashboard/analytics'

export async function middleware(request: NextRequest) {
  // Don't track API routes or static files
  if (
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Track page view
  try {
    await trackPageView({
      page_path: request.nextUrl.pathname,
      device_type: getDeviceType(request.headers.get('user-agent') || ''),
      referrer: request.headers.get('referer') || ''
    })
  } catch (error) {
    // Don't block the request if tracking fails
    console.error('Error tracking page view:', error)
  }

  const response = NextResponse.next()
  
  // Add security headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')
  
  return response
}

function getDeviceType(userAgent: string): string {
  if (/mobile/i.test(userAgent)) return 'mobile'
  if (/tablet/i.test(userAgent)) return 'tablet'
  if (/ipad/i.test(userAgent)) return 'tablet'
  return 'desktop'
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)'
} 