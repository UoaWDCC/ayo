# Auckland Youth Orchestra Website

A website and content management system for Auckland Youth Orchestra (AYO), developed by the University of Auckland Web Development and Consulting Club (WDCC).

The public website brings together concerts, news, player and team profiles, opportunities and information for members. AYO staff manage content through the Payload admin panel.

## Tech Stack

- Next.js 15 and React 19
- TypeScript
- Payload CMS 3
- MongoDB
- Tailwind CSS and GSAP
- S3-compatible media storage, including Backblaze B2 and Cloudflare R2
- Vitest and Playwright

## Getting Started

### Prerequisites

- Node.js 22, matching the GitHub Actions environment
- pnpm 10.12.1, as specified in `package.json`
- Access to a development MongoDB database and an S3-compatible storage bucket

Ask a project maintainer for development credentials. MongoDB Atlas connections require the connecting computer's IP address to be allowed in the project's IP access list.

### Local Setup

1. Clone the repository and install dependencies.

   ```sh
   git clone https://github.com/UoaWDCC/ayo.git
   cd ayo
   corepack enable
   pnpm install
   ```

2. Copy `.env.example` to `.env` and fill in the database, Payload secret and storage settings. Leave `INSTAGRAM_TOKEN` empty until an Instagram connection is available. For a private bucket, leave `R2_PUBLIC_URL` empty.

3. Start the development server.

   ```sh
   pnpm dev
   ```

Open the website at [localhost:3000](http://localhost:3000) and the admin panel at [localhost:3000/admin](http://localhost:3000/admin). A new database prompts you to create the first admin account.

Keep credentials in local environment files or the hosting provider's environment settings. Client import files belong in the ignored `.private/` directory.

## Project Structure

| Path                   | Purpose                                    |
| ---------------------- | ------------------------------------------ |
| `src/app/(frontend)`   | Public pages, shared components and styles |
| `src/app/(payload)`    | Payload admin panel and API routes         |
| `src/collections`      | CMS collection definitions                 |
| `src/globals`          | Site-wide CMS settings                     |
| `src/blocks`           | CMS content blocks                         |
| `src/admin/components` | Custom admin components and previews       |
| `src/lib`              | Shared queries and helpers                 |
| `src/hooks`            | CMS lifecycle hooks                        |
| `src/scripts`          | Content import and reset commands          |
| `tests`                | Integration, browser and database tests    |

## Development

| Command                   | Purpose                                         |
| ------------------------- | ----------------------------------------------- |
| `pnpm dev`                | Start the local website and admin panel         |
| `pnpm check`              | Run ESLint, TypeScript and the regression tests |
| `pnpm test:e2e`           | Run Playwright browser tests                    |
| `pnpm test:database`      | Run tests against dedicated test resources      |
| `pnpm build`              | Create a production build                       |
| `pnpm start`              | Serve a completed production build              |
| `pnpm generate:types`     | Regenerate Payload types after schema changes   |
| `pnpm generate:importmap` | Regenerate the admin component import map       |

Stop the development server before running `pnpm build`, since both use `.next`.

Playwright uses the local server by default. Set `PLAYWRIGHT_BASE_URL` to check another test instance. Signed-in checks also require `AYO_TEST_ADMIN_EMAIL` and `AYO_TEST_ADMIN_PASSWORD` for an existing test account.

Database tests require `AYO_TEST_DATABASE_URL` and `AYO_TEST_S3_BUCKET` for disposable resources. They create and remove records and files. Storage endpoint and credentials come from the normal `S3_*` settings.

## CMS Content

Page copy and collection content are managed in Payload. The population command imports reviewed records from `.private/cms-content/content.json`, or the file specified by `CMS_CONTENT_FILE`.

```sh
pnpm cms:populate
pnpm cms:populate:apply
```

The first command previews the import. Applying requires confirmation of the database and storage target. Existing records are skipped. Set `POPULATE_CMS_IMAGES=1` to fill missing images from reviewed sources and `POPULATE_CMS_BIOS=1` to fill blank player biographies. Keep the private input file available locally for future imports.

For a clean start, `pnpm cms:reset` previews the deletion scope and `pnpm cms:reset:apply` applies it after target confirmation. A reset clears website content, Site Settings, saved versions and CMS media, while preserving admin accounts and My AYO passwords. Back up the data and stop the app and other writers before applying a reset.

## Deployment

Vercel is the intended production host. The project owner should configure the values in `.env.example` for the Production environment before deploying `main`. Production uses AYO's MongoDB database and Backblaze B2 bucket.

GitHub Actions runs `pnpm check` and a Linux production build on pushes and pull requests. Complete the production admin login, media upload and content checks before connecting the client domain.

## Contributors

- Sam Sajch
- Bryanna Yeo
- Kavya Thangella
- Tyler Young
- Sam Newson
- Cary Limm
- Ron Arzadon
- Maanas Negi
- Simon Zhou
- Milan Ahuja
