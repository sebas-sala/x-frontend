export async function createPost() {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title: "New Post" }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw error.message;
  }

  return response.json();
}
