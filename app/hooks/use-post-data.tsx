import { useState } from "react";

import { getPosts } from "~/services/post";

import type { Filter, Pagination } from "~/types";
import type { Post } from "~/types/post";

interface Props {
  initialData?: Post[];
  initialPagination?: Pagination;
  filters?: Filter[];
  orderBy?: string;
}

export const usePostData = ({
  initialData,
  initialPagination,
  filters,
  orderBy,
}: Props = {}) => {
  const [posts, setPosts] = useState<Post[]>(initialData || []);
  const [pagination, setPagination] = useState<Pagination>(
    initialPagination || {
      page: 0,
      perPage: 15,
      total: 0,
      totalPages: 0,
      hasPrevPage: false,
      hasNextPage: true,
    },
  );

  const fetchMorePosts = async (page: number) => {
    try {
      const res = await getPosts({ page, filters, orderBy });

      setPosts((prevPosts) => [...prevPosts, ...res.data]);
      setPagination(res.meta?.pagination);

      return res.data;
    } catch (e) {
      return [];
    }
  };

  return {
    posts,
    pagination,
    fetchMorePosts,
  };
};
