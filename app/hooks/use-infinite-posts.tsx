import { useInfiniteScroll } from "react-continous-scroll";

import type { Post } from "~/types/post";
import type { Pagination } from "~/types";

interface IProps {
  initialData: Post[];
  pagination: Pagination;
  fetchMore: (page: number) => Promise<Post[]>;
  maxPage?: number;
}

export type IUseInfinitePosts = ReturnType<typeof useInfinitePosts>;

export const useInfinitePosts = ({
  initialData,
  pagination,
  fetchMore,
  maxPage,
}: IProps) => {
  const { data, loadMoreRef, loading, loadMore } = useInfiniteScroll({
    initialData,
    loadMore: pagination?.hasNextPage,
    onLoadMore: () => fetchMore(pagination.page + 1),
    maxPage,
  });

  return {
    data,
    loading,
    loadMore,
    loadMoreRef,
  };
};
