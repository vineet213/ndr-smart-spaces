import { contactMasthead } from "@/lib/data/contact";
import { PageMasthead } from "./PageMasthead";

export function ContactMasthead() {
  return (
    <PageMasthead
      id="contact-masthead-title"
      title={contactMasthead.title}
      subtext={contactMasthead.statement}
    />
  );
}
