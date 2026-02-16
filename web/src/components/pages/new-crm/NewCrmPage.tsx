"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";

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
import { Textarea } from "@/src/components/ui/textarea";
import { useCreateFunnel } from "./use-create-funnel";

const formSchema = z.object({
  name: z
    .string()
    .min(2, "O nome deve ter pelo menos 2 caracteres")
    .max(255, "O nome deve ter no máximo 255 caracteres"),
  description: z
    .string()
    .max(1000, "A descrição deve ter no máximo 1000 caracteres")
    .optional(),
});

type FormValues = z.infer<typeof formSchema>;

const NewCrmPage = () => {
  const router = useRouter();
  const { mutate: createFunnel, isPending } = useCreateFunnel();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  function onSubmit(values: FormValues) {
    createFunnel(values, {
      onSuccess: () => {
        router.push("/crm");
      },
    });
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Novo Funil</CardTitle>
        <CardDescription>
          Preencha os dados para criar um novo funil de vendas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Funil</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Funil de Vendas B2B" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva o objetivo deste funil..."
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={isPending}>
                {isPending ? "Criando..." : "Criar Funil"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/crm")}
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

export default NewCrmPage;
