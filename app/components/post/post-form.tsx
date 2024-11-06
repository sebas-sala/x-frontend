import { AtSign, Globe, UserRoundCheck } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { createPost } from "~/services/post";
import { toast } from "sonner";
import { useState } from "react";
import { getUser } from "~/services/user";

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

  const getPrivacyTextAndIcon = () => {
    if (privacy === "public") {
      return {
        text: "Everyone can reply",
        icon: () => <Globe size={16} />,
      };
    }

    if (privacy === "followed") {
      return {
        text: "Accounts you follow",
        icon: () => <UserRoundCheck size={16} />,
      };
    }
    if (privacy === "mentioned") {
      return {
        text: "Only accounts you mention",
        icon: () => <AtSign size={16} />,
      };
    }

    return {
      text: "Private",
      icon: () => <AtSign size={16} />,
    };
  };

  const { text: privacyText, icon: privacyIcon } = getPrivacyTextAndIcon();

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
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 hover:bg-transparent"
            >
              {privacyIcon()}
              {privacyText}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Who can reply?</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={privacy}
              onValueChange={handlePrivacyChange}
            >
              <DropdownMenuRadioItem value="public">
                Everyone
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="followed">
                Accounts you follow
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="mentioned">
                Only accounts you mention
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* <Separator /> */}

      <Button
        className="rounded-full bg-sky-500 px-6 text-xl font-bold hover:bg-sky-400"
        type="submit"
        disabled={!content || content.length < 10}
      >
        Post
      </Button>
    </form>
  );
}
