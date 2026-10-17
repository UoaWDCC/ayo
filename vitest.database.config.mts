import 'dotenv/config'
import { defineConfig } from 'vitest/config'
import base from './vitest.config.mts'

// These suites write data and upload files. Never fall back to the app's normal resources.
if (!process.env.AYO_TEST_DATABASE_URL || !process.env.AYO_TEST_S3_BUCKET) {
  throw new Error(
    'Set AYO_TEST_DATABASE_URL and AYO_TEST_S3_BUCKET to dedicated test resources before running database tests.',
  )
}
process.env.DATABASE_URL = process.env.AYO_TEST_DATABASE_URL
process.env.S3_BUCKET = process.env.AYO_TEST_S3_BUCKET

export default defineConfig({
  ...base,
  test: {
    ...base.test,
    include: ['tests/database/**/*.int.spec.ts'],
    environment: 'node',
    fileParallelism: false,
    testTimeout: 30000,
    hookTimeout: 30000,
  },
})
