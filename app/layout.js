import "./globals.css";
import Nav from "./components/Nav";

export const metadata = {
  title: "Launchpad — opportunities for students who build",
  description:
    "A living map of competitions, summer programs, olympiads, and fellowships for ambitious STEM students. Discover, filter, and never miss a deadline.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Nav />
        {children}
        <footer className="site-foot">
          <span>Launchpad — a starter set, kept honest. Always confirm deadlines on the official site.</span>
        </footer>
      </body>
    </html>
  );
}
