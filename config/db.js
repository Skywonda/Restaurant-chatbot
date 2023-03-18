const mongoose = require('mongoose')
require('dotenv').config()

module.exports = () => {

  mongoose.set("strictQuery", false);
  mongoose
    .connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log("Connection to MongoDB successful");
    })
    .catch((err) => {
      console.error("Connection to MongoDB failed", err.message);
    });


}