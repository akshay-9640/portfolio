import { contact, headings, profile } from "../content";
import { BadgeSpot } from "./TravelBadge";
import Section from "./Section";

const btn =
  "rounded-full border border-ink/25 px-6 py-3 text-sm font-medium transition duration-100 hover:border-ink/60 active:scale-[0.97]";
const field =
  "w-full rounded-xl border border-ink/15 bg-card px-4 py-3 text-sm outline-none transition-colors placeholder:text-ink/40 focus:border-ink/50";

export default function Contact() {
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
              Open to AI engineering roles. My email, GitHub and LinkedIn are on the badge, or send a message here.
            </p>
            {/* Screen readers get the links here; on screen they live on the badge's contact side. */}
            <p className="sr-only">
              Email <a href={`mailto:${contact.email}`}>{contact.email}</a>, <a href={contact.github}>GitHub</a>, <a href={contact.linkedin}>LinkedIn</a>.
            </p>
            <form onSubmit={send} className="mt-8 space-y-3">
              <input name="name" required placeholder="Your name" aria-label="Your name" className={field} />
              <input name="email" type="email" required placeholder="Your email" aria-label="Your email" className={field} />
              <textarea name="message" required rows={4} placeholder="Message" aria-label="Message" className={field} />
              <button type="submit" className={`${btn} !border-ink bg-ink font-semibold text-paper hover:bg-white`}>
                Send message
              </button>
            </form>
          </div>
          <BadgeSpot name="contact" className="mx-auto md:mr-0" />
        </div>
      </Section>
      <footer className="border-t border-ink/10 px-5 py-8 text-center text-xs text-ink/50">
        © {new Date().getFullYear()} {profile.name}
      </footer>
    </>
  );
}
