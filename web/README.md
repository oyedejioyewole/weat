<img src="./assets/icons/logo.svg" width=64 align="right" />

# Weat

![Preview](preview.png)

Hey 👋🏾, this folder is meant for the website &mdash; <https://weat-ten.vercel.app>

**Related projects:**

1. Android app &mdash; [here](../android)
2. Desktop app &mdash; [here](../desktop)

## Pre-requisites

1. There must be an `OPENWEATHERMAP_API_KEY` environment variable.

   You can get this by going to &mdash; <https://home.openweathermap.org/api_keys> (after you've created an account)

2. There must be an `IPINFO_TOKEN` environment variable.

   You can get this by going to &mdash; <https://ipinfo.io/account/token> (again after creating an account)

## Setup

### Preparation

You need to rename the `.env.example` to `.env`

After which, you should fill in the variables you find in it

**Note:** Run all commands should be run from the root directory

### Install

```bash
$ pnpm --filter site install
```

### Running

#### Development

Run the following command, to start project in development mode

```bash
$ pnpm --filter site dev
```

#### Production

Run the following command, to build this project

```bash
$ pnpm --filter site build
```

##### Preview (Optional)

Run the following command, to test the built project

```bash
$ pnpm --filter site preview
```
