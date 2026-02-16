export type LeadStatusType = "novo" | "contactado" | "qualificado" | "convertido" | "perdido";

export interface LeadFilters {
  search?: string;
  status?: LeadStatusType;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateLeadDTO {
  contactId: string;
  name: string;
  company: string;
  status?: LeadStatusType;
  stageId?: string | null;
}

export interface UpdateLeadDTO {
  contactId?: string;
  name?: string;
  company?: string;
  status?: LeadStatusType;
  stageId?: string | null;
}

export interface ContactEntity {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface LeadEntity {
  id: string;
  contactId: string;
  stageId?: string | null;
  name: string;
  company: string;
  status: LeadStatusType;
  createdAt: Date;
  updatedAt: Date;
  contact?: ContactEntity;
}

export interface ILeadRepository {
  create(data: CreateLeadDTO): Promise<LeadEntity>;
  findById(id: string): Promise<LeadEntity | null>;
  findAll(filters?: LeadFilters, pagination?: PaginationParams): Promise<PaginatedResult<LeadEntity>>;
  update(id: string, data: UpdateLeadDTO): Promise<LeadEntity | null>;
  delete(id: string): Promise<boolean>;
  findByStatus(status: LeadStatusType): Promise<LeadEntity[]>;
  findByContactId(contactId: string): Promise<LeadEntity[]>;
}
