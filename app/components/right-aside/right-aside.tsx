import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { UserItem } from "../user/user-item";
import { UserList } from "../user/user-list";
import { User } from "~/types/user";
import { getUsers } from "~/services/user";

export const RightAside = () => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (query) {
      getUsers({
        perPage: 5,
        filters: [{ by_query: query }],
      }).then((res) => {
        setUsers(res.data);
      });
    } else {
      setUsers([]);
    }
  }, [query, setUsers]);

  return (
    <div className="sticky top-0 rounded-lg bg-white p-4 shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search"
          className="w-full rounded-full border border-gray-200 p-2"
        />
      </div>
      <div className="space-y-4">
        <UserList>
          {users.map((user, index) => (
            <UserItem
              key={index}
              user={user}
              className="p-0"
              onClick={() => setQuery("")}
            />
          ))}
        </UserList>
      </div>
    </div>
  );
};
