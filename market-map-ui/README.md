# Build tools

### Environment variables
We have different settings for each env. If you need to access any of those vars, you can do so by doing the following: `process.env.VAR_NAME`. If `VAR_NAME` exists in the env for the current env you are running in, it will replace it with the value. 
If you want env variables to be replaced in index.html, you will have to use the following naming convention `%VAR_NAME%`
After adding a variable to the env file, you will need to restart webpack for the new variables to be correctly injected.
It will look for the following env file names:
  .env.local
  .env.ENVIRONMENT.local
  .env.ENVIRONMENT
  .env

### NPM Scripts
The following npm scripts are available:
  - `start`: Starts webpack dev server with `NODE_ENV=development`,
  - `start:dev|test|uat|prod`: Builds the project with env.
  - `build:dev|test|uat|prod`: Builds the project with env.
  - `build:analyze`: Builds the project with prod env, and opens browser with graph of all files that are being imported (useful to see what libs are being bundled).
  - `test`: Runs Jest.
  - `test:watch`: Runs Jest in watch mode.
  - `coverage`: Runs Jest and also produces a test coverage percentage.
  - `prettier`: Runs prettier format against all files inside of src/ directory. This will modify all files to conform with prettier rules.
  - `lint`: Runs eslint against all files inside of src/ directory.
  - `sonar_lint`: Runs eslint with sonarqube against all files inside of src/ directory, and outputs a linting-results.json file.

### Webpack Requirements
The webpack configuration requires the following:
  - An environment variable of `CVNA_APP_PUBLIC_URL` or `CARVANA_APP_PUBLIC_URL` set to the app name.
  - A key `homepage` in package.json set to the app name.
  - A `src` folder containing an `index.js` or `index.ts`.
  - At least one `.env` file.

### Jest Requirements
The jest configuration requires the following:
 - A test setup file at `src/setupTests.js`.
 - Enzyme version 3.4.0 or higher (if using Enzyme).

### Jest Debug
When installing jest, it will also add a .vscode/launch.json which will allow you to launch the vscode debugger and attach it to jest so you can debug.