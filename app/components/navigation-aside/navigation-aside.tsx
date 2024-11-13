import { Link, useFetcher, useLocation } from "@remix-run/react";

import NavigationLink from "./navigation-link";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

import { links } from "~/data/navigation";
import { PostButton } from "../post/post-button";
import { LoginModal } from "~/components/auth/login-modal";
import { useEffect, useMemo, useState } from "react";
import { SignupModal } from "../auth/signup-dialog";
import { useAuthStore } from "~/store/auth";

// import PostButton from "./PostButton";
export default function NavigationAside() {
  const location = useLocation();
  const fectcher = useFetcher();

  const avatarUrl = "https://github.com/shadcn.png";

  const [visibleLoginModal, setVisibleLoginModal] = useState(false);
  const [visibleSignUpModal, setVisibleSignUpModal] = useState(false);

  const currentUser = useAuthStore().currentUser;
  const setCurrentUser = useAuthStore().setCurrentUser;

  const handleVisibleLoginModal = () => {
    setVisibleLoginModal(!visibleLoginModal);
  };

  const handleVisibleSignUpModal = () => {
    setVisibleSignUpModal(!visibleSignUpModal);
  };

  async function handleLogout() {
    fectcher.submit({ method: "post", action: "/auth/logout" });
    setCurrentUser(undefined);
  }

  useEffect(() => {
    setTimeout(() => {
      if (!visibleLoginModal && !visibleSignUpModal) {
        document.body.style.pointerEvents = "";
      }
    }, 250);
  }, [visibleLoginModal, visibleSignUpModal]);

  const filteredLinks = useMemo(() => {
    return links.filter((item) => {
      if (item.name.toLowerCase() === "profile") {
        if (!currentUser) return null;
      }

      return item;
    });
  }, [currentUser]);

  return (
    <div className="sticky top-0 flex h-full max-h-dvh flex-col p-4">
      <div>
        <ul className="space-y-2">
          {filteredLinks.map((item) => {
            if (item.name.toLowerCase() === "profile") {
              return (
                <li key={item.name}>
                  <NavigationLink
                    to={`/${currentUser?.username}`}
                    isActive={location.pathname === item.href}
                  >
                    {item.icon}
                    <span>{item.name}</span>
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
                  <span>{item.name}</span>
                </NavigationLink>
              </li>
            );
          })}
        </ul>
        <div>
          <PostButton />
        </div>
      </div>
      <div className="mt-auto">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex h-10 w-10 items-center justify-center rounded-full border-0 bg-gray-800 ring-0">
            <Avatar>
              <AvatarImage src={avatarUrl} />
              modal <AvatarFallback>CN</AvatarFallback>
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
                  Log out @shadcn
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
      </div>

      <LoginModal
        visible={visibleLoginModal}
        onChange={handleVisibleLoginModal}
      />

      <SignupModal
        visible={visibleSignUpModal}
        onChange={handleVisibleSignUpModal}
      />
    </div>
  );
}
