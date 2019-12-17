const Pool = require("pg").Pool;

/*   TEST   */
const db = new Pool({
  user: "postgres",
  host: "localhost",
  database: "chat-rooms",
  password: "postgres",
  port: 5432
});

module.exports = {
  db
};
