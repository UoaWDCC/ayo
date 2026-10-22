import type { ClientContentInput } from '@/scripts/clientContent/input'

// Entirely fictional import data. Tests must never read private client files.
export const cmsContentFixture: ClientContentInput = {
  pages: [
    'home',
    'about-us',
    'join-ayo',
    'concerts-events',
    'support-us',
    'news',
    'contact-us',
    'my-ayo',
    'policies',
  ].map((slug) => ({
    slug,
    title: `Example ${slug}`,
    slogan: `Example ${slug}`,
    sections: Array.from({ length: slug === 'about-us' ? 9 : 1 }, (_, i) => ({
      heading: `Example section ${i + 1}`,
      paragraphs: ['Fictional content for automated tests.'],
    })),
  })),
  faqs: Array.from({ length: 6 }, (_, i) => ({
    question: `Example question ${i + 1}?`,
    answer: 'Example answer.',
    category: 'join-ayo',
    sortOrder: i,
  })),
  players: [
    {
      name: 'Example Player',
      years: '2026',
      description: 'A fictional musician.',
      sortOrder: 0,
      role: 'Violin 1',
    },
  ],
  team: [{ name: 'Example Volunteer', roles: ['Manager'], years: '2026' }],
  partners: [{ name: 'Example Partner', websiteUrl: 'https://example.com' }],
  images: [
    {
      name: 'Example Player',
      type: 'player',
      url: 'https://example.com/portrait.png',
      source: 'https://example.com/profile',
    },
  ],
  pending: ['Review example content before use.'],
  instagramUrl: 'https://instagram.com/example',
}
