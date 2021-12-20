# JPAL Backend

## Installation & Scripts

You need Node v14+, you can install Node [here](https://nodejs.org/en/download/).
You also need a PostgreSQL DB ([instructions here](https://www.postgresql.org/download/)).

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

### `npm run seed`

Runs the seed files in the correct order so that you have data in your database for development! 

## `npm run seed:run -- -s <specific seeder class>`

Runs a specific seed file.

### `npm run migration`

Runs all migrations in migrations folder that have not been recorded yet.

### `npm run typeorm migration:generate -- -n [name]`

Automatically generates a migration based off changes to TypeORM entities.
Example usage: `npm run typeorm migration:generate -- -n "createdUserProfiles"`

### `npm run schema:drop`

Drops your database. Do not do this unless you really need to! Does not reinitialize the database with a schema. If you want to just reset things use `npm run reset-db` or `npm run schema:drop && npm run migration`.

### `npm run reset-db`

Clears the database schema, runs migrations, then reseeds database. If you just need a fresh database with the original seed data, then use this command.
