import { Model, DataTypes, Sequelize, type Optional } from "sequelize";

interface FunnelAttributes {
  id: string;
  name: string;
  description?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface FunnelCreationAttributes extends Optional<FunnelAttributes, "id"> {}

export class Funnel
  extends Model<FunnelAttributes, FunnelCreationAttributes>
  implements FunnelAttributes
{
  public id!: string;
  public name!: string;
  public description!: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public readonly stages?: any[];

  static associate(models: any) {
    Funnel.hasMany(models.Stage, {
      foreignKey: "funnelId",
      as: "stages",
    });
  }
}

export const initFunnel = (sequelize: Sequelize) => {
  Funnel.init(
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
          notNull: { msg: "O nome do funil é obrigatório" },
          len: {
            args: [2, 255],
            msg: "O nome deve ter no mínimo 2 caracteres",
          },
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "Funnels",
      modelName: "Funnel",
    },
  );
  return Funnel;
};
