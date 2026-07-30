# Namecheap Deployment Guide

This website is prepared for deployment on Namecheap Node.js hosting.

## What was prepared

- Next.js is set to `output: "standalone"` in `next.config.ts`
- A production startup file was added at `server.js`
- A startup script was added in `package.json`:
  - `npm run start:standalone`

## Recommended cPanel setup

In Namecheap cPanel:

1. Open `Setup Node.js App`
2. Create a new application
3. Use these values:
   - Node.js version: `20.x` or newer
   - Application mode: `Production`
   - Application root: your uploaded project folder
   - Application URL: `drivewaykustoms.com`
   - Application startup file: `server.js`

## Upload process

Upload the whole project to your hosting account, including:

- `app/`
- `components/`
- `public/`
- `package.json`
- `package-lock.json`
- `next.config.ts`
- `server.js`
- `tsconfig.json`
- other config files already in the repo

Do not upload:

- `node_modules/`
- local `.next/` build output from your own computer

## Commands to run on Namecheap

After uploading the project and creating the Node.js app:

1. Open Terminal in cPanel or connect through SSH
2. Go to the app root directory
3. Run:

```bash
npm install
npm run build
```

4. In `Setup Node.js App`, restart the application

If needed, run the startup command manually for testing:

```bash
npm run start:standalone
```

## Domain

Because your domain `drivewaykustoms.com` and hosting are both on Namecheap, you usually just need to make sure:

- the domain is attached to the correct hosting account
- the Node.js app is created on that domain
- the app is restarted after `npm install` and `npm run build`

## If something breaks

Check:

- Node.js version is `20.x` or newer
- `npm install` completed without errors
- `npm run build` completed without errors
- startup file is exactly `server.js`
- app root is the same folder where `package.json` exists
