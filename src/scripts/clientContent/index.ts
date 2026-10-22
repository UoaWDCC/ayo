import type { ClientContentInput } from './input'
import type { Config, Faq, Page, Person, TeamRole } from '@/payload-types'
import type { Where } from 'payload'
import { MY_AYO_SECTIONS } from '../cmsCopy'

type Collection = 'pages' | 'faqs' | 'roles' | 'team-roles' | 'people' | 'partners'
type Data<T extends Collection> = Omit<Config['collections'][T], 'id' | 'createdAt' | 'updatedAt'>
export type Seed = {
  [T in Collection]: {
    collection: T
    key: string
    where: Where
    data: (ids: ReadonlyMap<string, string>) => Data<T>
  }
}[Collection]
type Block = NonNullable<Page['layout']>[number]
type RichText = Extract<Block, { blockType: 'rich-text' }>['content']

export function richText(heading: string, paragraphs: readonly string[]): RichText {
  const node = (text: string, tag?: 'h2') => ({
    type: tag ? 'heading' : 'paragraph',
    version: 1,
    direction: 'ltr',
    format: '',
    indent: 0,
    ...(tag ? { tag } : {}),
    children: [{ type: 'text', version: 1, text, format: 0, detail: 0, mode: 'normal', style: '' }],
  })
  return {
    root: {
      type: 'root',
      version: 1,
      direction: 'ltr',
      format: '',
      indent: 0,
      children: [...(heading ? [node(heading, 'h2')] : []), ...paragraphs.map((p) => node(p))],
    },
  }
}

function relation(ids: ReadonlyMap<string, string>, key: string): string {
  const id = ids.get(key)
  if (!id) throw new Error(`Missing seed dependency: ${key}`)
  return id
}

const instrumentSections = [
  'Violin 1',
  'Violin 2',
  'Viola',
  'Cello',
  'Double Bass',
  'Flute',
  'Oboe',
  'Clarinet',
  'Bassoon',
  'French Horn',
  'Trumpet',
  'Trombone',
  'Tuba',
  'Percussion',
  'Harp',
]
const teamRoles: { roleName: string; roleType: TeamRole['roleType'] }[] = [
  ...[
    'Patron',
    'President',
    'Vice President',
    'Chairperson',
    'Music Director',
    'Manager',
    'Assistant Manager',
    'Treasurer',
    'Secretary',
    'Supporter Engagement',
    'Player Representative',
  ].map((roleName) => ({ roleName, roleType: 'executive' as const })),
  { roleName: 'Music Librarian', roleType: 'admin' },
]
const personKey = (type: Person['type'], name: string) => `people:${type}:${name}`
export function buildClientContent(input: ClientContentInput): Seed[] {
  const { pages: pageCopy, faqs: faqCopy, players, team, partners } = input
  return [
    ...instrumentSections.map((roleName, sortOrder): Seed => ({
      collection: 'roles',
      key: `roles:${roleName}`,
      where: { roleName: { equals: roleName } },
      data: () => ({ roleName, sortOrder }),
    })),
    ...teamRoles.map(({ roleName, roleType }, sortOrder): Seed => ({
      collection: 'team-roles',
      key: `team-roles:${roleName}`,
      where: { and: [{ roleName: { equals: roleName } }, { roleType: { equals: roleType } }] },
      data: () => ({ roleName, roleType, sortOrder }),
    })),
    ...pageCopy.map((page): Seed => ({
      collection: 'pages',
      key: `pages:${page.slug}`,
      where: { slug: { equals: page.slug } },
      data: () => {
        const layout: Block[] = [
          { blockType: 'hero', slogan: page.slogan, subtitle: page.subtitle },
          // These positions match the fixed frontend sections, especially About Us's nine slots.
          ...page.sections.map(({ heading, paragraphs }): Block => ({
            blockType: 'rich-text',
            content: richText(heading, paragraphs),
          })),
        ]
        if (page.rows)
          layout.push({
            blockType: 'table',
            rows: page.rows.map((row) => ({
              label: row.label,
              content: richText('', row.paragraphs),
              linkLabel: row.linkLabel,
              linkUrl: row.linkUrl,
            })),
          })
        if (page.slug === 'my-ayo') {
          layout.push(
            ...MY_AYO_SECTIONS.map((section): Block => ({
              blockType: 'member-section',
              ...section,
            })),
          )
        }
        return { title: page.title, slug: page.slug, layout }
      },
    })),
    ...faqCopy.map((faq): Seed => ({
      collection: 'faqs',
      key: `faqs:${faq.category}:${faq.question}`,
      where: {
        and: [{ category: { equals: faq.category } }, { question: { equals: faq.question } }],
      },
      data: () => ({ ...faq, category: faq.category as Faq['category'] }),
    })),
    ...players.map((player): Seed => ({
      collection: 'people',
      key: personKey('player', player.name),
      where: { and: [{ type: { equals: 'player' } }, { name: { equals: player.name } }] },
      data: (ids) => ({
        name: player.name,
        type: 'player',
        years: player.years,
        description: player.description,
        sortOrder: player.sortOrder,
        isActive: true,
        role: relation(ids, `roles:${player.role}`),
      }),
    })),
    ...team.map((person, sortOrder): Seed => ({
      collection: 'people',
      key: personKey('team', person.name),
      where: { and: [{ type: { equals: 'team' } }, { name: { equals: person.name } }] },
      data: (ids) => ({
        name: person.name,
        type: 'team',
        years: person.years,
        isActive: true,
        sortOrder,
        teamRoles: person.roles.map((name) => relation(ids, `team-roles:${name}`)),
      }),
    })),
    ...partners.map(({ name, websiteUrl }, sortOrder): Seed => ({
      collection: 'partners',
      key: `partners:${name}`,
      where: { name: { equals: name } },
      data: () => ({ name, websiteUrl, sortOrder, partnerType: 'partner', isActive: false }),
    })),
  ]
}
