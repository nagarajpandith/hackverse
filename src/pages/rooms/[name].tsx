import { PreJoin, LocalUserChoices } from "@livekit/components-react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { AiFillSetting, AiOutlineCopy } from "react-icons/ai";
import ActiveRoom from "@/components/activeRoom";
import Head from "next/head";
import FullScreenLoader from "@/components/fullScreenLoader";

const Home: NextPage = () => {
  const router = useRouter();
  const { name: roomName } = router.query;
  const { data: session, status } = useSession();
  const [preJoinChoices, setPreJoinChoices] = useState<
    LocalUserChoices | undefined
  >(undefined);

  const [selectedCode, setSelectedCode] = useState("en-US");
  if (status === "loading") return <FullScreenLoader />;
  if (!session) signIn("google");

  const languageCodes = [
    {
      language: "English",
      code: "en-US",
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
      <Head>
        <title>AudioWiz</title>
        <meta name="description" content="AudioWiz" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main data-lk-theme="default">
        {roomName && !Array.isArray(roomName) && preJoinChoices ? (
          <>
            <ActiveRoom
              roomName={roomName}
              userChoices={preJoinChoices}
              onLeave={() => setPreJoinChoices(undefined)}
              userId={session?.user.id as string}
              selectedLanguage={selectedCode}
            ></ActiveRoom>
            <div
              className="lk-prejoin"
              style={{
                width: "100%",
              }}
            >
              <label className="flex items-center justify-center gap-2">
                <span className="flex items-center space-x-2 text-center text-xs lg:text-sm">
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
            </div>
          </>
        ) : (
          <div className="flex h-screen flex-col items-center justify-center">
            <div className="lk-prejoin flex flex-col gap-3">
              <div className="text-2xl font-bold">
                Hey, {session?.user.name}!
              </div>
              <div className="text-sm font-normal">
                You are joining{" "}
                <span className="gradient-text font-semibold">{roomName}</span>
                <AiOutlineCopy
                  onClick={() => {
                    navigator.clipboard.writeText(roomName as string);
                  }}
                  className="ml-1 inline-block"
                />
              </div>
              <label>
                <span>Choose your Language</span>
              </label>
              <select
                className="lk-button"
                onChange={(e) => setSelectedCode(e.target.value)}
              >
                {languageCodes.map((language) => (
                  <option value={language.code}>{language.language}</option>
                ))}
              </select>
            </div>
            <PreJoin
              onError={(err) =>
                console.log("Error while setting up prejoin", err)
              }
              defaults={{
                username: session?.user.name as string,
                videoEnabled: true,
                audioEnabled: true,
              }}
              onSubmit={(values) => {
                console.log("Joining with: ", values);
                setPreJoinChoices(values);
              }}
            ></PreJoin>
          </div>
        )}
      </main>
    </>
  );
};

export default Home;
