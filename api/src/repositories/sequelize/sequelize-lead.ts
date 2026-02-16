import { Lead, LeadStatus } from "../../../models/lead.js";
import { Contact } from "../../../models/contact.js";
import { Op } from "sequelize";
import type {
  ILeadRepository,
  CreateLeadDTO,
  UpdateLeadDTO,
  LeadEntity,
  LeadStatusType,
  LeadFilters,
  PaginationParams,
  PaginatedResult,
} from "../repository-lead.js";

export class SequelizeLeadRepository implements ILeadRepository {
  private toEntity(lead: Lead): LeadEntity {
    const data = lead.get({ plain: true }) as any;
    return {
      id: data.id,
      contactId: data.contactId,
      stageId: data.stageId,
      name: data.name,
      company: data.company,
      status: data.status as LeadStatusType,
      createdAt: data.createdAt ?? new Date(),
      updatedAt: data.updatedAt ?? new Date(),
      contact: data.contact ? {
        id: data.contact.id,
        name: data.contact.name,
        email: data.contact.email,
        phone: data.contact.phone,
      } : undefined,
    };
  }

  async create(data: CreateLeadDTO): Promise<LeadEntity> {
    const lead = await Lead.create({
      contactId: data.contactId,
      name: data.name,
      company: data.company,
      status: (data.status ?? "novo") as LeadStatus,
      stageId: data.stageId,
    });
    return this.toEntity(lead);
  }

  async findById(id: string): Promise<LeadEntity | null> {
    const lead = await Lead.findByPk(id);
    return lead ? this.toEntity(lead) : null;
  }

  async findAll(
    filters?: LeadFilters,
    pagination?: PaginationParams
  ): Promise<PaginatedResult<LeadEntity>> {
    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 10;
    const offset = (page - 1) * limit;

    const where: any = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${filters.search}%` } },
        { company: { [Op.iLike]: `%${filters.search}%` } },
      ];
    }

    const { rows, count } = await Lead.findAndCountAll({
      where,
      include: [{ model: Contact, as: "contact" }],
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    return {
      data: rows.map((lead) => this.toEntity(lead)),
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
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
