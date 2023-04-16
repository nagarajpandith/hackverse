import { DebugMode } from "@/lib/Debug";
import { api } from "@/utils/api";
import speakOut from "@/utils/speakOut";
import {
  LiveKitRoom,
  LocalUserChoices,
  VideoConference,
  formatChatMessageLinks,
} from "@livekit/components-react";
import { setCORS } from "google-translate-api-browser";

const translate = setCORS("https://cors-proxy.fringe.zone/");

import {
  LogLevel,
  Room,
  RoomEvent,
  RoomOptions,
  VideoPresets,
} from "livekit-client";
import { useRouter } from "next/router";
import Pusher from "pusher-js";
import { useEffect, useMemo, useRef, useState } from "react";
import Loader from "../loader";
import FullScreenLoader from "../fullScreenLoader";
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

  //   const liveKitUrl = useServerUrl(region as string | undefined);

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
  const [transcriptionQueue, setTranscriptionQueue] = useState<
    {
      sender: string;
      message: string;
      senderId: string;
      isFinal: boolean;
    }[]
  >([]);

  const [caption, setCaption] = useState({
    sender: "",
    message: "",
  });

  const pusherMutation = api.pusher.sendTranscript.useMutation();
  const [ myTranscripts , setMyTranscripts ] = useState<string[]>([])
  useEffect(() => {
    console.log("Running transcription");
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      if (!MediaRecorder.isTypeSupported("audio/webm"))
        return alert("Browser not supported");
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });

      const webSocketUrl =
        selectedLanguage == "en-US"
          ? "wss://api.deepgram.com/v1/listen?model=nova"
          : `wss://api.deepgram.com/v1/listen?language=${selectedLanguage}`;

      const socket = new WebSocket(webSocketUrl, [
        "token",
        process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY!,
      ]);

      socket.onopen = () => {
        console.log({ event: "onopen" });
        mediaRecorder.addEventListener("dataavailable", async (event) => {
          if (event.data.size > 0 && socket.readyState === 1) {
            socket.send(event.data);
          }
        });
        mediaRecorder.start(1000);
      };

      socket.onmessage = async (message) => {
        const received = message && JSON.parse(message?.data);
        const transcript = received.channel?.alternatives[0].transcript;

        if (transcript !== "" && transcript !== undefined) {
          if(myTranscripts.includes(transcript)) return
          await pusherMutation.mutate({
            message: transcript,
            roomName: roomName,
            isFinal: true,
          });
          setMyTranscripts((prev) => [...prev, transcript])
          if (
            !(
              transcript.toLowerCase() === "is" ||
              transcription.toLowerCase() === "so"
            )
          )
            setTranscription(transcript);
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
  }, [selectedLanguage]);

  useEffect(() => {
    async function translateText() {
      console.info("transcriptionQueue", transcriptionQueue);
      if (transcriptionQueue.length > 0) {
        const res = await translate(transcriptionQueue[0]?.message as string, {
          // @ts-ignore
          to: selectedLanguage.split("-")[0],
        });
        setCaption({
          message: res.text,
          sender: transcriptionQueue[0]?.sender as string,
        });
        const isEmpty = transcriptionQueue.length === 0;
        speakOut(res.text as string, isEmpty);
        setTranscriptionQueue((prev) => prev.slice(1));
      }
    }
    translateText();

    // Hide the caption after 5 seconds
    const timer = setTimeout(() => {
      setCaption({
        message: "",
        sender: "",
      });
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [transcriptionQueue]);
  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY as string, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string,
    });
    const channel = pusher.subscribe(roomName);
    channel.bind(
      "transcribe-event",
      function (data: {
        sender: string;
        message: string;
        senderId: string;
        isFinal: boolean;
      }) {
        if (data.isFinal && userId !== data.senderId) {
          setTranscriptionQueue((prev) => {
            return [...prev, data];
          });
        }
      }
    );

    return () => {
      pusher.unsubscribe(roomName);
    };
  }, []);

  if (isLoading) return <FullScreenLoader />;
  if (error) router.push("/");

  return (
    <>
      {error && (
        <div className="flex h-full w-full items-center justify-center bg-red-500 text-white">
          {error.message}
        </div>
      )}
      {!error && data && (
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
              {caption?.message ? (
                <>
                  <div className="closed-captions-username">
                    {caption.sender}
                  </div>
                  <span>:&nbsp;</span>
                </>
              ) : null}
              <div className="closed-captions-text">{caption.message}</div>
            </div>
          </div>
          <VideoConference chatMessageFormatter={formatChatMessageLinks} />
          <DebugMode logLevel={LogLevel.info} />
        </LiveKitRoom>
      )}
    </>
  );
};

export default ActiveRoom;
