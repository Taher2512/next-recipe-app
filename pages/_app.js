import "@/styles/globals.css";
import Link from "next/link";

export default function App({ Component, pageProps }) {
  return (
    <>
      <nav className="header">
        <div>
          <Link href="/" legacyBehavior>
            <a>Kap's Kitchen</a>
          </Link>
        </div>
      </nav>
      <main>
        <Component {...pageProps} />
      </main>
    </>
  );
}
