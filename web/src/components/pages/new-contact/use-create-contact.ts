import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface CreateContactInput {
  name: string;
  phone: string;
  email: string;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
}

async function createContact(data: CreateContactInput): Promise<Contact> {
  const response = await fetch("http://localhost:3333/contacts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Erro ao criar contato");
  }

  return response.json();
}

export function useCreateContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
}
