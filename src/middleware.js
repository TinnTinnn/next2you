import getAuthUser from "@/lib/getAuthUser";
import {NextResponse} from "next/server";

const protectedRoutes = ["/dashboard", "/jobs/create"]
const publicRoutes = ["/login", "/register"]

export default async function middleware(req) {

    const path = req.nextUrl.pathname;
    const isProtected =
        protectedRoutes.includes(path) || path.startsWith("/jobs/edit");
    const isPublic = publicRoutes.includes(path)

    const user = await getAuthUser()
    const userId = user?.userId

    if (isProtected && !userId) {
        return NextResponse.redirect(new URL('/login', req.nextUrl))
    }

    if (isPublic && userId) {
        return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
    }

   return NextResponse.next()
}

export const config = {
    // matcher: ["/dashboard", '/jobs/:path*'], // do with yourself
    matcher: [   // Do with all next.js design for all routes
        "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
    ],
}