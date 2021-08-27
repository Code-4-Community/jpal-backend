# JPAL Backend

## Installation & Scripts

You need Node v14+, you can install Node [here](https://nodejs.org/en/download/).
You also need a PostgreSQL DB ([instructions here](https://docs.c4cneu.com/getting-started/setup-local-dev/#start-a-local-postgres-database)).

Copy `.example.env` and rename it to `.env`, then fill out the environment variables for the DB.

### `npm install`

Installs all dependencies

### `npm start`

To run the server, by default this creates a server running on `http://localhost:5000`


### `npm run prepush:fix`

Checks if linting and prettier and Typescript compilation checks pass, AND auto-fixes problems.

### `npm run prepush`

Checks if linting and prettier and Typescript compilation checks pass.


### `npm test`

Runs all unit tests

### `npm run test:e2e`

Runs all e2e tests, requires a running DB.

### `npm run migration`
Runs all migrations in migrations folder that have not been recorded yet.

### `npm run typeorm migration:generate -- -n [name]`
Automatically generates a migration based off changes to TypeORM entities.
Example usage: `npm run typeorm migration:generate -- -n "createdUserProfiles"`