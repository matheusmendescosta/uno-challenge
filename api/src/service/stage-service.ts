import type {
  IStageRepository,
  CreateStageDTO,
  UpdateStageDTO,
  StageEntity,
} from "../repositories/repository-stage.js";

export class StageService {
  constructor(private readonly stageRepository: IStageRepository) {}

  async create(data: CreateStageDTO): Promise<StageEntity> {
    return this.stageRepository.create(data);
  }

  async findById(id: string): Promise<StageEntity | null> {
    return this.stageRepository.findById(id);
  }

  async findByFunnelId(funnelId: string): Promise<StageEntity[]> {
    return this.stageRepository.findByFunnelId(funnelId);
  }

  async findByIdWithLeads(id: string): Promise<StageEntity | null> {
    return this.stageRepository.findByIdWithLeads(id);
  }

  async update(id: string, data: UpdateStageDTO): Promise<StageEntity | null> {
    const stage = await this.stageRepository.findById(id);
    if (!stage) {
      return null;
    }
    return this.stageRepository.update(id, data);
  }

  async delete(id: string): Promise<boolean> {
    const stage = await this.stageRepository.findById(id);
    if (!stage) {
      return false;
    }
    return this.stageRepository.delete(id);
  }

  async reorder(funnelId: string, stageIds: string[]): Promise<boolean> {
    return this.stageRepository.reorder(funnelId, stageIds);
  }
}
