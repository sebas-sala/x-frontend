import { Link } from "@remix-run/react";
import { Calendar } from "lucide-react";

import type { User } from "~/types/user";

export function ProfileInfo({ profile }: { profile: User }) {
  const formattedDate = new Date(profile.createdAt).toLocaleDateString(
    "en-US",
    {
      month: "short",
      year: "numeric",
    },
  );

  return (
    <div className="mt-8">
      <h4 className="text-3xl font-black">{profile.name}</h4>
      <h5 className="text-xl text-gray-500">@{profile.username}</h5>

      <div className="mt-6 flex gap-2">
        <Calendar size={24} />
        <span className="text-xl">Joined {formattedDate}</span>
      </div>

      <div className="mt-4 flex gap-4 text-lg">
        <Link to={`/${profile.username}/followers`} className="flex gap-2">
          <p className="font-semibold">0</p>
          <p className="text-gray-500">Following</p>
        </Link>
        <Link to={`/${profile.username}/following`} className="flex gap-2">
          <p className="font-semibold">0</p>
          <p className="text-gray-500">Followers</p>
        </Link>
      </div>
    </div>
  );
}
