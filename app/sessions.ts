import { createCookieSessionStorage } from "@remix-run/node";

type SessionData = {
  token: string;
};

type SessionFlashData = {
  error: string;
};

const sessionStorage = createCookieSessionStorage<
  SessionData,
  SessionFlashData
>({
  cookie: {
    name: "__session",
    secure: process.env.NODE_ENV === "production",
    secrets: [process.env.SESSION_SECRET as string],
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
  },
});

export async function getSession(request: Request) {
  const cookies = request.headers.get("Cookie");
  return sessionStorage.getSession(cookies);
}

export const { commitSession, destroySession } = sessionStorage;
