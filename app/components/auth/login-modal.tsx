import { useState } from "react";
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
import { login } from "~/services/auth";

type Props = {
  visible: boolean;
  onChange: (visible: boolean) => void;
};

export function LoginModal({ visible, onChange }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!username || !password) {
      toast.error("Username and password are required");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      await login({ username, password });
    } catch (error) {
      toast.error(String(error));
    } finally {
      onChange(false);
    }
  }

  return (
    <Dialog open={visible} onOpenChange={onChange}>
      <DialogTrigger>
        <div className="sr-only" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-black text-whiteh">
        <form className="sm:max-w-md space-y-4" onSubmit={handleSubmit}>
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
              placeholder="Username"
              className="w-full"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Password"
              className="w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <DialogFooter className="justify-end mt-10">
            <DialogClose asChild>
              <Button
                type="button"
                variant="ghost"
                className="hover:bg-opacity-20 hover:bg-zinc-700 hover:text-white"
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
