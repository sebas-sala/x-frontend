import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { Toaster } from "sonner";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";

import { NavigationAside } from "./components/navigation-aside/navigation-aside";

import { getSession } from "./sessions";
import { getUser } from "./services/user";

import { useAuthStore } from "./store/auth";
import { useNotificationStore } from "./store/notification";

import type { NotificationApiResponseList } from "./types/notification";

import "./tailwind.css";
import { RightAside } from "./components/right-aside/right-aside";

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

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await getSession(request);
  const token = session.get("token");

  let decoded: { sub: string } | null = null;

  if (token) {
    decoded = jwtDecode(token) as { sub: string };
  }

  return { decoded, token };
};

export function Layout({ children }: { children: React.ReactNode }) {
  const { decoded, token } = useLoaderData<typeof loader>();

  const currentUser = useAuthStore.use.currentUser();
  const setCurrentUser = useAuthStore.use.setCurrentUser();

  const [socket, setSocket] = useState<Socket>();

  const setPagination = useNotificationStore.use.setPagination();
  const addNotification = useNotificationStore.use.addNotification();
  const addManyNotifications = useNotificationStore.use.addManyNotifications();

  useEffect(() => {
    if (!decoded) {
      setCurrentUser(undefined);
      return;
    }

    if (!currentUser) {
      getUser(decoded.sub).then((user) => {
        setCurrentUser(user.data);
      });
    }
  }, [decoded, setCurrentUser, currentUser]);

  useEffect(() => {
    if (!token) return;

    const notificationSocket = io(`http://localhost:3000/notifications`, {
      auth: {
        token,
      },
      reconnection: true,
      reconnectionAttempts: 10,
    });
    setSocket(notificationSocket);

    notificationSocket.emit(
      "getNotifications",
      (data: NotificationApiResponseList) => {
        addManyNotifications(data.data);
        setPagination(data.meta.pagination);
      },
    );

    return () => {
      notificationSocket.close();
    };
  }, [token, addManyNotifications, setPagination]);

  useEffect(() => {
    if (!socket) return;

    socket.on("connect", () => {
      console.log("connected");
    });

    socket.on("disconnect", () => {
      console.log("disconnected");
    });

    socket.on("notification", (data) => {
      console.log(data);
      addNotification(data);
    });
  }, [socket, addNotification]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <title>X - Social Media</title>
      </head>
      <body className="overflow-y-scroll">
        <div className="container relative mx-auto h-full max-h-screen min-h-screen md:grid md:grid-cols-12">
          <header className="md:hidden">
            <nav className="sticky top-0 z-50 w-full border-b bg-white">
              <NavigationAside />
            </nav>
          </header>
          <aside className="fixed bottom-0 z-50 w-full md:sticky md:top-0 md:col-span-3 md:border-r">
            <NavigationAside />
          </aside>
          <div className="md:col-span-6">{children}</div>
          <aside className="sticky bottom-0 top-0 hidden h-full border-l p-4 md:col-span-3 md:block">
            <RightAside />
          </aside>
        </div>

        <ScrollRestoration />
        <Scripts />
        <Toaster richColors closeButton />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
