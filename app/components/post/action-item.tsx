import { ActionProps } from "~/components/post/post-item";

import { cn, formatNumber } from "~/lib/utils";
import { getActionColorName, getActionIconColor } from "~/lib/color-utils";

interface ActionItemProps {
  item: ActionProps;
  isHovered: boolean;
  entityId?: string;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export const ActionItem = ({
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
      {item.count && (item.count ?? 0) && (
        <span
          className={cn("text-sm font-semibold transition-all duration-200", {
            [colorName]: isHovered,
          })}
        >
          {formatNumber(item.count)}
        </span>
      )}
    </div>
  );
};
