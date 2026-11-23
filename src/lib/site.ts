/** Site-wide settings. Values marked TODO need real details before launch. */
export const SITE = {
  name: 'R.D. Waller Hearing Aid',
  tagline: 'Straightforward, conscientious service',
  owner: 'Ryan Waller',
  location: 'Parkville, MO',
  // TODO(launch): the real production URL. Used for absolute URLs in JSON-LD.
  url: 'https://example.com',
  // TODO(launch): Missouri hearing instrument specialist license number.
  licenseNumber: 'TODO(license)',
};

/** Builds a page <title>, e.g. "Services | R.D. Waller Hearing Aid Service". */
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
