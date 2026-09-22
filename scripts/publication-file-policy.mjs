// Research data is not a reader-facing product export. Private holdouts must
// additionally live OUTSIDE the checkout; this filter is defense in depth.
export function publicationFileAllowed(name) {
  const n=name.replaceAll('\\','/').toLowerCase();
  return !n.startsWith('research/') && !n.startsWith('private-research-packages/') && !n.includes('/private-research-package/') && !n.includes('/analysis-key') && !n.includes('/identity-map');
}
