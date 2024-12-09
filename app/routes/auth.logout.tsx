import { ActionFunctionArgs, json } from "@remix-run/node";

import { handleApiError } from "~/lib/api-utils";
import { getSession, destroySession } from "~/sessions";

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const session = await getSession(request);
    session.unset("token");

    return json(
      {
        success: true,
      },
      {
        headers: {
          "Set-Cookie": await destroySession(session),
        },
      },
    );
  } catch (err) {
    const { error, status } = handleApiError(err);

    return json({ ...error }, { status });
  }
};
