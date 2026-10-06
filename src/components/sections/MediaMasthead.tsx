import { mediaMasthead } from "@/lib/data/media";
import { PageMasthead } from "./PageMasthead";

export function MediaMasthead() {
  return (
    <PageMasthead
      id="media-masthead-title"
      title={mediaMasthead.title}
      subtext={mediaMasthead.statement}
    />
  );
}
