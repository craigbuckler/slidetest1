# Slides (test 1)

An HTML presentation experiment.

Install the [esbuild](https://esbuild.github.io/) build system with:

```bash
npm install
```

Run in development mode:

```bash
npm start
```

This builds a site to `build` and starts a local development server. Open `http://localhost:8111/` in your browser. All resources rebuild themselves when files change. CSS hot reloads, but other updates require a browser refresh.

Create a production build with minified CSS and JavaScript:

```bash
npm run build
```


## Overview

Source files are located in `./src`.

Build files are built to `./build`.

Development mode can be configured in `.env.dev`.

`.env.prod` overrides `.env.dev` defaults when creating a production build.
