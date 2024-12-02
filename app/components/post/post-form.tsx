import { toast } from "sonner";
import { useState } from "react";
import { AtSign, Globe, UserRoundCheck } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

import { createPost } from "~/services/post";

interface Props {
  privacy: string;
  handlePrivacyChange: (value: string) => void;
  handleOnOpenChange: (open: boolean) => void;
}

export default function PostForm({
  privacy,
  handlePrivacyChange,
  handleOnOpenChange,
}: Props) {
  const [content, setContent] = useState("Hello, World!");

  const handlePost = async (event: React.FormEvent) => {
    try {
      event.preventDefault();

      await createPost({ content });

      handleOnOpenChange(false);
    } catch (e) {
      toast(String(e));
    }
  };

  return (
    <form onSubmit={handlePost}>
      <div className="grid grid-cols-12 space-x-4">
        <div className="col-span-1">
          <Avatar>
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <div className="col-span-11">
          <Textarea
            placeholder="What's on your mind, Chad?"
            className="max-h-36"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <Button
          className="rounded-full bg-sky-500 px-6 text-xl font-bold hover:bg-sky-400"
          type="submit"
          disabled={!content || content.length < 10}
        >
          Post
        </Button>
      </div>
    </form>
  );
}
