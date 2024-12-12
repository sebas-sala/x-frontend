import { Button } from "../ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";

interface Props {
  open: boolean;
  handleOnOpenChange: (open: boolean) => void;
}

export function PostDrawer({ open, handleOnOpenChange }: Props) {
  return (
    <Drawer open={open} onOpenChange={handleOnOpenChange}>
      <DrawerTrigger asChild>
        <Button
          className="rounded-full bg-sky-500 px-6 text-xl font-bold hover:bg-sky-400"
          onClick={() => handleOnOpenChange(false)}
        >
          Post
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerDescription>
            Make changes to your profile here. Click save when youre done.
          </DrawerDescription>
        </DrawerHeader>

        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
