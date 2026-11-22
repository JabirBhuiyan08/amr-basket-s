# Deploying the API on Render

Set the Render service's root directory to `server`, then configure:

- Build command: `npm ci && npm run build`
- Pre-deploy command: `npm run prisma:deploy`
- Start command: `npm run start`

Migrations run once during pre-deploy instead of on every server start. This
avoids concurrent application instances competing for Prisma's advisory lock.

Set `DIRECT_URL` to the database's direct, non-pooled PostgreSQL URL for
migrations. The running API continues to use `DATABASE_URL`, which may be
pooled. If the database has no separate pooled URL, both variables can use the
same direct URL.

If the Render plan does not support a pre-deploy command, run
`npm run prisma:deploy` once as a separate deployment step before starting the
new version. Do not add migrations back to the service's start command.
