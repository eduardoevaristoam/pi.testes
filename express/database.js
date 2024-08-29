const { Client } = require("pg");

const client = new Client({
  ssl: {
    rejectUnauthorized: false, // Set to true for stricter security checks
  },
});

module.exports = client;
