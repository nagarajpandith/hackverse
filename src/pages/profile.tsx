import { signIn, useSession } from "next-auth/react";
import Card from "@/components/card";
import { api } from "@/utils/api";
import Navbar from "@/components/navbar";
import { AiFillSetting } from "react-icons/ai";
import { useState } from "react";

function profile() {
  const { data: session, status } = useSession();
  const { data: rooms, isLoading, error } = api.rooms.getRoomsByUser.useQuery();
  const [selectedCode, setSelectedCode] = useState("en-US");

  if (status === "loading") return <div>Loading...</div>;
  if (!session && status === "unauthenticated") return signIn("google");

  const ownedRooms =
    rooms?.filter((room) => room.OwnerId === session?.user.id) || [];
  const joinedRooms =
    rooms?.filter((room) => room.OwnerId !== session?.user.id) || [];

  const languageCodes = [
    {
      language: "English",
      code: "en",
    },
    {
      language: "Hindi",
      code: "hi",
    },
    {
      language: "Japanese",
      code: "ja",
    },
    {
      language: "French",
      code: "fr",
    },
    {
      language: "Deutsch",
      code: "de",
    },
  ];

  return (
    <>
      <Navbar status={status} session={session} />
      <div className="mt-10 flex flex-col bg-black p-10 text-gray-100 lg:p-20">
        <div className="my-5 flex items-center justify-center">
          <h2 className="text-center text-2xl font-bold text-white">
            Hello {session?.user.name}!👋🏻
          </h2>
        </div>

        <label className="flex items-center justify-center gap-2">
          <span className="my-3 flex items-center space-x-2 text-center text-xs lg:text-sm">
            <AiFillSetting />
            <a>Switch Language</a>
          </span>
          <select
            className="lk-button"
            onChange={(e) => setSelectedCode(e.target.value)}
            defaultValue={selectedCode}
          >
            {languageCodes.map((language) => (
              <option value={language.code}>{language.language}</option>
            ))}
          </select>
        </label>

        <div className="flex flex-col items-center justify-center">
          <a className="text-lg font-bold text-secondary">Your Rooms</a>
          {isLoading && <div>Loading...</div>}
          {ownedRooms.length === 0 && (
            <p className="mt-2 text-xs font-light text-white">
              You haven't started a room yet
            </p>
          )}
          <div className="flex flex-row flex-wrap items-center justify-center">
            {ownedRooms.map((room) => {
              return (
                <Card selectedCode={selectedCode} room={room} key={room.name} />
              );
            })}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <a className="text-lg font-bold text-secondary">
            Rooms you are a part of
          </a>

          {joinedRooms.length === 0 && (
            <p className="mt-2 text-xs font-light text-white">
              You haven't joined any rooms yet
            </p>
          )}
          <div className="flex flex-row flex-wrap items-center justify-center">
            {joinedRooms.map((room) => {
              return (
                <Card selectedCode={selectedCode} room={room} key={room.name} />
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default profile;