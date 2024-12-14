import { Link, useFetcher, useLocation, useNavigate } from "@remix-run/react";

import NavigationLink, { NavLinkButton } from "./navigation-link";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "~/components/ui/dropdown-menu";

import { links } from "~/data/navigation";
import { PostButton } from "../post/post-button";
import { LoginModal } from "~/components/auth/login-modal";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { SignupModal } from "../auth/signup-dialog";
import { useAuthStore } from "~/store/auth";
import { MoreHorizontalIcon } from "lucide-react";

export const NavigationAside = memo(() => {
  const location = useLocation();

  const currentUser = useAuthStore.use.currentUser();

  const ref = useRef<HTMLDivElement>(null);
  const lastPositionRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentPosition = window.scrollY;
      if (currentPosition < lastPositionRef.current) {
        ref.current?.classList.remove(
          "backdrop-blur-lg",
          "backdrop-filter",
          "opacity-55",
        );
      } else {
        ref.current?.classList.add(
          "backdrop-blur-lg",
          "backdrop-filter",
          "opacity-55",
        );
      }

      lastPositionRef.current = currentPosition;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastPositionRef, ref]);

  const filteredLinks = useMemo(() => {
    return links.filter((item) => {
      if (
        item.name.toLowerCase() === "profile" ||
        item.name.toLowerCase() === "notifications" ||
        item.name.toLowerCase() === "bookmarks"
      ) {
        if (!currentUser) return null;
      }

      return item;
    });
  }, [currentUser]);

  return (
    <div
      ref={ref}
      className="top-0 z-50 h-full max-h-dvh w-full transform transition-all duration-300 md:sticky md:flex md:flex-col md:p-4"
    >
      <ul className="flex justify-evenly px-1 md:block md:space-y-2">
        {filteredLinks.map((item) => {
          if (item.name.toLowerCase() === "profile") {
            return (
              <li key={item.name}>
                <NavigationLink
                  to={`/${currentUser?.username}`}
                  isActive={location.pathname === item.href}
                >
                  {item.icon}
                  <span className="hidden md:block">{item.name}</span>
                </NavigationLink>
              </li>
            );
          }

          return (
            <li key={item.name}>
              <NavigationLink
                to={item.href}
                isActive={location.pathname === item.href}
              >
                {item.icon}

                <span className="hidden md:block">{item.name}</span>
              </NavigationLink>
            </li>
          );
        })}
        {currentUser && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <li>
                <NavLinkButton>
                  <MoreHorizontalIcon />
                  <span className="hidden md:block">More</span>
                </NavLinkButton>
              </li>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" asChild>
                <Link
                  to="/blocked-users"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  Blocked users
                </Link>
              </DropdownMenuItem>
              {/* <DropdownMenuItem className="cursor-pointer" asChild>
                  <Link to="/subscriptions">Subscriptions</Link>
                </DropdownMenuItem> */}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </ul>
      <div className="hidden md:block">
        <PostButton />
      </div>

      <div className="mt-auto hidden pt-2 md:block">
        <AuthDropdown />
      </div>
    </div>
  );
});
NavigationAside.displayName = "NavigationAside";

export const AuthDropdown = ({}) => {
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const currentUser = useAuthStore.use.currentUser();

  const handleLogout = async () => {
    await fetcher.submit({}, { method: "post", action: "/auth/logout" });
    navigate("/home");
  };

  const [visibleLoginModal, setVisibleLoginModal] = useState(false);
  const [visibleSignUpModal, setVisibleSignUpModal] = useState(false);

  const handleVisibleLoginModal = () => {
    setVisibleLoginModal(!visibleLoginModal);
  };

  const handleVisibleSignUpModal = () => {
    setVisibleSignUpModal(!visibleSignUpModal);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex h-10 w-10 items-center justify-center rounded-full border-0 bg-gray-800 ring-0">
          <Avatar>
            <AvatarImage />
            <AvatarFallback>
              {currentUser ? currentUser.username : "X"}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {currentUser ? (
            <>
              <DropdownMenuItem className="cursor-pointer" asChild>
                <Link to={`/${currentUser.username}`}>Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={handleLogout}
              >
                Log out @{currentUser.username}
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={handleVisibleLoginModal}
              >
                Login
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={handleVisibleSignUpModal}
              >
                Sign Up
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <LoginModal
        visible={visibleLoginModal}
        onChange={handleVisibleLoginModal}
      />

      <SignupModal
        visible={visibleSignUpModal}
        onChange={handleVisibleSignUpModal}
      />
    </>
  );
};
