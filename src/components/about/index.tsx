import { FC } from "react";
import { BsGlobe2 } from "react-icons/bs";
import { RiTranslate } from "react-icons/ri";
import { HiOutlineDocumentText, HiUserGroup } from "react-icons/hi";
import { MdHighQuality } from "react-icons/md";
import { BsFillBookmarkHeartFill } from "react-icons/bs";

const About: FC = () => {
  const features = [
    {
      icon: (
        <BsGlobe2 className="h-10 w-10" style={{ fill: "url(#gradient)" }} />
      ),
      title: "Multilingual Meeting Support",
      desc: "Our app allows users who speak different languages to communicate with each other. The app translates the text and speaks it out to other participants in the language they have selected.",
    },
    {
      icon: (
        <RiTranslate className="h-10 w-10" style={{ fill: "url(#gradient)" }} />
      ),
      title: "Real-time Translation",
      desc: "Our app provides real-time translation, so you can focus on the conversation without worrying about the language barrier. The translation is done quickly and accurately, ensuring smooth communication.",
    },
    {
      icon: (
        <HiOutlineDocumentText
          className="h-10 w-10"
          style={{ stroke: "url(#gradient)" }}
        />
      ),
      title: "Meeting Minutes",
      desc: "Our app automatically generates a summary of the entire meeting or conference. This feature saves time and helps ensure that all participants are on the same page.",
    },
    {
      icon: (
        <HiUserGroup className="h-10 w-10" style={{ fill: "url(#gradient)" }} />
      ),
      title: "Large Capacity",
      desc: "Our app can support up to 100 concurrent users. This means that even large meetings and conferences can be easily accommodated, making it ideal for businesses, schools, and other organizations.",
    },
    {
      icon: (
        <MdHighQuality
          className="h-10 w-10"
          style={{ fill: "url(#gradient)" }}
        />
      ),
      title: "HQ video and Screen Sharing",
      desc: "Our app provides high-quality video and screen sharing, ensuring that everyone can see and hear each other clearly. This feature helps to ensure that the meeting is productive and engaging.",
    },
    {
      icon: (
        <BsFillBookmarkHeartFill
          className="h-10 w-10"
          style={{ fill: "url(#gradient)" }}
        />
      ),
      title: "User friendly Interface",
      desc: "Our app has a user-friendly interface that is easy to navigate. This ensures that everyone can participate in the meeting or conference without any technical difficulties, making it ideal for users of all skill levels.",
    },
  ];

  return (
    <section className="bg-black">
      <svg width="0" height="0">
        <linearGradient id="gradient" x1="100%" y1="100%" x2="0%" y2="0%">
          <stop stopColor="#6366f1" offset="0%" />
          <stop stopColor="#a855f7" offset="50%" />
          <stop stopColor="#ec4899" offset="100%" />
        </linearGradient>
      </svg>
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:py-16 lg:px-6">
        <div className="space-y-8 md:grid md:grid-cols-2 md:gap-12 md:space-y-0 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div key={index}>
              <div className="bg-primary-100 mb-4 flex h-10 w-10 items-center justify-center rounded-full lg:h-12 lg:w-12">
                {feature.icon}
              </div>
              <h3 className="mb-2 text-xl font-bold">{feature.title}</h3>
              <p className="text-white">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
