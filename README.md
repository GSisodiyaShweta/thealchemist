# The Alchemist Visual Novel

This repository contains code for a HTML visual novel inspired by Paulo Coelho's *The Alchemist*. It features only a small subset of the overall story as this game is for research purposes.

You can see the most recent build of the game [here](https://gsisodiyashweta.github.io/thealchemist/). However, **this project is still early in development** and the current build may not accurately reflect the final version.

## Development instructions

You need to have NodeJS and NPM installed. You can find downloads and install instructions ad [NodeJS.org](https://nodejs.org/). This repository uses [Yarn] for package management. Please us the following commands to install the dependencies and run the development server.

```bash
# 1) Install yarn package manager
npm install yarn@latest

# 2) Install all dependencies in package.json
yarn

# 3) Start the development server
yarn start

# Navigate your browser to: http://localhost:9000/
```

## Building and deploying the game

Building the game will create a new `dist` folder containing the bundled JavaScript code and all necessary HTML files and static assets.

```bash
# 1) Build a production version of the game
yarn build

# 2) Deploy to the GitHub branch that handles pages
yarn deploy
```

## Adding new story content (WIP)

This process is still not determined. However, users can create a new story file in the `assets` folder and update the game code to load the file at runtime.
