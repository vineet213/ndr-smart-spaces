import { PageMasthead, type MastheadTitle } from "./PageMasthead";

type InvestorMastheadProps = {
  title: MastheadTitle;
  subtext?: string;
  id: string;
};

export function InvestorMasthead({ title, subtext, id }: InvestorMastheadProps) {
  return <PageMasthead id={id} title={title} subtext={subtext} />;
}
