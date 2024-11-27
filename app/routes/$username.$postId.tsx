import { json, redirect, useLoaderData, useParams } from "@remix-run/react";

import { GoBack } from "~/components/go-back";
import { PostItem } from "~/components/post/post-item";

import { getSession } from "~/sessions";
import { getPost } from "~/services/post";

import { usePostStore } from "~/store/post";
import { useUserStore } from "~/store/user";

import type { Post } from "~/types/post";

export const loader = async ({
  params,
  request,
}: {
  params: { username: string; postId: string };
  request: Request;
}) => {
  try {
    const session = await getSession(request);
    const token = session.get("token");

    const postResponse = await getPost({
      postId: params.postId,
      token,
    });

    return json({
      postResponse,
    });
  } catch (error) {
    return redirect("/home?error=profile_not_found");
  }
};

export default function PostPage() {
  const { username } = useParams();

  const { postResponse } = useLoaderData<typeof loader>();

  const post = postResponse.data;

  const { user } = post;
  const { profile } = user;

  const follow = useUserStore().follow;
  const unfollow = useUserStore().unfollow;

  const like = usePostStore().like;
  const unlike = usePostStore().unlike;

  return (
    <main>
      <GoBack href={`/${username}`}>
        <p className="text-3xl font-bold">Post</p>
      </GoBack>

      <PostItem
        datePosition="bottom"
        post={post as Post}
        like={like}
        unlike={unlike}
        follow={follow}
        unfollow={unfollow}
      />
    </main>
  );
}
