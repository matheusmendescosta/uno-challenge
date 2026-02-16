import type {
  IFunnelRepository,
  CreateFunnelDTO,
  UpdateFunnelDTO,
  FunnelEntity,
} from "../repositories/repository-funnel.js";

export class FunnelService {
  constructor(private readonly funnelRepository: IFunnelRepository) {}

  async create(data: CreateFunnelDTO): Promise<FunnelEntity> {
    return this.funnelRepository.create(data);
  }

  async findById(id: string): Promise<FunnelEntity | null> {
    return this.funnelRepository.findById(id);
  }

  async findAll(): Promise<FunnelEntity[]> {
    return this.funnelRepository.findAll();
  }

  async findByIdWithStages(id: string): Promise<FunnelEntity | null> {
    return this.funnelRepository.findByIdWithStages(id);
  }

  async update(id: string, data: UpdateFunnelDTO): Promise<FunnelEntity | null> {
    const funnel = await this.funnelRepository.findById(id);
    if (!funnel) {
      return null;
    }
    return this.funnelRepository.update(id, data);
  }

  async delete(id: string): Promise<boolean> {
    const funnel = await this.funnelRepository.findById(id);
    if (!funnel) {
      return false;
    }
    return this.funnelRepository.delete(id);
  }
}
