import { useLoaderData, useParams, useRouteError } from "@remix-run/react";

import { GoBack } from "~/components/go-back";
import { PostItem } from "~/components/post/post-item";

import { getSession } from "~/sessions";
import { createPostView, getPost, getPosts } from "~/services/post";

import { usePostStore } from "~/store/post";
import { useUserStore } from "~/store/user";

import type { Post } from "~/types/post";
import { useAuthStore } from "~/store/auth";
import { useCallback, useEffect, useRef } from "react";
import { ErrorPage } from "~/components/error-page";
import { usePostData } from "~/hooks/use-post-data";
import { PostList } from "~/components/post/post-list";

export const loader = async ({
  params,
  request,
}: {
  params: { username: string; postId: string };
  request: Request;
}) => {
  try {
    const { postId } = params;

    const session = await getSession(request);
    const token = session.get("token");

    const [postResponse, commentResponse] = await Promise.all([
      getPost({ postId, token }),
      getPosts({ filters: [{ by_parent: postId, by_reply: true }], token }),
    ]);

    return {
      postResponse,
      commentResponse,
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
  const { postId } = useParams();

  return <PostPageContent key={postId} />;
}

function PostPageContent() {
  const { username, postId } = useParams();

  const { postResponse, commentResponse } = useLoaderData<typeof loader>();

  const post = postResponse.data;

  const follow = useCallback(
    (userId: string) => useUserStore.getState().follow(userId),
    [],
  );
  const unfollow = useCallback(
    (userId: string) => useUserStore.getState().unfollow(userId),
    [],
  );
  const block = useCallback(
    (userId: string) => useUserStore.getState().block(userId),
    [],
  );

  const like = useCallback(
    (entityId: string) => usePostStore.getState().like(entityId),
    [],
  );
  const unlike = useCallback(
    (entityId: string) => usePostStore.getState().unlike(entityId),
    [],
  );

  const currentUser = useCallback(() => useAuthStore.use.currentUser(), []);

  const hasViewedRef = useRef(false);

  useEffect(() => {
    if (post.isViewed || hasViewedRef.current || !currentUser) return;

    createPostView(post.id);
    hasViewedRef.current = true;
  }, [post, currentUser]);

  const { posts, pagination, fetchMorePosts } = usePostData({
    initialData: commentResponse.data as Post[],
    initialPagination: commentResponse.meta?.pagination,
    filters: [{ by_parent: postId, by_reply: true }],
  });

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
      <h2 className="my-4 px-2 text-2xl font-bold">Comments</h2>
      <PostList
        initialData={posts}
        pagination={pagination}
        fetchMore={fetchMorePosts}
      />
    </main>
  );
}
