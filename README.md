# AudioWiz

### Multilingual Live Video conferencing

# Description

Live Video Conferencing app which transcribes, translates and speaks out the text to all users on the call in realtime. Also provides with the meeting minutes/summary of the meeting.

# Tech Stack

- NextJS
- Typescript
- Livekit
- Pusher
- Deepgram Nova AI
- tRPC
- TailwindCSS
- Prisma
- MySQL

# Installation Steps

1. ```bash
   git clone https://github.com/nagarajpandith/hackverse
   ```

2. cd hackverse

3. ```bash
   npm i
   npm run dev
   ```

Note: Populate env vars by copying the .env.example file

# Libraries and Dependencies

```json
"dependencies": {
"@headlessui/react": "^1.7.14",
"@livekit/components-react": "^0.7.3",
"@livekit/components-styles": "^0.3.1",
"@next-auth/prisma-adapter": "^1.0.5",
"@prisma/client": "^4.11.0",
"@tanstack/react-query": "^4.28.0",
"@trpc/client": "^10.18.0",
"@trpc/next": "^10.18.0",
"@trpc/react-query": "^10.18.0",
"@trpc/server": "^10.18.0",
"@vitalets/google-translate-api": "^9.1.0",
"axios": "^1.3.5",
"google-translate-api-browser": "^3.0.1",
"livekit-client": "^1.7.1",
"livekit-server-sdk": "^1.1.4",
"next": "^13.2.4",
"next-auth": "^4.21.0",
"openai": "^3.2.1",
"pusher": "^5.1.2",
"pusher-js": "^8.0.2",
"react": "18.2.0",
"react-dom": "18.2.0",
"react-icons": "^4.8.0",
"superjson": "1.12.2",
"transliteration": "^2.3.5",
"zod": "^3.21.4"
},
```

# Declaration of Previous Work

Previously a Meet app architecture was built using Livekit and our implementation of text to speech using browser's native API failed, as it was largely dependent on client's device and browser. For eg: It was only transcribing English properly and not working on Mobile devices and specific browsers like Brave with known issues for native APIs.

In the 24 hours, we addressed and solved 3 major problems:

- Latency was reduced from 10-15 seconds to 4-5 seconds and sometimes even 3 seconds.
- Working on all browsers and does not rely on any browser specific APIs
- Accuracy of transcriptions were innacurate leading to higher error rate in translated texts as well. We addressed this by using Deepgram's Nova AI which is a state of the art transcription engine.
- We also added a feature to summarize user's meeting and provide it in their native language along with the transcriptions.
- We also implemented a feature to change the language in runtime during the meeting.
