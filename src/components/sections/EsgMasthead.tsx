import { esgMasthead } from "@/lib/data/esg";
import { PageMasthead } from "./PageMasthead";

export function EsgMasthead() {
  return (
    <PageMasthead id="esg-masthead-title" title={esgMasthead.title} subtext={esgMasthead.statement} />
  );
}
