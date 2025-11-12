## HOURS SCRAPING
- if saved pin
- - check if hours are saved
  - check if hours are old
  - if not, use hours
  - if not saved, query google
  - use returned data
  - if noone is editing, save data
- if temp pin, check/save in local storage

## Scrap everything and just use liveblocks datastore
- on load, check bounds on local
- use local if no data is available
- check amount of users
- if none (set to loader) and
- pull data from server then
- checkbounds
- then set to first run
- then update database
- another user is present
- set up database listener
- on database info load
- set to first run
- check bounds

- database update listener
- if first run already run (don't check bounds)
- if you are the saver, start timer
- same concept for changing

- set up others length listener
- if length is zero, you are set to saver
  

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
