import { useState } from "react";

import { PostDialog } from "./post-dialog";

export function PostButton() {
  const [open, setOpen] = useState(false);

  const handleOnOpenChange = (open: boolean) => {
    setOpen(open);
  };

  return <PostDialog open={open} handleOnOpenChange={handleOnOpenChange} />;
}
