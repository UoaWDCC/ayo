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
in the components — a field left blank renders nothing instead of falling back
to a value in the code. On a database that predates this, run the one-off
backfill to write the previous copy into the matching fields:

```
DRY_RUN=1 pnpm payload run src/scripts/backfillCmsCopy.ts   # preview
pnpm payload run src/scripts/backfillCmsCopy.ts             # write
```

It only fills blanks, so it is safe to run more than once, and it finishes by
listing anything that still needs a person in the admin UI.

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
