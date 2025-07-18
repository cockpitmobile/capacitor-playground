# Cockpit

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

✨ **This workspace has been generated by [Nx, Smart Monorepos · Fast CI.](https://nx.dev)** ✨

## Documentation on the Nx-ext plugins for Capacitor

https://nxext.github.io/nx-extensions-ionic/docs/capacitor/overview.html

## Development Environment Setup

1. Install Node (use nvm - https://formulae.brew.sh/formula/nvm) and use Node v20
2. Install Android Studio (https://developer.android.com/studio)
3. Install XCode (https://developer.apple.com/xcode/)
4. Ask for a `.env` file from a team member
4. Run `npm install`
5. Run `cd apps/exercisr && npm install`
6. Run `npm i prisma`
7. Run `npm run prisma:generate`

## Web

Run `npm run web:build` to create a production build

Run `npm run web:start` to serve the web app

## Android

Run `npm run android:start` to start the android app

## iOS

Run `npm run ios:start` to start the iOS app

## API

Run `npm run server:start` to start the server

# Below is the default Nx README

## Integrate with editors

Enhance your Nx experience by installing [Nx Console](https://nx.dev/nx-console) for your favorite editor. Nx Console
provides an interactive UI to view your projects, run tasks, generate code, and more! Available for VSCode, IntelliJ and
comes with a LSP for Vim users.

## Start the application

Run `npx nx serve Exercisr` to start the development server. Happy coding!

## Build for production

Run `npx nx build Exercisr` to build the application. The build artifacts are stored in the output directory (e.g. `dist/` or `build/`), ready to be deployed.

## Running tasks

To execute tasks with Nx use the following syntax:

```
npx nx <target> <project> <...options>
```

You can also run multiple targets:

```
npx nx run-many -t <target1> <target2>
```

..or add `-p` to filter specific projects

```
npx nx run-many -t <target1> <target2> -p <proj1> <proj2>
```

Targets can be defined in the `package.json` or `projects.json`. Learn more [in the docs](https://nx.dev/features/run-tasks).

## Set up CI!

Nx comes with local caching already built-in (check your `nx.json`). On CI you might want to go a step further.

- [Set up remote caching](https://nx.dev/features/share-your-cache)
- [Set up task distribution across multiple machines](https://nx.dev/nx-cloud/features/distribute-task-execution)
- [Learn more how to setup CI](https://nx.dev/recipes/ci)

## Explore the project graph

Run `npx nx graph` to show the graph of the workspace.
It will show tasks that you can run with Nx.

- [Learn more about Exploring the Project Graph](https://nx.dev/core-features/explore-graph)

## Connect with us!

- [Join the community](https://nx.dev/community)
- [Subscribe to the Nx Youtube Channel](https://www.youtube.com/@nxdevtools)
- [Follow us on Twitter](https://twitter.com/nxdevtools)
