import axios from "axios";
import { transliterate } from "transliteration";

let currentAudio: {
  audio: HTMLAudioElement | null;
  text: string;
} = {
  audio: null,
  text: "",
};

//check if the text is somehow relsted to old text
function isRelatedToLastSpokenText(text: string, lastSpokenText: string) {
  //find no of words common in both the strings
  const words = text.split(" ");
  const lastSpokenWords = lastSpokenText.split(" ");
  const commonWords = words.filter((word) => lastSpokenWords.includes(word));
  const commonWordsCount = commonWords.length;
  const totalWordsCount = words.length + lastSpokenWords.length;
  const commonWordsPercentage = (commonWordsCount / totalWordsCount) * 100;
  return commonWordsPercentage > 50;
}

export default async (text: string, isEmpty: boolean, lang?: string) => {
  console.log("speakOut function called with text:", text);

  let englishText = transliterate(text);
  const url = `/api/speech?text=${encodeURIComponent(englishText)}`;
  const audio = new Audio(url);

  // Pause the current audio if there is one
  if (
    !isRelatedToLastSpokenText(text, currentAudio.text) &&
    currentAudio.audio
  ) {
    currentAudio.audio.pause();
  }

  // Play the new audio
  audio.play();

  // Set the new audio as the current one
  currentAudio = { audio, text };

  currentAudio.text = text;
};
