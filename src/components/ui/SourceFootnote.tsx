import type { ReactNode } from "react";
import type { Tone } from "./types";

type SourceFootnoteProps = {
  as?: "p" | "span";
  tone?: Tone;
  className?: string;
  children: ReactNode;
};

export function SourceFootnote(_props: SourceFootnoteProps) {
  return null;
}
