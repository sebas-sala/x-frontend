import { useState } from "react";

import { PostDialog } from "./post-dialog";
import { PostDrawer } from "./post-drawer";

import { useMediaQuery } from "~/hooks/use-media-query";

export function PostButton() {
  const [open, setOpen] = useState(false);
  const [privacy, setPrivacy] = useState("public");

  const isDesktop = useMediaQuery({
    mediaQuery: "(min-width: 768px)",
  });

  const handlePrivacyChange = (privacy: string) => {
    setPrivacy(privacy);
  };

  const handleOnOpenChange = (open: boolean) => {
    setOpen(open);
  };

  if (isDesktop) {
    return (
      <PostDialog
        open={open}
        privacy={privacy}
        handleOnOpenChange={handleOnOpenChange}
        handlePrivacyChange={handlePrivacyChange}
      />
    );
  }

  return (
    <PostDrawer
      open={open}
      privacy={privacy}
      handleOnOpenChange={handleOnOpenChange}
      handlePrivacyChange={handlePrivacyChange}
    />
  );
}
