import { useState, useEffect, useRef } from "react";

interface UseInfiniteScrollProps<T> {
  initialData: T[];
  hasNextPage?: boolean;
  fetchMore: (page: number) => Promise<T[]>;
}

export function useInfiniteScroll<T>({
  initialData,
  hasNextPage,
  fetchMore,
}: UseInfiniteScrollProps<T>) {
  const [data, setData] = useState<T[]>(initialData);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // Para manejar errores
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && !error && hasNextPage) {
          setLoading(true);
          fetchMore(page + 1)
            .then((newData) => {
              if (newData.length === 0) {
                observer.disconnect();
              } else {
                setData((prevData) => [...prevData, ...newData]);
                setPage((prevPage) => prevPage + 1);
              }
            })
            .catch(() => {
              setError("Failed to load more posts. Try again later.");
            })
            .finally(() => {
              setLoading(false);
            });
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
  }, [loading, page, fetchMore, error, hasNextPage]);

  return { data, loadMoreRef, loading, error };
}
