import { useLocation } from "@remix-run/react";

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
import { useEffect, useState } from "react";
import { SignupModal } from "../auth/signup-dialog";
import { useAuthStore } from "~/store/auth";

// import PostButton from "./PostButton";
export default function NavigationAside() {
  const location = useLocation();

  const avatarUrl = "https://github.com/shadcn.png";

  const [visibleLoginModal, setVisibleLoginModal] = useState(false);
  const [visibleSignUpModal, setVisibleSignUpModal] = useState(false);

  const currentUser = useAuthStore().currentUser;

  const handleVisibleLoginModal = () => {
    setVisibleLoginModal(!visibleLoginModal);
  };

  const handleVisibleSignUpModal = () => {
    setVisibleSignUpModal(!visibleSignUpModal);
  };

  useEffect(() => {
    setTimeout(() => {
      if (!visibleLoginModal && !visibleSignUpModal) {
        document.body.style.pointerEvents = "";
      }
    }, 250);
  }, [visibleLoginModal, visibleSignUpModal]);

  return (
    <div className="h-full flex flex-col">
      <div>
        <ul className="space-y-2">
          {links.map((item) => {
            if (item.name.toLowerCase() === "profile") {
              if (!currentUser) return null;
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
          <DropdownMenuTrigger
            className="flex items-center justify-center w-10 h-10 rounded-full border-0 ring-0
            bg-gray-800"
          >
            <Avatar>
              <AvatarImage src={avatarUrl} />
              modal <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
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

            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Log out @shadcn</DropdownMenuItem>
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
