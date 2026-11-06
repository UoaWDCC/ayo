# AYO Project

Welcome to the AYO Project!

## Getting Started

Ensure you have [Node](https://nodejs.org/) installed. This project requires `Node ^18.20.2 || >=20.9.0`. Installation can be found [here](https://nodejs.org/).

Ensure you have pnpm installed. It is recommended that you install pnpm using Corepack. Run the following commands in your terminal:

```
npm install -g corepack@latest
corepack enable pnpm
```

This project requires `pnpm ^9 || ^10`.

Ensure you have MongoDB Community Edition installed and running locally. Installation guides:

- **macOS (Homebrew):** https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x/
- **Ubuntu / WSL:** https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/

Ensure Git is also installed and run the following command at your desired folder:

```
git clone https://github.com/UoaWDCC/ayo.git
```

Navigate to the project root and install dependencies and run:

```
cd ayo
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Page copy lives in Payload

Headings, sub-lines and outbound links are edited in the admin UI rather than
in the components. Use the client content population script to create missing
records from a private JSON input file. Keep that file outside Git at
`.private/cms-content/content.json`, or set `CMS_CONTENT_FILE` to its location.
The command stops before connecting to the database if the file is missing.
Do not commit client rosters, biographies or image mappings.

```
pnpm cms:populate        # preview without writing
pnpm cms:populate:apply  # create missing records after confirming the target
```

Existing records are skipped by default. Edit those records in the admin UI.
Set `POPULATE_CMS_IMAGES=1` to fill missing images from the input's reviewed sources,
or `POPULATE_CMS_BIOS=1` to fill blank player biographies. Both options preserve
existing content and use the same dry-run and target-confirmation steps.

For an intentional clean start, `pnpm cms:reset` previews the deletion scope.
`pnpm cms:reset:apply` deletes website content, saved versions and CMS media after
target confirmation, preserving admin accounts and My AYO passwords. Back up and
stop the website server and other writers before applying. Populate afterward.

## Checks before release

Run `pnpm check` for lint, TypeScript and the regression tests. These tests do not
connect to a database or upload files. Run `pnpm build` separately with the dev
server stopped because both commands use `.next`.

`pnpm test:e2e` checks public navigation, contact links, the mobile menu and admin
login branding. It uses the local dev server by default. Set `PLAYWRIGHT_BASE_URL`
to check another test instance. Signed-in checks are enabled only when
`AYO_TEST_ADMIN_EMAIL` and `AYO_TEST_ADMIN_PASSWORD` identify an existing test
account. They navigate without creating accounts or changing content.

The older database suites are separate: `pnpm test:database` requires
`AYO_TEST_DATABASE_URL` and `AYO_TEST_S3_BUCKET` for dedicated test resources.
They create and remove fixtures, so use an empty disposable database and bucket.
Storage endpoint and credentials still come from the normal S3 environment settings.
Never point these test resources at production.

GitHub Actions runs `pnpm check` and a Linux production build. For a Vercel
production deployment, set the MongoDB, Payload and Backblaze values from
`.env.example` in the project's Production environment before deploying.

## Checks before release

Run `pnpm check` for lint, TypeScript and the regression tests. These tests do not
connect to a database or upload files. Run `pnpm build` separately with the dev
server stopped because both commands use `.next`.

`pnpm test:e2e` checks public navigation, contact links, the mobile menu and admin
login branding. It uses the local dev server by default. Set `PLAYWRIGHT_BASE_URL`
to check another test instance. Signed-in checks are enabled only when
`AYO_TEST_ADMIN_EMAIL` and `AYO_TEST_ADMIN_PASSWORD` identify an existing test
account. They navigate without creating accounts or changing content.

The older database suites are separate: `pnpm test:database` requires
`AYO_TEST_DATABASE_URL` and `AYO_TEST_S3_BUCKET` for dedicated test resources.
They create and remove fixtures, so use an empty disposable database and bucket.
Storage endpoint and credentials still come from the normal S3 environment settings.
Never point these test resources at production.

GitHub Actions runs `pnpm check` and a Linux production build before deploying
`main`. Pull requests and other branches run the checks without deploying.

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
