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
