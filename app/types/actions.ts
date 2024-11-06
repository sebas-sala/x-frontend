export interface ActionProps {
  name: string;
  icon: () => JSX.Element;
  handleAction?: (entityId: string) => Promise<void> | void;
}
