# Contributing

Pull requests are welcome to help keep this list up to date.

## Adding or updating a library

1. Add or edit a YAML file in `data/` — see the existing files for the schema (title, home URL, GitHub repo, npm package, license, supported frameworks, and features).
2. Run `pnpm generate-readme` to refresh the library list in `README.md`.
3. Open a pull request and make sure the Vercel build passes successfully.

All library descriptions are adapted from each package's home page.

## Local development

1. Create a [GitHub Personal Access Token](https://github.com/settings/tokens). You don't need to give it any scopes — it's just to increase the API rate limit.
2. (Optional) Create an [NPM Access Token](https://www.npmjs.com/settings/~/tokens) for more reliable NPM API reads and to avoid rate limits.
3. Make sure you have [Node.js](https://nodejs.org/) version 22 or later and the [pnpm package manager](https://pnpm.io/) installed.
4. Check out the repo and run `pnpm install`.
5. Create a `.env` file in the root directory with your tokens:
   ```
   GITHUB_TOKEN=your_github_token_here
   NPM_TOKEN=your_npm_token_here
   ```
6. Run `pnpm dev`.
7. Go to http://localhost:3000/ and bask in the wild splendor that is Awesome JavaScript Grids.

Information on each library lives in `data/` and is parsed in `lib/libraries.ts`.

## How it's built

- This site is hosted on [Vercel](https://vercel.com/).
- It makes extensive use of [Tailwind CSS](https://tailwindcss.com/), [Next.js](https://nextjs.org/) (with App Router), and [TypeScript](https://www.typescriptlang.org/).
- Icons are from the various icon sets in [react-icons](https://react-icons.github.io/react-icons/).
- The GitHub corner thing is Tim Holman's fancy [GitHub Corners](http://tholman.com/github-corners/).
