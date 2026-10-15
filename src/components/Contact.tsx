import { useState } from "react";
import { contact, headings, profile } from "../content";
import Section from "./Section";

const btn =
  "rounded-full border border-ink/25 px-6 py-3 text-sm font-medium transition duration-100 hover:border-ink/60 active:scale-[0.97]";
const field =
  "w-full rounded-xl border border-ink/15 bg-card px-4 py-3 text-sm outline-none transition-colors placeholder:text-ink/40 focus:border-ink/50";

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${contact.email}`;
    }
  };

  // No backend: the form opens the visitor's mail client with the message prefilled.
  const send = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const subject = `Portfolio message from ${f.get("name")}`;
    const body = `${f.get("message")}\n\nFrom ${f.get("name")} (${f.get("email")})`;
    window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <>
      <Section id="contact" heading={headings.contact}>
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <p className="max-w-sm text-ink/70">
              Open to Generative AI and agentic AI engineering roles. The fastest way to reach me
              is email.
            </p>
            <p className="mt-6 font-mono text-xs uppercase tracking-wider text-ink/50">
              {contact.location}
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button type="button" onClick={copy} className={`${btn} !border-ink bg-ink font-semibold text-paper hover:bg-white`}>
                {copied ? "Copied" : `Copy ${contact.email}`}
              </button>
              <a href={contact.linkedin} target="_blank" rel="noreferrer" className={btn}>
                LinkedIn ↗
              </a>
              <a href={contact.github} target="_blank" rel="noreferrer" className={btn}>
                GitHub ↗
              </a>
              <a href={profile.resume} download className={btn}>
                Download Resume
              </a>
            </div>
          </div>

          <form onSubmit={send} className="space-y-3">
            <input name="name" required placeholder="Your name" aria-label="Your name" className={field} />
            <input name="email" type="email" required placeholder="Your email" aria-label="Your email" className={field} />
            <textarea name="message" required rows={4} placeholder="Message" aria-label="Message" className={field} />
            <button type="submit" className={`${btn} !border-ink bg-ink font-semibold text-paper hover:bg-white`}>
              Send message
            </button>
          </form>
        </div>
      </Section>
      <footer className="border-t border-ink/10 px-5 py-8 text-center text-xs text-ink/50">
        © {new Date().getFullYear()} {profile.name}
      </footer>
    </>
  );
}
