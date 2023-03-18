require('dotenv').config()

const PORT = process.env.PORT || 8000;
const DB_URL = process.env.DB_URL;
const SECRET = process.env.SECRET;

module.exports = {
  PORT,
  DB_URL,
  SECRET
}