import { Funnel } from "../../../models/funnel.js";
import { Stage } from "../../../models/stage.js";
import type {
  IFunnelRepository,
  CreateFunnelDTO,
  UpdateFunnelDTO,
  FunnelEntity,
} from "../repository-funnel.js";

export class SequelizeFunnelRepository implements IFunnelRepository {
  private toEntity(funnel: Funnel): FunnelEntity {
    const data = funnel.get({ plain: true }) as any;
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      createdAt: data.createdAt ?? new Date(),
      updatedAt: data.updatedAt ?? new Date(),
      stages: data.stages?.map((stage: any) => ({
        id: stage.id,
        funnelId: stage.funnelId,
        name: stage.name,
        order: stage.order,
        color: stage.color,
        createdAt: stage.createdAt,
        updatedAt: stage.updatedAt,
      })),
    };
  }

  async create(data: CreateFunnelDTO): Promise<FunnelEntity> {
    const funnel = await Funnel.create({
      name: data.name,
      description: data.description,
    });
    return this.toEntity(funnel);
  }

  async findById(id: string): Promise<FunnelEntity | null> {
    const funnel = await Funnel.findByPk(id);
    return funnel ? this.toEntity(funnel) : null;
  }

  async findAll(): Promise<FunnelEntity[]> {
    const funnels = await Funnel.findAll({
      include: [{ model: Stage, as: "stages", order: [["order", "ASC"]] }],
    });
    return funnels.map((funnel) => this.toEntity(funnel));
  }

  async findByIdWithStages(id: string): Promise<FunnelEntity | null> {
    const funnel = await Funnel.findByPk(id, {
      include: [{ model: Stage, as: "stages", order: [["order", "ASC"]] }],
    });
    return funnel ? this.toEntity(funnel) : null;
  }

  async update(id: string, data: UpdateFunnelDTO): Promise<FunnelEntity | null> {
    const funnel = await Funnel.findByPk(id);
    if (!funnel) return null;

    await funnel.update(data);
    return this.toEntity(funnel);
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await Funnel.destroy({ where: { id } });
    return deleted > 0;
  }
}
