# Careerly

## Overview

Careerly is a professional networking platform that allows individuals to connect with professionals and advance their careers.

## Group Members

1. Esteban Tinajero
2. Donovan Bosson
3. Haroutyun Chamelian
4. Tyler Carlsen

## Installation

1. Download [Docker Desktop](https://www.docker.com/products/docker-desktop/)

2. Clone the repository

```bash
git clone git@github.com:TinajeroOC/Careerly.git
```

3. Change directory

```bash
cd Careerly
```

4. Install dependencies

```bash
npm i
```

5. Start local Supabase server

```bash
npm run supabase:Start
```

> Make sure Docker Desktop is running in the background.

6. Create `.env.local`

   - Update `NEXT_PUBLIC_SUPABASE_URL` with `API URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` with `anon key`. These values are printed in the terminal when starting the local Supabase server.

7. Start Next.js server

```bash
npm run dev
```

## Development on Windows

This project is developed and tested on macOS and Linux environments. If you plan to develop on a Windows machine, it is recommended to install [WSL](https://learn.microsoft.com/en-us/windows/wsl/install) and follow the tutorials listed below.

1. [Node.js Installation](https://learn.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-wsl)

2. [VSCode w/ WSL](https://code.visualstudio.com/docs/remote/wsl)
