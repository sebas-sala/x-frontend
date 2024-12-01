import { useState, useCallback, type SetStateAction } from "react";

import { ActionProps } from "./post-item";
import { ActionItem } from "./action-item";

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
