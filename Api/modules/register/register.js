const { db } = require("../../config/db_connection");
const { checkUserFunc } = require("../login/login");
const bcrypt = require("bcrypt");
const saltRounds = 12;
const isEmpty = require("lodash/isEmpty");
const get = require("lodash/get");

// When you add a user in the DB the password has to be encrypted like this
const getEncryptedDBPassword = password =>
  bcrypt.hash(password, saltRounds).then(hash => hash);

const registerUser = async (req, res) => {
  const { password, email, nickname } = req.body;
  const passwordDBEncrypted = await getEncryptedDBPassword(password);

  // Get DB USER
  const queryObj = await db.query("SELECT * FROM users WHERE email = $1", [
    email
  ]);

  const results = get(queryObj, "rows");
  if (!isEmpty(results))
    return res.status(200).json({
      type: "RegisterFailure",
      message: "Email is already registered"
    });

  const values = [passwordDBEncrypted, email, nickname, new Date()];
  const text =
    "INSERT INTO users ( password, email,nickname,created) VALUES ($1,$2,$3,$4) RETURNING *";

  return db.query(text, values, async (err, results) => {
    if (err) {
      console.log("registerUser -> err", err);
      res.status(200).json({
        type: "RegisterFailure",
        message: "Oops something went wrong, Try Again"
      });
    } else {
      const userLogged = await checkUserFunc(email, password);
      res.status(200).json({
        type: "Success",
        message: "Registered successfully! Welcome!",
        userObj: userLogged
      });
    }
  });
};

module.exports = {
  registerUser,
  getEncryptedDBPassword
};
