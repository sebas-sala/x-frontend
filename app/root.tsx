import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { io, Socket } from "socket.io-client";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";

import "./tailwind.css";
import NavigationAside from "./components/navigation-aside/navigation-aside";
import { Toaster } from "sonner";
import { ArrowBigUp } from "lucide-react";
import { getSession } from "./sessions";
import { useAuthStore } from "./store/auth";
import { useEffect, useState } from "react";
import { getUser } from "./services/user";
import { jwtDecode } from "jwt-decode";
import { useNotificationStore } from "./store/notification";
import { NotificationApiResponseList } from "./types/notification";

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
  let hasToken = false;

  if (token) {
    try {
      decoded = jwtDecode(token) as { sub: string };
      hasToken = true;
    } catch (error) {
      hasToken = false;
    }
  }

  return { hasToken, decoded, token };
};

export function Layout({ children }: { children: React.ReactNode }) {
  const { hasToken, decoded, token } = useLoaderData<typeof loader>();

  const setIsLogged = useAuthStore((state) => state.setIsLogged);
  const setCurrentUser = useAuthStore((state) => state.setCurrentUser);
  const currentUser = useAuthStore((state) => state.currentUser);

  const [socket, setSocket] = useState<Socket>();

  const addNotification = useNotificationStore().addNotification;
  const addManyNotifications = useNotificationStore().addManyNotifications;
  const setPagination = useNotificationStore().setPagination;

  useEffect(() => {
    if (hasToken && decoded && !currentUser) {
      getUser(decoded.sub).then((user) => {
        setCurrentUser(user.data);
      });

      setIsLogged(true);
    }
  }, [hasToken, decoded, setIsLogged, setCurrentUser, currentUser, token]);

  useEffect(() => {
    if (!token) return;

    const socket = io(`http://localhost:3000/notifications`, {
      auth: {
        token,
      },
      reconnection: true,
      reconnectionAttempts: 10,
    });
    setSocket(socket);

    socket.emit("getNotifications", (data: NotificationApiResponseList) => {
      addManyNotifications(data.data);
      setPagination(data.meta.pagination);
    });

    return () => {
      socket.close();
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
      <body>
        <div className="container relative mx-auto h-full max-h-screen md:grid md:grid-cols-12">
          <aside className="fixed bottom-0 border-r md:sticky md:top-0 md:col-span-3">
            <NavigationAside />
          </aside>
          <div className="md:col-span-6">{children}</div>
          <aside className="sticky bottom-0 top-0 hidden h-screen border-l p-4 md:col-span-3 md:block">
            {/* <RightAside users={users} /> */}
          </aside>
        </div>

        <ScrollRestoration />
        <Scripts />
        <Toaster richColors closeButton />

        <ArrowBigUp
          className="fixed bottom-4 right-4 -rotate-45 transform cursor-pointer text-gray-500 transition-all duration-300 hover:rotate-0 hover:scale-125 hover:text-gray-900"
          size={32}
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
