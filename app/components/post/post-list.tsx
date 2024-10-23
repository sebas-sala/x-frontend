import { PostItem } from "./post-item";

import type { Post } from "~/types/post";

interface Props {
  posts: Post[];
}

export function PostList({ posts }: Props) {
  return (
    <ul>
      {posts.map((post) => (
        <PostItem key={post.id} post={post} />
      ))}
    </ul>
  );
}
