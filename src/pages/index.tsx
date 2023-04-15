import type { NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import { api } from "@/utils/api";
import { AiOutlineVideoCameraAdd } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import JoinRoom from "@/components/join";
import Image from "next/image";

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
            <div className="flex items-center justify-center space-x-2">
              {session ? (
                <>
                  {session?.user.image && (
                    <Image
                      src={session?.user.image}
                      alt="User Image"
                      width={30}
                      height={30}
                      className="rounded-full"
                    />
                  )}
                  <a>{session?.user.name}</a>
                </>
              ) : (
                <>
                  <a>Not Signed in</a>
                  <button
                    className="lk-button"
                    onClick={() => {
                      if (session) {
                        signOut();
                      } else {
                        signIn("google");
                      }
                    }}
                  >
                    {session ? (
                      "Sign Out"
                    ) : (
                      <div className="flex items-center space-x-2">
                        <FcGoogle />
                        <div>Sign In</div>
                      </div>
                    )}
                  </button>
                </>
              )}
            </div>
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
