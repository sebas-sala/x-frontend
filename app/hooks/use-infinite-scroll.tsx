import { useState, useEffect, useRef } from "react";

import type { PaginatedResult } from "~/types";

interface UseInfiniteScrollProps<T> {
  initialData: T[];
  page: number;
  hasNextPage?: boolean;
  fetchMore: (page: number) => Promise<PaginatedResult<T>>;
}

export function useInfiniteScroll<T>({
  initialData,
  page,
  hasNextPage,
  fetchMore,
}: UseInfiniteScrollProps<T>) {
  const [data, setData] = useState<T[]>(initialData);
  const [currentPage, setCurrentPage] = useState(page);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const attempts = useRef(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        if (
          entries[0].isIntersecting &&
          !loading &&
          !error &&
          hasNextPage &&
          attempts.current < 3
        ) {
          setLoading(true);

          try {
            const res = await fetchMore(currentPage);
            const newData = res.data;

            if (newData.length === 0) {
              observer.disconnect();
            } else {
              setData((prevData) => [...prevData, ...newData]);
              setCurrentPage((prevPage) => prevPage + 1);
            }
          } catch {
            attempts.current += 1;
            setError("Failed to load more posts. Try again later.");
          } finally {
            setLoading(false);
          }
        }
      },
      { threshold: 1 }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [loading, currentPage, fetchMore, error, hasNextPage]);

  return { data, loadMoreRef, loading, error };
}
