const Pool = require("pg").Pool;

/*   TEST   */
const db = new Pool({
  user: "postgres",
  host: "localhost",
  database: "chat-rooms",
  password: "postgres",
  port: 5432
});

/*   PRODUCTION  HEROKU */
// const db = new Pool({
//   user: 'qhyrtheyknofbf',
//   host: 'ec2-174-129-229-106.compute-1.amazonaws.com',
//   database: 'd494m3pugepive',
//   password: '5bd00f569f7a509b24239d970f303dcec02ac168428d776472f3c4268089451d',
//   port: 5432
// });

// psql -h ec2-174-129-229-106.compute-1.amazonaws.com -U qhyrtheyknofbf d494m3pugepive

module.exports = {
  db
};
