import { Stage } from "../../../models/stage.js";
import { Lead } from "../../../models/lead.js";
import type {
  IStageRepository,
  CreateStageDTO,
  UpdateStageDTO,
  StageEntity,
} from "../repository-stage.js";

export class SequelizeStageRepository implements IStageRepository {
  private toEntity(stage: Stage): StageEntity {
    const data = stage.get({ plain: true }) as any;
    return {
      id: data.id,
      funnelId: data.funnelId,
      name: data.name,
      order: data.order,
      color: data.color,
      createdAt: data.createdAt ?? new Date(),
      updatedAt: data.updatedAt ?? new Date(),
      leads: data.leads?.map((lead: any) => ({
        id: lead.id,
        name: lead.name,
        company: lead.company,
        status: lead.status,
      })),
    };
  }

  async create(data: CreateStageDTO): Promise<StageEntity> {
    // Get the max order for this funnel
    const maxOrder = await Stage.max("order", {
      where: { funnelId: data.funnelId },
    });
    
    const stage = await Stage.create({
      funnelId: data.funnelId,
      name: data.name,
      order: data.order ?? ((maxOrder as number) || 0) + 1,
      color: data.color,
    });
    return this.toEntity(stage);
  }

  async findById(id: string): Promise<StageEntity | null> {
    const stage = await Stage.findByPk(id);
    return stage ? this.toEntity(stage) : null;
  }

  async findByFunnelId(funnelId: string): Promise<StageEntity[]> {
    const stages = await Stage.findAll({
      where: { funnelId },
      order: [["order", "ASC"]],
      include: [{ model: Lead, as: "leads" }],
    });
    return stages.map((stage) => this.toEntity(stage));
  }

  async findByIdWithLeads(id: string): Promise<StageEntity | null> {
    const stage = await Stage.findByPk(id, {
      include: [{ model: Lead, as: "leads" }],
    });
    return stage ? this.toEntity(stage) : null;
  }

  async update(id: string, data: UpdateStageDTO): Promise<StageEntity | null> {
    const stage = await Stage.findByPk(id);
    if (!stage) return null;

    await stage.update(data);
    return this.toEntity(stage);
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await Stage.destroy({ where: { id } });
    return deleted > 0;
  }

  async reorder(funnelId: string, stageIds: string[]): Promise<boolean> {
    try {
      await Promise.all(
        stageIds.map((stageId, index) =>
          Stage.update({ order: index }, { where: { id: stageId, funnelId } })
        )
      );
      return true;
    } catch {
      return false;
    }
  }
}
