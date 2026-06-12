const OWNER = "aprajitraina@gmail.com";

export function mailtoForEstimateInterest(title: string, detail: string): string {
  const subject = encodeURIComponent(`BuildSaathi — ${title}`);
  const body = encodeURIComponent(
    `Hi BuildSaathi team,\n\nI'm interested in: ${detail}\n\nPlease help me get started.\n\nThanks`
  );
  return `mailto:${OWNER}?subject=${subject}&body=${body}`;
}
