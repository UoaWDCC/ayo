import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Partners } from './collections/Partners'
import { Concerts } from './collections/Concerts'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Passwords } from './collections/Passwords'
import { CalendarLink } from './collections/CalendarLink'
import { People } from './collections/People'
import { Roles } from './collections/Roles'
import { FAQ } from './collections/FAQ'

import { Links } from './collections/Links'
import { Opportunities } from './collections/Opportunities'
import { TeamRoles } from './collections/TeamRoles'
import { SiteSettings } from './globals/SiteSettings'
import { ProcessingOfDataAgreement } from './collections/ProcessingOfDataAgreement'
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

/**
 * Public base URL of the R2 bucket (an r2.dev subdomain or a custom domain).
 * When it is set, media URLs point straight at R2 so files are served by
 * Cloudflare's edge; when it isn't, they stay on /api/media/file/<filename>,
 * which streams every byte through this Node server on each request.
 *
 * Keep next.config.mjs's `images.remotePatterns` in step with this host, or
 * next/image will refuse to optimize the URLs.
 */
const r2PublicUrl = process.env.R2_PUBLIC_URL?.replace(/\/+$/, '')

export default buildConfig({
  admin: {
    user: Users.slug,
    theme: 'light',
    meta: {
      titleSuffix: ' - AYO',
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      graphics: {
        Logo: '@/admin/components/Logo#default',
      },
      Nav: '@/admin/components/Nav#default',
    },
    dashboard: {
      widgets: [
        {
          slug: 'ayo-agenda',
          label: 'Agenda',
          Component: '@/admin/components/DashboardAgenda#default',
          minWidth: 'full',
          maxWidth: 'full',
        },
      ],
      defaultLayout: [{ widgetSlug: 'ayo-agenda', width: 'full' }],
    },
  },
  // Within a group, the sidebar and the dashboard cards list collections in this
  // order, so keep each group's entries together.
  collections: [
    Pages,
    Posts,
    FAQ,
    Opportunities,
    Concerts,
    CalendarLink,
    People,
    Roles,
    TeamRoles,
    Partners,
    Media,
    Links,
    Users,
    Passwords,
    ProcessingOfDataAgreement,
  ],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
  }),
  sharp,
  plugins: [
    s3Storage({
      collections: {
        [Media.slug]: r2PublicUrl
          ? {
              // Payload's access control on this collection is already `read: () => true`,
              // so routing reads through it buys nothing and costs a proxied request.
              disablePayloadAccessControl: true,
              generateFileURL: ({ filename, prefix }: { filename: string; prefix?: string }) =>
                [r2PublicUrl, prefix, filename].filter(Boolean).join('/'),
            }
          : true,
      },
      bucket: process.env.S3_BUCKET || '',
      config: {
        endpoint: process.env.S3_ENDPOINT,
        region: process.env.S3_REGION,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
        forcePathStyle: true,
      },
    }),
  ],
})
