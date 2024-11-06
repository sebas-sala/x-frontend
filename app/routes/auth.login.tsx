import { ActionFunctionArgs, json } from "@remix-run/node";

import { login as apiLogin } from "~/services/auth";

import { handleApiError } from "~/lib/api-utils";
import { commitSession, getSession } from "~/sessions";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    return json(
      { error: "Username and password are required" },
      { status: 400 },
    );
  }

  try {
    const response = await apiLogin({
      username,
      password,
    });

    const { access_token, user } = response.data;

    if (!access_token) {
      return json({ error: "Login failed" }, { status: 401 });
    }

    const session = await getSession(request);
    session.set("token", access_token);

    return json(
      {
        ...response,
        data: {
          ...user,
        },
        success: true,
      },
      {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      },
    );
  } catch (err) {
    const { error, status } = handleApiError(err);

    return json({ ...error }, { status });
  }
};
