const { Pool } = require("pg");

const pool = new Pool({
  ssl: {
    rejectUnauthorized: false, // Set to true for stricter security checks
  },
  keepAlive: true,
});

module.exports = pool;
