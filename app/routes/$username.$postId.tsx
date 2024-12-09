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

  const follow = useUserStore.use.follow();
  const unfollow = useUserStore.use.unfollow();
  const block = useUserStore.use.block();

  const like = usePostStore.use.like();
  const unlike = usePostStore.use.unlike();

  const hasViewedRef = useRef(false);

  const currentUser = useAuthStore.use.currentUser();

  useEffect(() => {
    if (post.isViewed || hasViewedRef.current || !currentUser) return;

    createPostView(post.id);
    hasViewedRef.current = true;
  }, [post, currentUser]);

  return (
    <main>
      <GoBack href={`/${username}`}>
        <p className="text-3xl font-bold">Post</p>
      </GoBack>

      <PostItem
        block={block}
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
