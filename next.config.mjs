import { withPayload } from '@payloadcms/next/withPayload'

// Media served straight from the R2 bucket (see R2_PUBLIC_URL in payload.config.ts) is a
// remote URL, and next/image only optimizes hosts listed here.
const r2PublicHost = process.env.R2_PUBLIC_URL
  ? new URL(process.env.R2_PUBLIC_URL).hostname
  : undefined

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    // Our largest uploads are ~2048px wide, so a 3840px entry in the srcset only ever
    // upscales the source: more bytes over the wire and more work for sharp, no more detail.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    remotePatterns: [
      { protocol: 'https', hostname: '**.cdninstagram.com' },
      { protocol: 'https', hostname: '**.fbcdn.net' },
      ...(r2PublicHost ? [{ protocol: 'https', hostname: r2PublicHost }] : []),
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
