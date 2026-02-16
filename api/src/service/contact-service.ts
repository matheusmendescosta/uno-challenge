import type {
  IContactRepository,
  CreateContactDTO,
  UpdateContactDTO,
  ContactEntity,
  ContactFilters,
  PaginationParams,
  PaginatedResult,
} from "../repositories/repository-contact.js";

export class ContactService {
  constructor(private readonly contactRepository: IContactRepository) {}

  async create(data: CreateContactDTO): Promise<ContactEntity> {
    const existingContact = await this.contactRepository.findByEmail(data.email);
    if (existingContact) {
      throw new Error("Já existe um contato com este email");
    }
    return this.contactRepository.create(data);
  }

  async findById(id: string): Promise<ContactEntity | null> {
    return this.contactRepository.findById(id);
  }

  async findByEmail(email: string): Promise<ContactEntity | null> {
    return this.contactRepository.findByEmail(email);
  }

  async findAll(
    filters?: ContactFilters,
    pagination?: PaginationParams
  ): Promise<PaginatedResult<ContactEntity>> {
    return this.contactRepository.findAll(filters, pagination);
  }

  async update(id: string, data: UpdateContactDTO): Promise<ContactEntity | null> {
    const contact = await this.contactRepository.findById(id);
    if (!contact) {
      return null;
    }

    if (data.email && data.email !== contact.email) {
      const existingContact = await this.contactRepository.findByEmail(data.email);
      if (existingContact) {
        throw new Error("Já existe um contato com este email");
      }
    }

    return this.contactRepository.update(id, data);
  }

  async delete(id: string): Promise<boolean> {
    const contact = await this.contactRepository.findById(id);
    if (!contact) {
      return false;
    }
    return this.contactRepository.delete(id);
  }
}
