import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog";
import PostForm from "./post-form";

interface Props {
  open: boolean;
  privacy: string;
  handleOnOpenChange: (open: boolean) => void;
  handlePrivacyChange: (privacy: string) => void;
}

export function PostDialog({
  open,
  privacy,
  handleOnOpenChange,
  handlePrivacyChange,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={handleOnOpenChange}>
      <DialogTrigger asChild>
        <Button className="text-center  w-full bg-sky-500 font-bold py-8 text-lg mt-10 rounded-full">
          Post
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-black text-white ">
        <DialogHeader>
          <DialogTitle className="hidden">Post</DialogTitle>

          <DialogDescription className="sr-only">
            Make changes to your profile here. Click save when youre done.
          </DialogDescription>

          <div className="pt-4">
            <PostForm
              privacy={privacy}
              handlePrivacyChange={handlePrivacyChange}
              handleOnOpenChange={handleOnOpenChange}
            />
          </div>
        </DialogHeader>
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
