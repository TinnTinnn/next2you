import "./globals.css";
import Link from "next/link";
import {Poppins} from 'next/font/google'
import {usePathname} from "next/navigation";

const poppins = Poppins({
    subsets: ["latin"],
    variable: '--font-poppins',
    weight: ["200", "400", "700"],
})

export default function RootLayout({children}) {

    const pathname = usePathname()

    return (
        <html lang="en">
        <body className={`${poppins.variable} font-sans`}>
        <header>
            <nav>
                <Link className="nav-link" href="/">Home</Link>
                <div>
                    <Link className="nav-link" href="/register">Register</Link>
                    <Link className="nav-link" href="/dashboard">Dashboard</Link>
                </div>
            </nav>
        </header>

        <main>
            {children}
        </main>

        <footer>
            Footer
        </footer>
        </body>
        </html>
    );
}
