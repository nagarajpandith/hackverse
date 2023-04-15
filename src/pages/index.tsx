import type { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import { api } from "@/utils/api";
import { AiOutlineVideoCameraAdd } from "react-icons/ai";
import JoinRoom from "@/components/join";

function ConnectionTab() {
  const { data: session, status } = useSession();
  const createRoom = api.rooms.createRoom.useMutation();
  const router = useRouter();

  const [roomLoading, setRoomLoading] = React.useState(false);
  const createRoomHandler = async () => {
    if (status === "unauthenticated") signIn("google");
    else {
      setRoomLoading(true);
      const data = await createRoom.mutateAsync();
      setRoomLoading(false);
      router.push(`/rooms/${data.roomName}`);
    }
  };

  if (status === "loading") return <div>Loading...</div>;

  return (
    <>
      <div className="overflow-x-hidden">
        <div className="flex h-screen w-screen flex-col items-center justify-center space-y-4 p-5 text-center md:flex-row">
          <div className="w-full max-w-md space-y-4">
            Signed in as {session?.user.name}
            <div className="flex flex-col items-center justify-center space-y-4 lg:flex-row lg:space-x-4 lg:space-y-0">
              <button onClick={createRoomHandler} className="lk-button h-fit">
                {roomLoading ? (
                  <div>Loading...</div>
                ) : (
                  <>
                    <AiOutlineVideoCameraAdd />
                    Create Room
                  </>
                )}
              </button>
              {!roomLoading && <JoinRoom />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const Home: NextPage = () => {
  return (
    <>
      <main data-lk-theme="default">
        <ConnectionTab />
      </main>
    </>
  );
};

export default Home;
