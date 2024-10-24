import { useState, useEffect, useRef } from "react";
import { PaginatedResult } from "~/types";

interface UseInfiniteScrollProps<T> {
  initialData: T[];
  hasNextPage: boolean;
  fetchMore: (page: number) => Promise<PaginatedResult<T>>;
}

export function useInfiniteScroll<T>({
  initialData,
  fetchMore,
  hasNextPage,
}: UseInfiniteScrollProps<T>) {
  const [data, setData] = useState<T[]>(initialData);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const attempts = useRef(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        if (
          entries[0].isIntersecting &&
          !loading &&
          hasNextPage &&
          attempts.current < 3
        ) {
          setLoading(true);
          attempts.current += 1;

          try {
            const res = await fetchMore(currentPage);
            const newData = res.data;

            setData((prevData) => [...prevData, ...newData]);
            setCurrentPage((prev) => prev + 1);
          } catch (error) {
            console.error("Error loading more data:", error);
          } finally {
            setLoading(false);
          }
        }
      },
      { threshold: 1.0 }
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
  }, [loading, currentPage, fetchMore, hasNextPage]);

  return { data, loadMoreRef, loading, hasNextPage };
}
