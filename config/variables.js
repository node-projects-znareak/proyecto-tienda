require("dotenv").config();

const MONGO_DB = {
  URL: process.env.MONGODB_URL,
  DB: process.env.MONGO_DB,
};

const SERVER = {
  PORT: process.env.API_PORT || 6000,
  DEV: process.env.DEV || false,
  API: {
    SALT_BCRYPT: process.env.SALT_BCRYPT,
    SECRET_TOKEN: process.env.SECRET_TOKEN,
    IS_PRODUCTION: process.env.NODE_ENV === "production",
    ALLOWED_DOMAINS: [
      "http://127.0.0.1:3000",
      "http://127.0.0.1:5000",
      "http://localhost:3000",
      "http://localhost:5000",
    ],
    RATE_LIMITS: {
      windowMs: 10 * 60 * 1000, // 10 minutes
      max: Infinity, // limit each IP to infinity xd requests per windowMs
    },
  },
};

module.exports = {
  MONGO_DB,
  SERVER,
};
