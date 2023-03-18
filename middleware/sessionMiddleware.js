
const session = require("express-session");
const MongoStore = require("connect-mongodb-session")(session);
const config = require("../config/config");


const store = new MongoStore({
    uri: config.DB_URL,
    collection: "sessions",
});

store.on("error", function (error) {
    console.log(error);
});

module.exports = session({
    secret: config.SECRET,
    resave: true,
    saveUninitialized: true,
    store: store,
    cookie: { secure: false, httpOnly: true },
});
