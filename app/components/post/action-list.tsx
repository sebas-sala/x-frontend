import { useState, useCallback, type SetStateAction } from "react";

import { cn } from "~/lib/utils";
import { getActionColorName, getActionIconColor } from "~/lib/color-utils";

interface ActionItemProps {
  item: { name: string; icon: () => JSX.Element };
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const ActionItem = ({
  item,
  isHovered,
  onMouseEnter,
  onMouseLeave,
}: ActionItemProps) => {
  const colorIcon = getActionIconColor(item.name);
  const colorName = getActionColorName(item.name);

  return (
    <div
      className="flex gap-2 cursor-pointer items-center"
      key={item.name}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <span
        className={cn("p-2 rounded-full transition-all duration-200", {
          [colorIcon]: isHovered,
        })}
      >
        {item.icon()}
      </span>
      <span
        className={cn(
          "text-sm font-semibold text-white transition-all duration-200",
          {
            [colorName]: isHovered,
          }
        )}
      >
        {item.name}
      </span>
    </div>
  );
};

interface ActionListProps {
  postActions: { name: string; icon: () => JSX.Element }[];
}

export function ActionList({ postActions }: ActionListProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleMouseEnter = useCallback(
    (index: SetStateAction<number | null>) => {
      setHoveredIndex(index);
    },
    []
  );

  const handleMouseLeave = useCallback(() => {
    setHoveredIndex(null);
  }, []);

  return (
    <div className="flex justify-between w-full mt-2 text-gray-500 font-semibold">
      {postActions.map((item, index) => (
        <ActionItem
          key={item.name}
          item={item}
          isHovered={hoveredIndex === index}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
        />
      ))}
    </div>
  );
}
