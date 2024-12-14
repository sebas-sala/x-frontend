import { useState } from "react";

import { PostDialog } from "./post-dialog";

export function PostButton() {
  const [open, setOpen] = useState(false);

  // const isDesktop = useMediaQuery({
  //   mediaQuery: "(min-width: 768px)",
  // });

  const handleOnOpenChange = (open: boolean) => {
    setOpen(open);
  };

  // if (isDesktop) {
  // }
  return <PostDialog open={open} handleOnOpenChange={handleOnOpenChange} />;

  // return <PostDrawer open={open} handleOnOpenChange={handleOnOpenChange} />;
}
