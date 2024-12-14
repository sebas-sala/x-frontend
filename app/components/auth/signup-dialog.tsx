import { useEffect, useState } from "react";
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

import { signup } from "~/services/auth";

type Props = {
  visible: boolean;
  onChange: (visible: boolean) => void;
};

export function SignupModal({ visible, onChange }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!email || !password || !username || !name) {
      toast.error("Email, username, password, and name are required");
      return;
    }

    if (name.length < 3) {
      toast.error("Name must be at least 3 characters");
      return;
    }

    if (username.length < 3) {
      toast.error("Username must be at least 3 characters");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      await signup({ email, name, username, password });
      onChange(false);
    } catch (error) {
      toast.error(String(error));
    }
  }

  useEffect(() => {
    if (!visible) {
      setName("");
      setEmail("");
      setPassword("");
      setUsername("");
    }
  }, [visible]);

  return (
    <Dialog open={visible} onOpenChange={onChange}>
      <DialogTrigger className="hidden">
        <Button variant="secondary">Sign Up</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form className="space-y-4 sm:max-w-md" onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Sign Up</DialogTitle>
            <DialogDescription>
              Enter your email, username, and password to create an account
            </DialogDescription>
          </DialogHeader>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Email"
              className="w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Name"
              className="w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
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
