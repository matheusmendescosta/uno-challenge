export type LeadStatusType = "novo" | "contactado" | "qualificado" | "convertido" | "perdido";

export interface CreateLeadDTO {
  contactId: string;
  name: string;
  company: string;
  status?: LeadStatusType;
}

export interface UpdateLeadDTO {
  contactId?: string;
  name?: string;
  company?: string;
  status?: LeadStatusType;
}

export interface LeadEntity {
  id: string;
  contactId: string;
  name: string;
  company: string;
  status: LeadStatusType;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILeadRepository {
  create(data: CreateLeadDTO): Promise<LeadEntity>;
  findById(id: string): Promise<LeadEntity | null>;
  findAll(): Promise<LeadEntity[]>;
  update(id: string, data: UpdateLeadDTO): Promise<LeadEntity | null>;
  delete(id: string): Promise<boolean>;
  findByStatus(status: LeadStatusType): Promise<LeadEntity[]>;
  findByContactId(contactId: string): Promise<LeadEntity[]>;
}
