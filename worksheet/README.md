# iMedia Genius Firebase Worksheet Rebuild - Secure Marking Upgrade

This upgrade moves marking off the browser and into Firebase Functions so students cannot inspect answer keys in the client app.

## What changed

- `tasks/` now stores only public worksheet content
- `taskKeys/` stores private answer keys and is only read by server code
- marking runs through a callable Cloud Function
- worksheet submissions and progress are written server-side
- the client now loads `public/data/strands.public.json` only as a safe fallback when Firestore has not been seeded yet

## Collections

- `users/{uid}` - profile and role
- `tasks/{strandId}` - public worksheet content
- `taskKeys/{strandId}` - private answer keys
- `progress/{uid}` - per-student worksheet progress
- `submissions/{id}` - marked submissions
- `markingResults/{id}` - score summaries

## Deploy

Install the root app dependencies:

```powershell
npm install
```

Install the Cloud Functions dependencies:

```powershell
cd functions
npm install
cd ..
```

Deploy everything:

```powershell
firebase deploy
```

## Teacher setup

After creating your teacher account, set:

```text
users/{uid}.role = "teacher"
```

Then use **Seed secure worksheet bank** from the teacher dashboard.

## Why this is safer

Firestore reads happen at the whole-document level, not per-field, so private marking keys must live in separate documents rather than alongside public worksheet content. The callable function model lets the browser send answers for marking without ever receiving the mark scheme.
