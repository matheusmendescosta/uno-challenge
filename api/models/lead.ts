import { Model, DataTypes, Sequelize, type Optional } from "sequelize";
import { Contact } from "./contact.js";

export enum LeadStatus {
  NOVO = "novo",
  CONTACTADO = "contactado",
  QUALIFICADO = "qualificado",
  CONVERTIDO = "convertido",
  PERDIDO = "perdido",
}

interface LeadAttributes {
  id: string;
  contactId: string;
  name: string;
  company: string;
  status: LeadStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

interface LeadCreationAttributes extends Optional<LeadAttributes, "id"> {}

export class Lead
  extends Model<LeadAttributes, LeadCreationAttributes>
  implements LeadAttributes
{
  public id!: string;
  public contactId!: string;
  public name!: string;
  public company!: string;
  public status!: LeadStatus;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public readonly contact?: Contact;

  static associate(models: any) {
    Lead.belongsTo(models.Contact, {
      foreignKey: "contactId",
      as: "contact",
    });
  }
}

export const initLead = (sequelize: Sequelize) => {
  Lead.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      contactId: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          notNull: { msg: "O ID do contato é obrigatório" },
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "O nome é obrigatório" },
          len: {
            args: [2, 255],
            msg: "O nome deve ter no mínimo 2 caracteres",
          },
        },
      },
      company: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "O nome da empresa é obrigatório" },
          len: {
            args: [2, 255],
            msg: "A empresa deve ter no mínimo 2 caracteres",
          },
        },
      },
      status: {
        type: DataTypes.ENUM(...Object.values(LeadStatus)),
        allowNull: false,
        defaultValue: LeadStatus.NOVO,
        validate: {
          isIn: {
            args: [Object.values(LeadStatus)],
            msg: "Status inválido",
          },
        },
      },
    },
    {
      sequelize,
      tableName: "Leads",
      modelName: "Lead",
    },
  );
  return Lead;
};
