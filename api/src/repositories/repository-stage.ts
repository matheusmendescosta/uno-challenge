export interface CreateStageDTO {
  funnelId: string;
  name: string;
  order?: number;
  color?: string;
}

export interface UpdateStageDTO {
  name?: string;
  order?: number;
  color?: string;
}

export interface LeadInStageEntity {
  id: string;
  name: string;
  company: string;
  status: string;
}

export interface StageEntity {
  id: string;
  funnelId: string;
  name: string;
  order: number;
  color: string | null;
  createdAt: Date;
  updatedAt: Date;
  leads?: LeadInStageEntity[];
}

export interface IStageRepository {
  create(data: CreateStageDTO): Promise<StageEntity>;
  findById(id: string): Promise<StageEntity | null>;
  findByFunnelId(funnelId: string): Promise<StageEntity[]>;
  findByIdWithLeads(id: string): Promise<StageEntity | null>;
  update(id: string, data: UpdateStageDTO): Promise<StageEntity | null>;
  delete(id: string): Promise<boolean>;
  reorder(funnelId: string, stageIds: string[]): Promise<boolean>;
}
