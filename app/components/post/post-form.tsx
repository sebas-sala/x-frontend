import { toast } from "sonner";
import { useState } from "react";

import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";

import { createPost } from "~/services/post";
import { File, Loader2Icon } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";

interface Props {
  type?: "post" | "comment";
  parentId?: string;
  handleOnOpenChange: (open: boolean) => void;
}

export default function PostForm({
  type,
  parentId,
  handleOnOpenChange,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("Hello, World!");
  const [alertOpen, setAlertOpen] = useState(false);

  const [file, setFile] = useState<File | null>(null);

  const handlePost = async (event: React.FormEvent) => {
    try {
      setAlertOpen(false);
      setLoading(true);
      event.preventDefault();

      await createPost({
        content,
        file,
        parentId,
      });

      handleOnOpenChange(false);
    } catch (e) {
      toast(String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form>
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

      <div className="mt-4">
        <label className="flex cursor-pointer items-center space-x-2">
          <File className="h-6 w-6 text-gray-500" />
          <span className="text-gray-500">Upload File</span>
          <input
            type="file"
            className="hidden"
            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
          />
        </label>
        {file && (
          <div className="mt-2 flex w-full items-center justify-center">
            <img
              src={file ? URL.createObjectURL(file) : ""}
              className="mt-2 max-h-48 w-auto rounded-lg shadow-lg"
              alt="File"
            />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <AlertDialog open={alertOpen}>
          <AlertDialogTrigger asChild>
            <Button
              className="rounded-full bg-sky-500 px-6 text-xl font-bold hover:bg-sky-400"
              disabled={!content || content.length < 10 || loading}
              onClick={() => setAlertOpen(true)}
            >
              {loading && <Loader2Icon className="mr-2 h-6 w-6 animate-spin" />}
              {type === "comment" ? "Reply" : "Post"}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => setAlertOpen(false)}
                disabled={loading}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction disabled={loading} onClick={handlePost}>
                {loading && (
                  <Loader2Icon className="mr-2 h-6 w-6 animate-spin" />
                )}
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </form>
  );
}
