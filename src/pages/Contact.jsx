import { useState } from "react";
import {
  ArrowRightIcon,
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
import Reveal from "../components/Reveal.jsx";
import SectionTextBlock from "../components/ui/SectionTextBlock.jsx";
import IconInputField from "../components/ui/IconInputField.jsx";
import { useLang } from "../i18n/LangContext.jsx";

export default function Contact() {
  const { t } = useLang();
  const copy = t.contactPage;

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState("idle");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
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
      setTimeout(() => {
        setStatus("success");
        setForm({ name: "", email: "", subject: "", message: "" });
      }, 1200);
    }
  };

  const infoItems = [
    {
      icon: <MapPinIcon size={16} className="text-taupe-600" />,
      label: copy.labels.address,
      content: copy.info.address,
    },
    {
      icon: <ClockIcon size={16} className="text-taupe-600" />,
      label: copy.labels.openingHours,
      content: copy.info.openingHours,
    },
    {
      icon: <PhoneIcon size={16} className="text-taupe-600" />,
      label: copy.labels.phone,
      content: copy.info.phone,
      href: "tel:+41412234567",
    },
    {
      icon: <EnvelopeSimpleIcon size={16} className="text-taupe-600" />,
      label: copy.labels.email,
      content: copy.info.email,
      href: "mailto:hello@boldbrew.ch",
    },
  ];

  return (
    <main className="min-h-screen bg-taupe-50 pt-24">
      <section className="relative overflow-hidden py-20">
        <div className="relative mx-auto max-w-7xl px-6 lg:px-12">
          <Reveal>
            <SectionTextBlock
              label={copy.tag}
              title={copy.h1}
              body={copy.sub}
              titleClassName="text-6xl lg:text-8xl"
            />
          </Reveal>
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 lg:grid-cols-2 lg:px-12">
          <Reveal direction="right">
            <div>
              <h3 className="mb-6 font-display text-3xl font-light text-taupe-900">
                {copy.labels.address}
              </h3>

              <div className="space-y-6">
                {infoItems.map(({ icon, label, content, href }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-taupe-100">
                      {icon}
                    </div>
                    <div>
                      <p className="mb-1 font-ui text-xs uppercase tracking-[0.18em] text-taupe-500">
                        {label}
                      </p>
                      {href ? (
                        <a
                          href={href}
                          className="whitespace-pre-line font-ui text-sm text-taupe-800 transition-colors hover:text-taupe-900"
                        >
                          {content}
                        </a>
                      ) : (
                        <p className="whitespace-pre-line font-ui text-sm text-taupe-800">
                          {content}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal direction="left" delay={0.08}>
            <div className="space-y-5 rounded-3xl bg-white p-6 shadow-[0_4px_40px_rgb(44_37_32/6%)] md:p-8">
              {status === "success" ? (
                <div className="flex min-h-105 flex-col items-center justify-center text-center">
                  <CheckCircleIcon
                    size={48}
                    className="mb-4 text-taupe-500"
                    weight="light"
                  />
                  <p className="font-display text-2xl font-light text-taupe-900">
                    {copy.success}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <IconInputField
                      label={copy.labels.name}
                      type="text"
                      required
                      value={form.name}
                      onChange={(value) =>
                        setForm((p) => ({ ...p, name: value }))
                      }
                      placeholder={copy.placeholders.name}
                      Icon={UserIcon}
                    />

                    <IconInputField
                      label={copy.labels.email}
                      type="email"
                      required
                      value={form.email}
                      onChange={(value) =>
                        setForm((p) => ({ ...p, email: value }))
                      }
                      placeholder={copy.placeholders.email}
                      Icon={EnvelopeSimpleIcon}
                    />
                  </div>

                  <IconInputField
                    label={copy.labels.subject}
                    type="text"
                    value={form.subject}
                    onChange={(value) =>
                      setForm((p) => ({ ...p, subject: value }))
                    }
                    placeholder={copy.placeholders.subject}
                    Icon={PaperPlaneTiltIcon}
                  />

                  <div>
                    <label className="mb-2 block font-ui text-xs uppercase tracking-[0.2em] text-taupe-500">
                      {copy.labels.message}
                    </label>
                    <div className="relative">
                      <ChatTextIcon
                        size={14}
                        className="absolute left-4 top-3.5 text-taupe-500"
                      />
                      <textarea
                        required
                        rows={6}
                        value={form.message}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, message: e.target.value }))
                        }
                        placeholder={copy.placeholders.message}
                        className="w-full resize-none rounded-xl border border-taupe-300 bg-transparent py-3 pl-10 pr-4 font-ui text-sm text-taupe-900 transition-colors focus:border-taupe-500 focus:outline-none focus:ring-0"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-taupe-900 px-8 py-3.5 font-ui text-[11px] uppercase tracking-[0.2em] text-taupe-100 transition-colors duration-300 hover:bg-taupe-500 disabled:opacity-50"
                  >
                    {status === "loading" ? (
                      <>
                        {copy.actions.sending}
                        <CircleNotchIcon size={14} className="animate-spin" />
                      </>
                    ) : (
                      <>
                        {copy.actions.send}
                        <ArrowRightIcon size={14} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
