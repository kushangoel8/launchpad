"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTracked } from "../lib/store";

export default function Nav() {
  const pathname = usePathname();
  const tracked = useTracked();
  const count = Object.keys(tracked).length;

  return (
    <nav className="nav">
      <Link href="/" className="brand">
        <span className="brand-mark" aria-hidden="true" />
        <span className="brand-name">Launchpad</span>
      </Link>
      <div className="nav-links">
        <Link href="/" className={pathname === "/" ? "nav-link active" : "nav-link"}>
          Discover
        </Link>
        <Link href="/tracked" className={pathname === "/tracked" ? "nav-link active" : "nav-link"}>
          Tracking{count > 0 ? <span className="nav-count">{count}</span> : null}
        </Link>
      </div>
    </nav>
  );
}
