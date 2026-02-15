export interface CreateContactDTO {
  name: string;
  email: string;
  phone: string;
}

export interface UpdateContactDTO {
  name?: string;
  email?: string;
  phone?: string;
}

export interface ContactEntity {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IContactRepository {
  create(data: CreateContactDTO): Promise<ContactEntity>;
  findById(id: string): Promise<ContactEntity | null>;
  findByEmail(email: string): Promise<ContactEntity | null>;
  findAll(): Promise<ContactEntity[]>;
  update(id: string, data: UpdateContactDTO): Promise<ContactEntity | null>;
  delete(id: string): Promise<boolean>;
}
