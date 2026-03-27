import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || '',
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
    // connectOptions: {
    //   dbName: 'wdcc-ayo',
    // },
  }),
  collections: [
    // add collections
  ],
})
