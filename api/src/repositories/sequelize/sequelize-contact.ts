import { Contact } from "../../../models/contact.js";
import type {
  IContactRepository,
  CreateContactDTO,
  UpdateContactDTO,
  ContactEntity,
} from "../repository-contact.js";

export class SequelizeContactRepository implements IContactRepository {
  private toEntity(contact: Contact): ContactEntity {
    const data = contact.get({ plain: true });
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      createdAt: data.createdAt ?? new Date(),
      updatedAt: data.updatedAt ?? new Date(),
    };
  }

  async create(data: CreateContactDTO): Promise<ContactEntity> {
    const contact = await Contact.create({
      name: data.name,
      email: data.email,
      phone: data.phone,
    });
    return this.toEntity(contact);
  }

  async findById(id: string): Promise<ContactEntity | null> {
    const contact = await Contact.findByPk(id);
    return contact ? this.toEntity(contact) : null;
  }

  async findByEmail(email: string): Promise<ContactEntity | null> {
    const contact = await Contact.findOne({ where: { email } });
    return contact ? this.toEntity(contact) : null;
  }

  async findAll(): Promise<ContactEntity[]> {
    const contacts = await Contact.findAll();
    return contacts.map((contact) => this.toEntity(contact));
  }

  async update(
    id: string,
    data: UpdateContactDTO,
  ): Promise<ContactEntity | null> {
    const contact = await Contact.findByPk(id);
    if (!contact) return null;

    await contact.update(data);
    return this.toEntity(contact);
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await Contact.destroy({ where: { id } });
    return deleted > 0;
  }
}
