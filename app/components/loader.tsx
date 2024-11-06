import React from "react";
import { LoaderIcon } from "lucide-react";

import { cn } from "~/lib/utils";

type LoaderProps = {
  loading?: boolean;
  loadMore?: boolean;
  size?: number;
  loadingClass?: string;
  containerClass?: string;
  loaderType: "spinner" | "dots" | "pinwheel";
  children?: React.ReactNode;
};

const Loader = React.forwardRef<HTMLDivElement, LoaderProps>(
  (
    { size = 32, loadingClass, containerClass, children, loading, loadMore },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn("my-10 flex justify-center", containerClass)}
      >
        {loading && (
          <LoaderIcon
            size={size}
            className={cn("animate-spin", loadingClass)}
          />
        )}
        {!loading && !loadMore && <>{children}</>}
      </div>
    );
  },
);
Loader.displayName = "Loader";

export { Loader };
