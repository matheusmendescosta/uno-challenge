import type {
  ILeadRepository,
  CreateLeadDTO,
  UpdateLeadDTO,
  LeadEntity,
  LeadStatusType,
  LeadFilters,
  PaginationParams,
  PaginatedResult,
} from "../repositories/repository-lead.js";

export class LeadService {
  constructor(private readonly leadRepository: ILeadRepository) {}

  async create(data: CreateLeadDTO): Promise<LeadEntity> {
    return this.leadRepository.create(data);
  }

  async findById(id: string): Promise<LeadEntity | null> {
    return this.leadRepository.findById(id);
  }

  async findAll(
    filters?: LeadFilters,
    pagination?: PaginationParams
  ): Promise<PaginatedResult<LeadEntity>> {
    return this.leadRepository.findAll(filters, pagination);
  }

  async update(id: string, data: UpdateLeadDTO): Promise<LeadEntity | null> {
    const lead = await this.leadRepository.findById(id);
    if (!lead) {
      return null;
    }
    return this.leadRepository.update(id, data);
  }

  async delete(id: string): Promise<boolean> {
    const lead = await this.leadRepository.findById(id);
    if (!lead) {
      return false;
    }
    return this.leadRepository.delete(id);
  }

  async findByStatus(status: LeadStatusType): Promise<LeadEntity[]> {
    return this.leadRepository.findByStatus(status);
  }

  async findByContactId(contactId: string): Promise<LeadEntity[]> {
    return this.leadRepository.findByContactId(contactId);
  }
}
