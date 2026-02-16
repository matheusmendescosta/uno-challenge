export interface CreateFunnelDTO {
  name: string;
  description?: string | null;
}

export interface UpdateFunnelDTO {
  name?: string;
  description?: string | null;
}

export interface StageEntity {
  id: string;
  funnelId: string;
  name: string;
  order: number;
  color: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface FunnelEntity {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  stages?: StageEntity[];
}

export interface IFunnelRepository {
  create(data: CreateFunnelDTO): Promise<FunnelEntity>;
  findById(id: string): Promise<FunnelEntity | null>;
  findAll(): Promise<FunnelEntity[]>;
  findByIdWithStages(id: string): Promise<FunnelEntity | null>;
  update(id: string, data: UpdateFunnelDTO): Promise<FunnelEntity | null>;
  delete(id: string): Promise<boolean>;
}
