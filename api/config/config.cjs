require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "12345678A@",
    database: process.env.DB_NAME || "database_development",
    host: process.env.DB_HOST || "db",
    port: process.env.DB_PORT || 5432,
    dialect: "postgres",
  },
  test: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "12345678A@",
    database: process.env.DB_NAME || "database_test",
    host: process.env.DB_HOST || "db",
    port: process.env.DB_PORT || 5432,
    dialect: "postgres",
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: "postgres",
  },
};
