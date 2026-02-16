"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Skeleton } from "@/src/components/ui/skeleton";
import { useLead, useUpdateLead, LeadStatus } from "../leads/use-leads";
import { useContacts } from "../contacts/use-contacts";

const formSchema = z.object({
  contactId: z.string().min(1, "Selecione um contato"),
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  company: z.string().min(2, "Empresa deve ter pelo menos 2 caracteres"),
  status: z.nativeEnum(LeadStatus),
});

type FormValues = z.infer<typeof formSchema>;

const statusLabels: Record<LeadStatus, string> = {
  [LeadStatus.NOVO]: "Novo",
  [LeadStatus.CONTACTADO]: "Contatado",
  [LeadStatus.QUALIFICADO]: "Qualificado",
  [LeadStatus.CONVERTIDO]: "Convertido",
  [LeadStatus.PERDIDO]: "Perdido",
};

interface EditLeadPageProps {
  leadId: string;
}

const EditLeadPage = ({ leadId }: EditLeadPageProps) => {
  const router = useRouter();
  const { data: lead, isLoading: isLoadingLead } = useLead(leadId);
  const { mutate: updateLead, isPending } = useUpdateLead();
  const { data: contacts, isLoading: isLoadingContacts } = useContacts();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contactId: "",
      name: "",
      company: "",
      status: LeadStatus.NOVO,
    },
  });

  useEffect(() => {
    if (lead) {
      form.reset({
        contactId: lead.contactId,
        name: lead.name,
        company: lead.company,
        status: lead.status,
      });
    }
  }, [lead, form]);

  function onSubmit(values: FormValues) {
    updateLead(
      { id: leadId, data: values },
      {
        onSuccess: () => {
          router.push("/leads");
        },
      }
    );
  }

  if (isLoadingLead) {
    return (
      <Card className="w-full">
        <CardHeader>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Editar Lead</CardTitle>
        <CardDescription>
          Atualize os dados do lead
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="contactId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contato</FormLabel>
                  {isLoadingContacts ? (
                    <Skeleton className="h-9 w-full" />
                  ) : (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um contato" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {contacts?.data?.map((contact) => (
                          <SelectItem key={contact.id} value={contact.id}>
                            {contact.name} - {contact.email}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Lead</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o nome do lead" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Empresa</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o nome da empresa" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(LeadStatus).map((status) => (
                        <SelectItem key={status} value={status}>
                          {statusLabels[status]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={isPending}>
                {isPending ? "Salvando..." : "Salvar Alterações"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/leads")}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default EditLeadPage;
