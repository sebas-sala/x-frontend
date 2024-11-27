import React from "react";

interface IProps extends React.HTMLProps<HTMLUListElement> {}

export const UserList: React.FC<IProps> = ({ children }) => {
  return (
    <>
      <ul className="space-y-2">{children}</ul>
    </>
  );
};
