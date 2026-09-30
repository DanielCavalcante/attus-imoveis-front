"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { BadgeCheck, CircleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { PrivateRoute } from "@/app/components/private-route";
import { CompanyFormData, companySchema } from "@/app/schemas/company";
import { useCompany } from "@/app/hooks/use-company";
import { useUpdateCompany } from "@/app/hooks/use-update-company";

type Field = {
  name: keyof CompanyFormData;
  label: string;
  placeholder?: string;
  /** Largura no grid de duas colunas; o padrão é meia largura. */
  wide?: boolean;
};

const IDENTIFICACAO: Field[] = [
  { name: "razaoSocial", label: "Razão social", wide: true },
  { name: "nomeFantasia", label: "Nome fantasia", wide: true },
  { name: "creciNumero", label: "Número do CRECI" },
  { name: "creciUf", label: "UF do CRECI", placeholder: "PE" },
];

const RESPONSAVEL: Field[] = [
  { name: "responsavelNome", label: "Nome do responsável legal", wide: true },
  { name: "responsavelCpf", label: "CPF do responsável" },
  { name: "telefoneComercial", label: "Telefone comercial" },
  { name: "emailComercial", label: "E-mail comercial", wide: true },
];

const ENDERECO: Field[] = [
  { name: "cep", label: "CEP" },
  { name: "numero", label: "Número" },
  { name: "logradouro", label: "Logradouro", wide: true },
  { name: "complemento", label: "Complemento (opcional)", wide: true },
  { name: "cidade", label: "Cidade" },
  { name: "uf", label: "UF", placeholder: "PE" },
];

export default function CompanyPage() {
  const { data, isLoading, error } = useCompany();
  const updateCompany = useUpdateCompany();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
  });

  useEffect(() => {
    if (!data) return;

    reset({
      razaoSocial: data.razaoSocial ?? "",
      nomeFantasia: data.nomeFantasia ?? "",
      creciNumero: data.creciNumero ?? "",
      creciUf: data.creciUf ?? "",
      responsavelNome: data.responsavelNome ?? "",
      responsavelCpf: data.responsavelCpf ?? "",
      telefoneComercial: data.telefoneComercial ?? "",
      emailComercial: data.emailComercial ?? "",
      cep: data.cep ?? "",
      logradouro: data.logradouro ?? "",
      numero: data.numero ?? "",
      complemento: data.complemento ?? "",
      cidade: data.cidade ?? "",
      uf: data.uf ?? "",
    });
  }, [data, reset]);

  async function onSubmit(form: CompanyFormData) {
    try {
      await updateCompany.mutateAsync(form);
      toast.success("Dados da empresa salvos.");
    } catch (err) {
      // A mensagem vem do servidor: conflito de CRECI precisa chegar legível.
      toast.error(
        err instanceof Error ? err.message : "Não foi possível salvar.",
      );
    }
  }

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-muted/40">
        <div className="container mx-auto max-w-4xl px-4 py-8">
          {isLoading && (
            <div className="h-64 animate-pulse rounded-2xl bg-muted" />
          )}

          {!isLoading && error && (
            <Card>
              <CardHeader>
                <CardTitle>Esta conta não tem empresa</CardTitle>

                <CardDescription>
                  A área da empresa existe para contas de pessoa jurídica.
                </CardDescription>
              </CardHeader>
            </Card>
          )}

          {!isLoading && data && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">
                    Dados da empresa
                  </h1>

                  <p className="text-muted-foreground">
                    CNPJ {data.cnpj}
                  </p>
                </div>

                <span
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium ${
                    data.dossieCompleto
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {data.dossieCompleto ? (
                    <BadgeCheck className="h-4 w-4" aria-hidden />
                  ) : (
                    <CircleAlert className="h-4 w-4" aria-hidden />
                  )}

                  {data.dossieCompleto
                    ? "Cadastro completo"
                    : "Cadastro incompleto"}
                </span>
              </div>

              <Section
                title="Identificação"
                description="Precisa bater com o que consta no CNPJ e no conselho regional."
                fields={IDENTIFICACAO}
                register={register}
                errors={errors}
              />

              <Section
                title="Responsável e contato"
                description="Quem responde pela conta e por onde a equipe fala com a empresa."
                fields={RESPONSAVEL}
                register={register}
                errors={errors}
              />

              <Section
                title="Endereço da sede"
                fields={ENDERECO}
                register={register}
                errors={errors}
              />

              <Button type="submit" size="lg" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : "Salvar dados da empresa"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </PrivateRoute>
  );
}

type SectionProps = {
  title: string;
  description?: string;
  fields: Field[];
  register: ReturnType<typeof useForm<CompanyFormData>>["register"];
  errors: ReturnType<typeof useForm<CompanyFormData>>["formState"]["errors"];
};

function Section({
  title,
  description,
  fields,
  register,
  errors,
}: SectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>

        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>

      <CardContent className="grid gap-5 sm:grid-cols-2">
        {fields.map((field) => (
          <div
            key={field.name}
            className={`space-y-2 ${field.wide ? "sm:col-span-2" : ""}`}
          >
            <Label htmlFor={field.name}>{field.label}</Label>

            <Input
              id={field.name}
              placeholder={field.placeholder}
              {...register(field.name)}
            />

            {errors[field.name] && (
              <p className="text-sm font-semibold text-red-500">
                {errors[field.name]?.message}
              </p>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
