import { Tab } from "@headlessui/react";
import { setCORS } from "google-translate-api-browser";
import { useEffect, useState } from "react";
const translate = setCORS("https://cors-proxy.fringe.zone/");

function classNames(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Tabs({
  summary,
  transcriptions,
  selectedCode,
}: {
  summary: string;
  transcriptions: string[];
  selectedCode: string;
}) {
  const utterances = transcriptions.map((transcription) => {
    return {
      utterance: transcription,
    };
  });

  const [translatedTranscriptions, setTranslatedTranscriptions] = useState<
    string[]
  >([]);

  async function translateText(text: string) {
    console.log("inside translate");

    const res = await translate(text, {
      //@ts-ignore
      to: selectedCode.split("-")[0],
    });

    return res.text;
  }

  useEffect(() => {
    async function translateUtterances() {
      const translatedUtterances = await Promise.all(
        utterances.map(async (utterance) => {
          const translatedUtterance = await translateText(
            //@ts-ignore
            utterance.utterance.utterance
          );
          return {
            utterance: JSON.stringify(translatedUtterance),
          };
        })
      );

      setTranslatedTranscriptions(
        translatedUtterances.map((utterance) => utterance.utterance)
      );
    }

    if (selectedCode !== "en" && utterances.length > 0) {
      translateUtterances();
    }
  }, [selectedCode]);

  const [translatedSummary, setTranslatedSummary] = useState<string>("");
  useEffect(() => {
    async function translateSummary() {
      const translatedSummary = await translateText(summary);
      setTranslatedSummary(translatedSummary);
    }

    if (selectedCode !== "en") {
      translateSummary();
    }
  }, [selectedCode]);

  return (
    <div className="w-full max-w-md px-2 py-16 sm:px-0">
      <Tab.Group>
        <Tab.List className="flex gap-10 rounded-xl bg-gray-900/60 p-1">
          <Tab
            className={({ selected }) =>
              classNames(
                "w-full rounded-lg py-2.5 text-sm font-medium leading-5 ",
                " ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                selected
                  ? "bg-secondary/10 shadow"
                  : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
              )
            }
          >
            Summary
          </Tab>

          <Tab
            className={({ selected }) =>
              classNames(
                "w-full rounded-lg py-2.5 text-sm font-medium leading-5 ",
                "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                selected
                  ? "bg-secondary-300/10 shadow"
                  : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
              )
            }
          >
            Transcription
          </Tab>
        </Tab.List>
        <Tab.Panels className="mt-2 space-x-10">
          <Tab.Panel>
            <p className="p-5 text-lg text-white">
              {translatedSummary ? translatedSummary : summary}
            </p>
          </Tab.Panel>
          <Tab.Panel>
            {transcriptions.map((transcription: any, index) => {
              return (
                <div className="bg-white-opacity-5 w-full p-5" key={index}>
                  <h2 className="text-white">{transcription?.speaker}</h2>
                  <p className="font-lg text-white">
                    {/* {transcription.utterance} */}
                    {translatedTranscriptions[index]
                      ? translatedTranscriptions[index]
                      : transcription.utterance}
                  </p>
                  <div className="text-sm font-bold text-gray-100 text-opacity-50">
                    {new Date(transcription.timestamp).toLocaleDateString(
                      "en-IN",
                      {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      }
                    )}{" "}
                    |{" "}
                    {new Date(transcription.timestamp).toLocaleTimeString(
                      "en-IN",
                      {
                        hour: "numeric",
                        minute: "numeric",
                        second: "numeric",
                      }
                    )}
                  </div>
                </div>
              );
            })}
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
