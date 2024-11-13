import { Link } from "@remix-run/react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { cn } from "~/lib/utils";
import { useShadow } from "~/hooks/use-shadow";
import { ArrowLeftIcon } from "lucide-react";

interface IProps extends React.HTMLProps<HTMLDivElement> {
  href: string;
}

export function GoBack({ children, href }: IProps) {
  const { isShadow } = useShadow();

  return (
    <div
      className={cn(
        "transition-shadow duration-300",
        { "shadow-md": isShadow },
        "w sticky top-0 z-10 flex items-center gap-4 bg-white px-4 py-1",
      )}
    >
      <div className="flex items-center">
        <Link
          to={href}
          className="rounded-full p-2 transition-colors hover:bg-gray-200"
        >
          <ArrowLeftIcon />
        </Link>
      </div>
      <div>{children}</div>
    </div>
  );
}
