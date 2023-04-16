import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
  const { method } = req;
  if (method === "GET") {
    const { text } = req.query;
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
      text as string
    )}&tl=hi&client=tw-ob`;
    const response = await fetch(url, {
      headers: {
        Referer: "http://translate.google.com/",
        "User-Agent": "stagefright/1.2 (Linux;Android 5.0)",
      },
    });
    const audioData = await response.arrayBuffer();
    res.setHeader("Content-Type", "audio/mpeg");
    res.send(Buffer.from(audioData));
  }
};
export default handler;
