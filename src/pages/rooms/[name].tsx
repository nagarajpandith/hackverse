import {
  LiveKitRoom,
  PreJoin,
  LocalUserChoices,
  VideoConference,
  formatChatMessageLinks,
} from "@livekit/components-react";
import { LogLevel, RoomOptions, VideoPresets } from "livekit-client";

import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";
import { DebugMode } from "../../lib/Debug";
import { api } from "@/utils/api";
import { signIn, useSession } from "next-auth/react";
import { AiFillSetting } from "react-icons/ai";

const Home: NextPage = () => {
  const router = useRouter();
  const { name: roomName } = router.query;
  const { data: session, status } = useSession();
  const [preJoinChoices, setPreJoinChoices] = useState<
    LocalUserChoices | undefined
  >(undefined);
  const [selectedCode, setSelectedCode] = useState("en");
  if (status === "loading") return <div>Loading...</div>;
  if (!session) signIn("google");

  const languageCodes = [
    {
      language: "English",
      code: "en-US",
    },
    {
      language: "Hindi",
      code: "hi-IN",
    },
    {
      language: "Japanese",
      code: "ja-JP",
    },
    {
      language: "French",
      code: "fr-FR",
    },
    {
      language: "Deutsch",
      code: "de-DE",
    },
  ];

  return (
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
            <div className="text-2xl font-bold">Hey, {session?.user.name}!</div>
            <div className="text-sm font-normal">
              You are joining <span className="font-semibold">{roomName}</span>
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
  );
};

export default Home;

type ActiveRoomProps = {
  userChoices: LocalUserChoices;
  roomName: string;
  region?: string;
  onLeave?: () => void;
  userId: string;
  selectedLanguage: string;
};

const ActiveRoom = ({
  roomName,
  userChoices,
  onLeave,
  userId,
  selectedLanguage,
}: ActiveRoomProps) => {
  const { data, error, isLoading } = api.rooms.joinRoom.useQuery({ roomName });

  const router = useRouter();
  const { region, hq } = router.query;
  const setQueue = (transcribed: string) => {
    if (transcribed === transcription) {
      return;
    }

    setTranscription(transcription);
  };
  const roomOptions = useMemo((): RoomOptions => {
    return {
      videoCaptureDefaults: {
        deviceId: userChoices.videoDeviceId ?? undefined,
        resolution: hq === "true" ? VideoPresets.h2160 : VideoPresets.h720,
      },
      publishDefaults: {
        videoSimulcastLayers:
          hq === "true"
            ? [VideoPresets.h1080, VideoPresets.h720]
            : [VideoPresets.h540, VideoPresets.h216],
      },
      audioCaptureDefaults: {
        deviceId: userChoices.audioDeviceId ?? undefined,
      },
      adaptiveStream: { pixelDensity: "screen" },
      dynacast: true,
    };
  }, [userChoices, hq]);

  const [transcription, setTranscription] = useState("");
  const socketRef = useRef<WebSocket | null>(null);
  const socket = new WebSocket("wss://api.deepgram.com/v1/listen?model=nova", [
    "token",
    process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY!,
  ]);
  useEffect(() => {
    console.log("Running transcription");

    //Add microphone access
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      if (!MediaRecorder.isTypeSupported("audio/webm"))
        return alert("Browser not supported");
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });

      socket.onopen = () => {
        console.log({ event: "onopen" });
        mediaRecorder.addEventListener("dataavailable", async (event) => {
          if (event.data.size > 0 && socket.readyState === 1) {
            socket.send(event.data);
          }
        });
        mediaRecorder.start(1000);
      };

      socket.onmessage = (message) => {
        const received = message && JSON.parse(message?.data);
        const transcript = received.channel?.alternatives[0].transcript;
        if (transcript) {
          console.log(transcript);
          setQueue(transcript);
        }
      };

      socket.onclose = () => {
        console.log({ event: "onclose" });
      };

      socket.onerror = (error) => {
        console.log({ event: "onerror", error });
      };

      socketRef.current = socket;
    });
  });

  return (
    <>
      {data && (
        <LiveKitRoom
          token={data.accessToken}
          serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_API_HOST}
          options={roomOptions}
          video={userChoices.videoEnabled}
          audio={userChoices.audioEnabled}
          onDisconnected={onLeave}
        >
          <div className="closed-captions-wrapper z-50">
            <div className="closed-captions-container">
              <div className="closed-captions-text">{transcription}</div>
            </div>
          </div>
          <VideoConference chatMessageFormatter={formatChatMessageLinks} />
          <DebugMode logLevel={LogLevel.info} />
        </LiveKitRoom>
      )}
    </>
  );
};
