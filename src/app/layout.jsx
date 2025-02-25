import "./globals.css";
import Link from "next/link";


export default function RootLayout({children}) {
    return (
        <html lang="en">
        <body>
        <header>
            <nav>
                <Link className="nav-link" href="/">Home</Link>
                <Link className="nav-link" href="/dashboard">Dashboard</Link>
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
