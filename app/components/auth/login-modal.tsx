import { useFetcher } from "@remix-run/react";
import { useEffect } from "react";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

import { useAuthStore } from "~/store/auth";

import type { User } from "~/types/user";
import type { ApiResponseUnion } from "~/types";
import { isApiResponse } from "~/lib/api-utils";

type Props = {
  visible: boolean;
  onChange: () => void;
};

export function LoginModal({ visible, onChange }: Props) {
  const fetcher = useFetcher();

  const setCurrentUser = useAuthStore((state) => state.setCurrentUser);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const username = form.username.value;
    const password = form.password.value;

    if (!username || !password) {
      toast.error("Username and password are required");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    fetcher.submit(
      { username, password },
      { method: "post", action: "/auth/login" },
    );
  }

  useEffect(() => {
    if (fetcher.data) {
      const data = fetcher.data as ApiResponseUnion<User>;

      if (isApiResponse(data)) {
        setCurrentUser(data.data);
      } else {
        toast.error(data.message);
      }
    }
  }, [setCurrentUser, fetcher.data, onChange]);

  return (
    <Dialog open={visible} onOpenChange={onChange}>
      <DialogTrigger className="hidden">
        <Button>Login</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form className="space-y-4 sm:max-w-md" onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Login</DialogTitle>
            <DialogDescription>
              Enter your email and password to login to your account
            </DialogDescription>
          </DialogHeader>
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              name="username"
              defaultValue={"admin"}
              placeholder="Username"
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              defaultValue={"Admin123!@#"}
              name="password"
              placeholder="Password"
              className="w-full"
            />
          </div>
          <DialogFooter className="mt-10 justify-end">
            <DialogClose asChild>
              <Button
                type="button"
                variant="ghost"
                className="hover:bg-zinc-700 hover:bg-opacity-20"
                onClick={() => onChange(false)}
              >
                Close
              </Button>
            </DialogClose>
            <Button type="submit" variant="secondary">
              Login
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
