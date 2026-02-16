"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { Plus } from "lucide-react";
import { useCreateStage, type StageWithLeads } from "./use-stages";

const formSchema = z.object({
  name: z
    .string()
    .min(2, "O nome deve ter pelo menos 2 caracteres")
    .max(255, "O nome deve ter no máximo 255 caracteres"),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Cor inválida")
    .optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AddStageDialogProps {
  funnelId: string;
  existingStages: StageWithLeads[];
}

const colorPresets = [
  "#3B82F6", // blue
  "#22C55E", // green
  "#EAB308", // yellow
  "#F97316", // orange
  "#EF4444", // red
  "#8B5CF6", // purple
  "#EC4899", // pink
  "#06B6D4", // cyan
];

export function AddStageDialog({ funnelId, existingStages }: AddStageDialogProps) {
  const [open, setOpen] = useState(false);
  const { mutate: createStage, isPending } = useCreateStage();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      color: "#3B82F6",
    },
  });

  function onSubmit(values: FormValues) {
    const nextOrder = existingStages.length > 0
      ? Math.max(...existingStages.map((s) => s.order)) + 1
      : 0;

    createStage(
      {
        funnelId,
        name: values.name,
        order: nextOrder,
        color: values.color,
      },
      {
        onSuccess: () => {
          form.reset();
          setOpen(false);
        },
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="min-w-75 h-full min-h-50 border-dashed">
          <Plus className="h-6 w-6 mr-2" />
          Nova Etapa
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Nova Etapa</DialogTitle>
          <DialogDescription>
            Crie uma nova etapa para organizar os leads neste funil.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Etapa</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Prospecção, Negociação..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cor</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <div className="flex gap-2 flex-wrap">
                        {colorPresets.map((color) => (
                          <button
                            key={color}
                            type="button"
                            className={`w-8 h-8 rounded-full border-2 transition-all ${
                              field.value === color
                                ? "border-foreground scale-110"
                                : "border-transparent hover:scale-105"
                            }`}
                            style={{ backgroundColor: color }}
                            onClick={() => field.onChange(color)}
                          />
                        ))}
                      </div>
                      <Input
                        type="text"
                        placeholder="#3B82F6"
                        value={field.value}
                        onChange={field.onChange}
                        className="font-mono"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={isPending}>
                {isPending ? "Criando..." : "Criar Etapa"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
