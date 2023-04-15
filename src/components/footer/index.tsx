import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  const links = [
    {
      label: "Home",
      path: "#",
    },
    {
      label: "About",
      path: "#about",
    },
    {
      label: "Contact",
      path: "#contact",
    },
  ];
  return (
    <footer id="contact" className="bg-gray-900">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex justify-center text-primary">
          <Image
            src="/logo.png"
            alt="Logo"
            width={100}
            height={100}
            className="h-12 w-auto"
          />
        </div>
        <p className="mx-auto mt-6 max-w-md text-center leading-relaxed text-white">
          <a className="flex justify-center">AudioWiz</a>

          <a className="flex justify-center text-xs text-gray-300">
            Multilingual Video Conferencing App
          </a>
        </p>
        <nav className="mt-12">
          <ul className="flex flex-wrap justify-center gap-6 md:gap-8 lg:gap-12">
            {links.map((link) => (
              <li key={link.path}>
                <Link
                  className="text-white transition hover:text-gray-400"
                  href={link.path}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
