export async function login({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw error.message;
  }

  return res.json();
}

export async function signup({
  email,
  name,
  password,
  username,
}: {
  email: string;
  name: string;
  password: string;
  username: string;
}) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, name, password, username }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw error.message;
  }

  return res.json();
}
