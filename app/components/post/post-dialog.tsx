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
  handleOnOpenChange: (open: boolean) => void;
}

export function PostDialog({ open, handleOnOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={handleOnOpenChange}>
      <DialogTrigger asChild>
        <Button className="mt-0 h-full rounded-full bg-sky-500 text-center text-sm font-bold md:mt-10 md:w-full md:py-8 md:text-lg">
          Post
        </Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle className="hidden">Post</DialogTitle>

          <DialogDescription className="sr-only">
            Make changes to your profile here. Click save when youre done.
          </DialogDescription>

          <div className="pt-4">
            <PostForm handleOnOpenChange={handleOnOpenChange} />
          </div>
        </DialogHeader>
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
