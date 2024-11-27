import { cn } from "~/lib/utils";
import { Link, type LinkProps } from "@remix-run/react";

interface Props extends LinkProps {
  isActive?: boolean;
}

export default function NavLink({ children, isActive, ...props }: Props) {
  return (
    <Link
      className={cn(
        "relative flex w-fit items-center gap-2 space-x-4 rounded-full p-3 text-xl font-medium leading-6 transition hover:bg-gray-200",
        isActive && "font-black",
      )}
      {...props}
    >
      {children}
    </Link>
  );
}

interface NavLinkButtonProps {
  children: React.ReactNode;
}

export function NavLinkButton({ children, ...props }: NavLinkButtonProps) {
  return (
    <span
      className={cn(
        "relative flex w-fit cursor-pointer items-center gap-2 space-x-4 rounded-full p-3 text-xl font-medium leading-6 transition hover:bg-gray-200",
      )}
      {...props}
    >
      {children}
    </span>
  );
}
