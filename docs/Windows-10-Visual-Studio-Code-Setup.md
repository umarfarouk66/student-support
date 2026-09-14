# Windows 10 and Visual Studio Code Setup

This guide explains how to run Student Support Hub on a Windows 10 computer without Linux.

## 1. Install the required software

Install these tools:

1. **Node.js LTS** from the official Node.js website.
2. **Visual Studio Code**.
3. **Git for Windows**.
4. **pnpm** using PowerShell.

Open PowerShell as a normal user and confirm Node.js:

```powershell
node --version
npm --version
```

Enable pnpm through Corepack:

```powershell
corepack enable
corepack prepare pnpm@10.26.1 --activate
pnpm --version
```

If the `corepack` command is not available, install pnpm with:

```powershell
npm install --global pnpm
```

## 2. Open the project in Visual Studio Code

Clone or copy the project into a folder such as:

```text
C:\Users\YourName\Documents\student-support-hub
```

Open PowerShell in that folder:

```powershell
cd C:\Users\YourName\Documents\student-support-hub
code .
```

## 3. Install project dependencies

Run this in the Visual Studio Code PowerShell terminal:

```powershell
pnpm install
```

Do not use `npm install` after this because the repository is configured as a pnpm workspace.

## 4. Configure Clerk authentication

The hosted Replit development environment provisions Clerk variables automatically. When running the project on a separate Windows machine, create a local `.env` file in the web app folder:

```text
artifacts\student-support-hub\.env
```

Add the Clerk publishable key for your Development Clerk application:

```dotenv
VITE_CLERK_PUBLISHABLE_KEY=pk_test_replace_with_your_development_key
VITE_CLERK_PROXY_URL=
```

Do not commit `.env` to Git. Add `.env` to `.gitignore` if it is not already ignored.

For the API server, configure the secret in the environment used to start the server:

```powershell
$env:CLERK_PUBLISHABLE_KEY="pk_test_replace_with_your_development_key"
$env:CLERK_SECRET_KEY="sk_test_replace_with_your_development_secret"
```

Never paste secret keys into source files or commit them to the repository.

## 5. Assign application roles

All new users default to Student. To assign a Counselor or Administrator role, update the user's public metadata in the Clerk development environment:

```json
{
  "role": "counselor"
}
```

or:

```json
{
  "role": "administrator"
}
```

Sign out and sign back in after changing metadata so the new role is reflected in the session.

## 6. Start the application

Use two Visual Studio Code PowerShell terminals.

### Terminal 1: API server

```powershell
$env:PORT="8080"
$env:NODE_ENV="development"
pnpm --filter @workspace/api-server run dev
```

### Terminal 2: Web application

```powershell
$env:PORT="5173"
$env:BASE_PATH="/"
pnpm --filter @workspace/student-support-hub run dev
```

Open the URL printed by Vite, normally:

```text
http://localhost:5173/
```

## 7. Useful checks

Run the web typecheck:

```powershell
pnpm --filter @workspace/student-support-hub run typecheck
```

Run the API typecheck:

```powershell
pnpm --filter @workspace/api-server run typecheck
```

Build the web application:

```powershell
$env:PORT="5173"
$env:BASE_PATH="/"
pnpm --filter @workspace/student-support-hub run build
```

## 8. Common Windows issues

### Port already in use

Find the process using a port:

```powershell
Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue
```

Stop the process only if you are sure it belongs to the old development server:

```powershell
Stop-Process -Id <PROCESS_ID> -Force
```

### PowerShell blocks scripts

If PowerShell blocks Corepack or pnpm scripts, open PowerShell as Administrator and run:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

Restart Visual Studio Code after changing the policy.

### Clerk page is blank

Check that:

1. `VITE_CLERK_PUBLISHABLE_KEY` is present in the web app `.env`.
2. The key belongs to the Development environment.
3. The web server was restarted after editing `.env`.
4. The browser is not blocking third-party cookies or JavaScript.

### Role still shows Student

Check that the user's public metadata contains exactly one of:

```json
{ "role": "counselor" }
```

```json
{ "role": "administrator" }
```

Then sign out and sign in again.

## 9. Recommended VS Code extensions

- ESLint
- Prettier
- TypeScript and JavaScript Language Features
- Tailwind CSS IntelliSense
- GitLens

## 10. Security checklist before submission

- Do not commit `.env` files.
- Do not commit Clerk secret keys.
- Keep Development and Production Clerk applications separate.
- Use Administrator metadata only for approved staff accounts.
- Move localStorage data to authenticated database endpoints before production.
- Add server-side authorization checks to every appointment, record, and report endpoint.
- Test that Students cannot access Counselor or Administrator data.
