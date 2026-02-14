import { Lead, LeadStatus } from "../../../models/lead.js";
import type {
  ILeadRepository,
  CreateLeadDTO,
  UpdateLeadDTO,
  LeadEntity,
  LeadStatusType,
} from "../repository-lead.js";

export class SequelizeLeadRepository implements ILeadRepository {
  private toEntity(lead: Lead): LeadEntity {
    return {
      id: lead.id,
      contactId: lead.contactId,
      name: lead.name,
      company: lead.company,
      status: lead.status as LeadStatusType,
      createdAt: lead.createdAt,
      updatedAt: lead.updatedAt,
    };
  }

  async create(data: CreateLeadDTO): Promise<LeadEntity> {
    const lead = await Lead.create({
      contactId: data.contactId,
      name: data.name,
      company: data.company,
      status: (data.status ?? "novo") as LeadStatus,
    });
    return this.toEntity(lead);
  }

  async findById(id: string): Promise<LeadEntity | null> {
    const lead = await Lead.findByPk(id);
    return lead ? this.toEntity(lead) : null;
  }

  async findAll(): Promise<LeadEntity[]> {
    const leads = await Lead.findAll();
    return leads.map((lead) => this.toEntity(lead));
  }

  async update(id: string, data: UpdateLeadDTO): Promise<LeadEntity | null> {
    const lead = await Lead.findByPk(id);
    if (!lead) return null;

    await lead.update(data as any);
    return this.toEntity(lead);
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await Lead.destroy({ where: { id } });
    return deleted > 0;
  }

  async findByStatus(status: LeadStatusType): Promise<LeadEntity[]> {
    const leads = await Lead.findAll({ where: { status } });
    return leads.map((lead) => this.toEntity(lead));
  }

  async findByContactId(contactId: string): Promise<LeadEntity[]> {
    const leads = await Lead.findAll({ where: { contactId } });
    return leads.map((lead) => this.toEntity(lead));
  }
}
