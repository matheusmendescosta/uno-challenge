import { Model, DataTypes, Sequelize, type Optional } from "sequelize";
import { Lead } from "./lead.js"; // Importação para tipagem da associação (se necessário)

// 1. Interface dos Atributos (O que tem no banco)
interface ContactAttributes {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// 2. Interface de Criação (O id é opcional pois é gerado automaticamente)
interface ContactCreationAttributes extends Optional<ContactAttributes, "id"> {}

// 3. Classe do Modelo
export class Contact
  extends Model<ContactAttributes, ContactCreationAttributes>
  implements ContactAttributes
{
  public id!: string;
  public name!: string;
  public email!: string;
  public phone!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associações (opcional, ajuda no intellisense)
  public readonly leads?: Lead[];

  static associate(models: any) {
    Contact.hasMany(models.Lead, {
      foreignKey: "contactId",
      as: "leads",
    });
  }
}

// 4. Inicialização
export const initContact = (sequelize: Sequelize) => {
  Contact.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "O nome é obrigatório" },
          notEmpty: { msg: "O nome não pode ser vazio" },
          len: {
            args: [2, 255],
            msg: "O nome deve ter no mínimo 2 caracteres",
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: { msg: "O email é obrigatório" },
          isEmail: { msg: "Formato de email inválido" },
        },
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "O telefone é obrigatório" },
          notEmpty: { msg: "O telefone não pode ser vazio" },
        },
      },
    },
    {
      sequelize,
      tableName: "Contacts",
      modelName: "Contact",
    },
  );
  return Contact;
};
