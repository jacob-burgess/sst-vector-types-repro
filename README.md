# Reproduction of type error in the sst Vector Component

- issue: https://github.com/sst/ion/issues/788
- pr: https://github.com/sst/ion/pull/787

## Issue

The return type of `VectorClient.query` is incorrectly typed, requiring a ts-ignore.

## Reproduction

1. `cp .env.example .env`
2. Get an openai api key and put in `.env`
3. update the `sst.config.ts` file to use the correct profile from your aws-cli config (or leave blank if you use aws creds file)
4. pnpm install
5. pnpm run deploy
6. Visit the returned 'seeder' url to seed the db, confirm a successful response.
7. Visit the returned 'app' url, view actual response.
8. Checkout the @ts-ignore comment in `index.ts` to see the type error
