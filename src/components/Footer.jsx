import {
  PhoneIcon,
  EnvelopeIcon,
  InstagramLogoIcon,
  FacebookLogoIcon,
  MapPinIcon,
  ArrowUpRightIcon,
} from "@phosphor-icons/react";
import { useLang } from "../i18n/LangContext.jsx";

export default function Footer() {
  const { t } = useLang();
  const c = t.footer;

  return (
    <footer className="bg-taupe-200">
      {/* map embed */}
      <div className="w-full h-64 grayscale opacity-80">
        <iframe
          title="BoldBrew Location"
          src="https://www.google.com/maps?q=Bahnhofstrasse+12+Zurich&output=embed"
          className="w-full h-full border-0"
          loading="lazy"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* brand */}
        <div className="space-y-4">
          <div className="mb-4 flex flex-col leading-none select-none">
            <span className="font-display text-xl font-light tracking-[0.15em] text-taupe-900 uppercase">
              {c.brand}
            </span>
            <span className="text-[10px] tracking-[0.35em] text-taupe-500 uppercase font-ui font-light">
              {c.subBrand}
            </span>
          </div>
          <p className="text-sm font-ui font-light leading-relaxed text-taupe-500">
            {c.quote}
          </p>
          <div className="flex gap-4">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="text-taupe-500 hover:text-taupe-400 transition-colors duration-300"
            >
              <InstagramLogoIcon size={20} />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="text-taupe-500 hover:text-taupe-400 transition-colors duration-300"
            >
              <FacebookLogoIcon size={20} />
            </a>
          </div>
        </div>

        {/* hours */}
        <div>
          <h4 className="text-sm tracking-[0.2em] uppercase font-ui text-taupe-500 mb-4">
            {c.hours}
          </h4>
          <ul className="space-y-3">
            {c.hoursData.map((h) => (
              <li
                key={h.day}
                className="flex justify-between text-sm font-ui font-light"
              >
                <span className="text-taupe-500">{h.day}</span>
                <span className="text-taupe-400">{h.time}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* contact */}
        <div>
          <h4 className="text-sm tracking-[0.2em] uppercase font-ui text-taupe-500 mb-4">
            {c.contact}
          </h4>
          <ul className="space-y-4">
            <li className="flex items-center gap-3 text-sm font-ui font-light text-taupe-500">
              <MapPinIcon size={16} className="shrink-0 text-taupe-500" />
              <span>{c.address}</span>
            </li>
            <li className="flex items-center gap-3 text-sm font-ui font-light text-taupe-500">
              <PhoneIcon size={16} className="shrink-0 text-taupe-500" />
              <a
                href={`tel:${c.phone}`}
                className="hover:text-taupe-400 transition-colors"
              >
                {c.phone}
              </a>
            </li>
            <li className="flex items-center gap-3 text-sm font-ui font-light text-taupe-500">
              <EnvelopeIcon size={16} className="shrink-0 text-taupe-500" />
              <a
                href={`mailto:${c.email}`}
                className="hover:text-taupe-400 transition-colors"
              >
                {c.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-taupe-300 py-6 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-2 items-center">
          <p className="text-xs font-ui text-taupe-500">
            © {new Date().getFullYear()} BoldBrew. {c.rights}
          </p>
          <p className="text-xs font-ui text-taupe-500 md:text-right">
            <a
              href="https://thalitadosreis.ch/"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-taupe-700"
            >
              Made by Thalita dos Reis
              <ArrowUpRightIcon
                size={12}
                className="inline-block ml-1 text-taupe-500"
              />
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
