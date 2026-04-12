import { useState } from "react";
import Reveal from "../components/Reveal.jsx";
import PageHero from "../components/ui/PageHero.jsx";
import IconInputField from "../components/ui/IconInputField.jsx";
import { useLang } from "../i18n/LangContext.jsx";
import { apiUrl } from "../lib/api.js";
import {
  CircleNotchIcon,
  ChatTextIcon,
  CheckCircleIcon,
  MapPinIcon,
  ClockIcon,
  PhoneIcon,
  EnvelopeSimpleIcon,
  PaperPlaneTiltIcon,
  UserIcon,
} from "@phosphor-icons/react";

function InfoItem({ icon, label, content, href }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 shrink-0 text-taupe-600">{icon}</div>
      <div>
        <p className="mb-2 font-body text-[11px] font-medium uppercase tracking-[0.35em] text-taupe-600">
          {label}
        </p>
        {href ? (
          <a
            href={href}
            className="whitespace-pre-line font-body text-sm text-taupe-700 transition-colors hover:text-taupe-900"
          >
            {content}
          </a>
        ) : (
          <p className="whitespace-pre-line font-body text-sm font-light text-taupe-700">
            {content}
          </p>
        )}
      </div>
    </div>
  );
}

export default function Contact() {
  const { t } = useLang();
  const c = t.contactPage;

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState("idle");

  const setField = (field) => (value) =>
    setForm((p) => ({ ...p, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch(apiUrl("/api/contact"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        throw new Error();
      }
    } catch {
      setStatus("error");
    }
  };

  const infoItems = [
    {
      icon: <MapPinIcon size={15} />,
      label: c.labels.address,
      content: c.info.address,
    },
    {
      icon: <PhoneIcon size={15} />,
      label: c.labels.phone,
      content: c.info.phone,
      href: "tel:+41412234567",
    },
    {
      icon: <EnvelopeSimpleIcon size={15} />,
      label: c.labels.email,
      content: c.info.email,
      href: "mailto:hello@boldbrew.ch",
    },
    {
      icon: <ClockIcon size={15} />,
      label: c.labels.openingHours,
      content: c.info.openingHours,
    },
  ];

  return (
    <main className="min-h-screen bg-taupe-50">
      <PageHero
        tag={c.tag}
        title={c.title}
        sub={c.sub}
        src="https://images.pexels.com/photos/4790061/pexels-photo-4790061.jpeg?w=1400&q=85"
        alt="Café atmosphere"
      />

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* contact details */}
            <Reveal direction="up">
              <div>
                <h2 className="mb-8 font-display text-2xl font-light text-taupe-900">
                  {c.detailsTitle}
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
                  <div className="space-y-4">
                    {infoItems.slice(0, 3).map((item) => (
                      <InfoItem key={item.label} {...item} />
                    ))}
                  </div>
                  <InfoItem {...infoItems[3]} />
                </div>
              </div>
            </Reveal>

            {/* form */}
            <Reveal direction="up" delay={0.08}>
              <div className="space-y-4 p-6 ring-1 ring-taupe-200 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <IconInputField
                      label={c.labels.name}
                      type="text"
                      required
                      value={form.name}
                      onChange={setField("name")}
                      Icon={UserIcon}
                    />
                    <IconInputField
                      label={c.labels.email}
                      type="email"
                      required
                      value={form.email}
                      onChange={setField("email")}
                      Icon={EnvelopeSimpleIcon}
                    />
                  </div>

                  <IconInputField
                    label={c.labels.subject}
                    type="text"
                    value={form.subject}
                    onChange={setField("subject")}
                    Icon={PaperPlaneTiltIcon}
                  />

                  <div>
                    <label
                      htmlFor="message"
                      className="mb-2 block font-body text-[11px] font-medium uppercase tracking-[0.35em] text-taupe-600"
                    >
                      {c.labels.message}
                    </label>
                    <div className="relative">
                      <ChatTextIcon
                        size={14}
                        className="absolute left-4 top-3.5 text-taupe-500"
                      />
                      <textarea
                        id="message"
                        required
                        rows={6}
                        value={form.message}
                        onChange={(e) => setField("message")(e.target.value)}
                        className="w-full resize-none border border-taupe-200 bg-transparent py-3 pl-10 pr-4 font-body text-sm text-taupe-900 transition-colors focus:border-taupe-500 focus:outline-none focus:ring-0"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="inline-flex w-full items-center justify-center gap-2.5 bg-taupe-900 px-6 py-3 font-body text-[10px] uppercase tracking-[0.22em] text-taupe-100 transition-all duration-300 hover:bg-taupe-700 disabled:opacity-50 md:px-8 md:py-3.5 md:text-[11px]"
                  >
                    {status === "loading" ? (
                      <>
                        {c.actions.sending}{" "}
                        <CircleNotchIcon size={13} className="animate-spin" />
                      </>
                    ) : (
                      c.actions.send
                    )}
                  </button>

                  {status === "success" && (
                    <div className="flex items-center gap-3 border border-taupe-300 bg-taupe-100 px-4 py-3">
                      <CheckCircleIcon
                        size={15}
                        className="shrink-0 text-taupe-600"
                        weight="fill"
                      />
                      <p className="font-body text-sm text-taupe-700">
                        {c.success}
                      </p>
                    </div>
                  )}

                  {status === "error" && (
                    <p className="font-body text-sm text-taupe-900">
                      {c.error}
                    </p>
                  )}
                </form>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  );
}
