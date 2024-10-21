import { cn } from "~/lib/utils";
import { Link, type LinkProps } from "@remix-run/react";

interface Props extends LinkProps {
  children: React.ReactNode;
  isActive?: boolean;
}

export default function NavLink({ children, isActive, ...props }: Props) {
  return (
    <Link
      className={cn(
        "space-x-4 relative flex hover:bg-gray-700 p-3 w-fit rounded-full text-xl items-center gap-2 font-medium leading-6 ",
        isActive && "font-black"
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
