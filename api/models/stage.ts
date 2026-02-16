import { Model, DataTypes, Sequelize, type Optional } from "sequelize";
import { Funnel } from "./funnel.js";

interface StageAttributes {
  id: string;
  funnelId: string;
  name: string;
  order: number;
  color?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface StageCreationAttributes extends Optional<StageAttributes, "id"> {}

export class Stage
  extends Model<StageAttributes, StageCreationAttributes>
  implements StageAttributes
{
  public id!: string;
  public funnelId!: string;
  public name!: string;
  public order!: number;
  public color!: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public readonly funnel?: Funnel;
  public readonly leads?: any[];

  static associate(models: any) {
    Stage.belongsTo(models.Funnel, {
      foreignKey: "funnelId",
      as: "funnel",
    });
    Stage.hasMany(models.Lead, {
      foreignKey: "stageId",
      as: "leads",
    });
  }
}

export const initStage = (sequelize: Sequelize) => {
  Stage.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      funnelId: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          notNull: { msg: "O ID do funil é obrigatório" },
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "O nome da etapa é obrigatório" },
          len: {
            args: [2, 255],
            msg: "O nome deve ter no mínimo 2 caracteres",
          },
        },
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      color: {
        type: DataTypes.STRING(7),
        allowNull: true,
        defaultValue: "#3B82F6",
      },
    },
    {
      sequelize,
      tableName: "Stages",
      modelName: "Stage",
    },
  );
  return Stage;
};
