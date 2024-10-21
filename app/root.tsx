import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";

import "./tailwind.css";
import NavigationAside from "./components/navigation-aside/navigation-aside";
import { Toaster } from "sonner";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="md:grid md:grid-cols-12 h-full container mx-auto overflow-y-auto max-h-screen relative">
          <aside className="md:col-span-3 border-r h-screen p-4 absolute md:sticky md:top-0 bottom-0">
            <NavigationAside />
          </aside>
          <div className="md:col-span-6 overflow-y-auto">{children}</div>
          <aside className="hidden md:block sticky top-0 md:col-span-3 border-l h-screen p-4 bottom-0">
            {/* <RightAside users={users} /> */}
          </aside>
        </div>

        <ScrollRestoration />
        <Scripts />
        <Toaster />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
