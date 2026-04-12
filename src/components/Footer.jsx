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
    <footer className="font-body bg-taupe-200 border-t border-taupe-300">
      <div className="w-full h-72 grayscale brightness-90 opacity-50">
        <iframe
          title="BoldBrew Location"
          src="https://www.google.com/maps?q=Bahnhofstrasse+12+Zurich&output=embed"
          className="w-full h-full border-0"
          loading="lazy"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* brand */}
        <div className="space-y-5">
          <div className="flex flex-col leading-none select-none">
            <span className="font-display text-xl font-light tracking-[0.15em] text-taupe-900 uppercase">
              {c.brand}
            </span>
            <span className="font-body text-[9px] tracking-[0.35em] text-taupe-600 uppercase mt-0.5">
              {c.subBrand}
            </span>
          </div>
          <p className="text-sm font-light leading-relaxed text-taupe-700 max-w-[22ch]">
            {c.quote}
          </p>
          <div className="flex gap-4 pt-1">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="text-taupe-600 hover:text-taupe-900 transition-colors duration-300"
            >
              <InstagramLogoIcon size={18} />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="text-taupe-600 hover:text-taupe-900 transition-colors duration-300"
            >
              <FacebookLogoIcon size={18} />
            </a>
          </div>
        </div>

        {/* hours */}
        <div>
          <h4 className="mb-4 font-body text-xs font-medium uppercase tracking-[0.35em] text-taupe-600">
            {c.hours}
          </h4>
          <ul className="space-y-2.5">
            {c.hoursData.map((h) => (
              <li
                key={h.day}
                className="flex justify-between text-sm font-light"
              >
                <span className="text-taupe-800">{h.day}</span>
                <span className="text-taupe-600">{h.time}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* contact */}
        <div>
          <h4 className="mb-4 font-body text-xs font-medium uppercase tracking-[0.35em] text-taupe-600">
            {c.contact}
          </h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-sm font-light text-taupe-800">
              <MapPinIcon
                size={15}
                className="shrink-0 mt-0.5 text-taupe-600"
              />
              <span>{c.address}</span>
            </li>
            <li className="flex items-center gap-3 text-sm font-light text-taupe-800">
              <PhoneIcon size={15} className="shrink-0 text-taupe-600" />
              <a
                href={`tel:${c.phone}`}
                className="hover:text-taupe-900 transition-colors duration-300"
              >
                {c.phone}
              </a>
            </li>
            <li className="flex items-center gap-3 text-sm font-light text-taupe-800">
              <EnvelopeIcon size={15} className="shrink-0 text-taupe-600" />
              <a
                href={`mailto:${c.email}`}
                className="hover:text-taupe-900 transition-colors duration-300"
              >
                {c.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-taupe-300 py-5 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-2 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-taupe-600">
            © {new Date().getFullYear()} BoldBrew. {c.rights}
          </p>
          <a
            href="https://thalitadosreis.ch/"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-taupe-600 transition-colors hover:text-taupe-900 inline-flex items-center gap-1"
          >
            Made by Thalita dos Reis
            <ArrowUpRightIcon size={11} aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
