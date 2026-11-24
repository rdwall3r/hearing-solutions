/** Site-wide settings. Values marked TODO need real details before launch. */
export const SITE = {
  name: 'R.D. Waller Hearing Aid Co.',
  tagline: 'Straightforward and conscientious service',
  owner: 'Ryan Waller, BHS, HIS, CPACC',
  location: 'Greater Kansas City',
  url: 'https://hearing.rdwaller.net',
  licenseNumber: '2013007124',
};

/** Builds a page <title>, e.g. "Services | R.D. Waller Hearing Aid Co.". */
export function pageTitle(title?: string) {
  return title ? `${title} | ${SITE.name}` : SITE.name;
}

/** Standard meta tags for a route. Descriptions are placeholders for now. */
export function pageMeta(title: string | undefined, description: string) {
  return [
    { title: pageTitle(title) },
    { name: 'description', content: description },
  ];
}
