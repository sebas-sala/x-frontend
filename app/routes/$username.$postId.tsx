import { useLoaderData, useParams, useRouteError } from "@remix-run/react";

import { GoBack } from "~/components/go-back";
import { PostItem } from "~/components/post/post-item";

import { getSession } from "~/sessions";
import { createPostView, getPost } from "~/services/post";

import { usePostStore } from "~/store/post";
import { useUserStore } from "~/store/user";

import type { Post } from "~/types/post";
import { useAuthStore } from "~/store/auth";
import { useEffect, useRef } from "react";
import { ErrorPage } from "~/components/error-page";

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

    return {
      postResponse,
    };
  } catch (error) {
    throw new Error("Failed to load post");
  }
};

export function ErrorBoundary() {
  const error = useRouteError();

  return <ErrorPage error={error} />;
}

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

  const hasViewedRef = useRef(false);

  useEffect(() => {
    if (post.isViewed || hasViewedRef.current) return;

    createPostView(post.id);
    hasViewedRef.current = true;
  }, [post]);

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
