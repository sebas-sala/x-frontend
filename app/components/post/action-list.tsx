import { useState, useCallback, type SetStateAction } from "react";

import { cn } from "~/lib/utils";
import { getActionColorName, getActionIconColor } from "~/lib/color-utils";

import type { ActionProps } from "~/types/actions";

interface ActionItemProps {
  item: ActionProps;
  isHovered: boolean;
  entityId?: string;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const ActionItem = ({
  item,
  isHovered,
  entityId,
  onMouseEnter,
  onMouseLeave,
}: ActionItemProps) => {
  const colorIcon = getActionIconColor(item.name);
  const colorName = getActionColorName(item.name);

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!entityId || !item.handleAction) return;

    item.handleAction(entityId);
  };

  return (
    <div
      className="z-40 flex cursor-pointer items-center"
      key={item.name}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={handleClick}
      role="button"
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          handleClick(event as unknown as React.MouseEvent);
        }
      }}
      tabIndex={0}
    >
      <span
        className={cn("rounded-full p-2 transition-all duration-200", {
          [colorIcon]: isHovered,
        })}
      >
        {item.icon()}
      </span>
      <span
        className={cn("text-sm font-semibold transition-all duration-200", {
          [colorName]: isHovered,
        })}
      >
        {item.name}
      </span>
    </div>
  );
};

interface ActionListProps {
  actions: ActionProps[];
  entityId?: string;
}

export function ActionList({ entityId, actions }: ActionListProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleMouseEnter = useCallback(
    (index: SetStateAction<number | null>) => {
      setHoveredIndex(index);
    },
    [],
  );

  const handleMouseLeave = useCallback(() => {
    setHoveredIndex(null);
  }, []);

  return (
    <div className="mt-2 flex w-full justify-between font-semibold text-gray-500">
      {actions.map((item, index) => (
        <ActionItem
          key={item.name}
          item={item}
          entityId={entityId}
          isHovered={hoveredIndex === index}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
        />
      ))}
    </div>
  );
}
