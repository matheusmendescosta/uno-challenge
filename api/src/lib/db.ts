import { Sequelize } from "sequelize";
import { initLead, Lead } from "../../models/lead.js";
import { initContact, Contact } from "../../models/contact.js";

export const sequelize = new Sequelize({
  dialect: "postgres",
  host: process.env.DB_HOST,
  database: process.env.DB_NAME || "database_development",
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  logging: false,
});

initContact(sequelize);
initLead(sequelize);

const models = { Lead, Contact };
Lead.associate(models);
Contact.associate(models);

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("PostgreSQL connected successfully.");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};
