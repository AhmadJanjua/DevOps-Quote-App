import pkg from 'pg';
const { Pool } = pkg;

// create pool if doesnt exist
if (!global.pool) {
  try {
    global.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    // log errors
    global.pool.on('error', (err) => {
      console.error('PostgreSQL Pool Error: ', err);
    });

    // free resources
    const shutdown = async () => {
      try {
        await global.pool.end();
        console.log('Postgres pool freed.');
      } catch (err) {
        console.error('PostgreSQL Pool Error on Freeing:', err);
      }
    };

    // free resource on shutdown
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
    process.on('exit', shutdown);

  } catch (err) {
    throw err;
  }
}

let pool = global.pool;
export default pool;
