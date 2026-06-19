import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const protectedPaths = ["/checkout", "/panel"]
const adminPaths = ["/admin"]

export default function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value
  const { pathname } = request.nextUrl

  const isProtected = protectedPaths.some((p) => pathname === p || pathname.startsWith(p + "/"))
  const isAdmin = adminPaths.some((p) => pathname === p || pathname.startsWith(p + "/"))

  if (isProtected && !token) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", pathname + request.nextUrl.search)
    return NextResponse.redirect(loginUrl)
  }

  if (isAdmin && !token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/checkout", "/panel", "/admin"],
}
