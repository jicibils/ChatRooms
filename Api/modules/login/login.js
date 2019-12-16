const { db } = require("../../config/db_connection");
const jwt = require("jsonwebtoken");
let config = require("../../config");
const bcrypt = require("bcrypt");
const isEmpty = require("lodash/isEmpty");
const omit = require("lodash/omit");

const getComparePasswordsResult = (passwordDB, password) =>
  bcrypt.compare(password, passwordDB).then(res => res);

const confirmUser = async (req, res) => {
  const { email, password } = req.body;
  //Get DB USER
  const userChecked = await checkUserFunc(email, password);
  res.status(200).json(userChecked);
};

const checkUserFunc = async (email, password) => {
  try {
    const results = await db.query(`SELECT * FROM users WHERE (email = $1)`, [
      email
    ]);
    if (isEmpty(results.rows)) {
      return {
        type: "EmailFailure",
        message: "Email or Password are wrong"
      };
    }
    const userData = results.rows[0];
    const passwordPlainText = password;

    const comparePasswordsResult = await getComparePasswordsResult(
      userData.password,
      passwordPlainText
    );
    if (comparePasswordsResult && email === userData.email) {
      let token = jwt.sign({ email }, config.jwt.secretKey, {
        expiresIn: "24h" // expires in 24 hours
      });
      // return the JWT token for the future API calls
      return {
        type: "Success",
        message: "Successful authentication",
        userData: omit(userData, "password"),
        token
      };
    } else {
      return {
        type: "AuthFailure",
        message: "Email or PAssword are wrong"
      };
    }
  } catch (error) {
    console.log("checkUserFunc -> error", error);
    return {
      type: "GetUserFailure",
      message: "Email or Password are wrong"
    };
  }
};

module.exports = {
  confirmUser,
  checkUserFunc,
  getComparePasswordsResult
};
