import { Sequelize } from "sequelize";

// Singleton da conexão
export const sequelize = new Sequelize({
  dialect: "postgres",
  host: process.env.DB_HOST || "localhost",
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "hono_db",
  logging: false,
});

// Função para testar conexão
export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    // await sequelize.sync({ force: true }); // Cuidado em produção
    console.log("Postgres conectado via Sequelize nativo!");
  } catch (error) {
    console.error("Erro ao conectar no banco:", error);
  }
};
