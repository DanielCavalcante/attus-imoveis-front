import { AnnouncementFormData } from "../schemas/announcement";

export type PropertyType = AnnouncementFormData["propertyType"];
type ReasonType = AnnouncementFormData["reason"];

/**
 * Rótulos dos enums do backend (com.example.demo.enums).
 * Os literais precisam continuar idênticos aos do Java — ver AGENTS.md.
 */
const PROPERTY_TYPE_LABEL: Record<PropertyType, string> = {
  HOUSE: "Casa",
  APARTMENT: "Apartamento",
  CONDOMINIUM: "Condomínio",
  LAND: "Terreno",
};

const REASON_LABEL: Record<ReasonType, string> = {
  SALE: "Venda",
  RENT: "Aluguel",
};

export function propertyTypeLabel(type?: PropertyType) {
  return type ? PROPERTY_TYPE_LABEL[type] : "";
}

export function reasonLabel(reason?: ReasonType) {
  return reason ? REASON_LABEL[reason] : "";
}

/** Terreno não tem cômodo: exibir "0 quartos" seria ruído. */
export function hasRooms(type?: PropertyType) {
  return type !== "LAND";
}

export function formatCurrency(value?: number) {
  if (value == null) return "";

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

/** Aluguel e venda têm ordens de grandeza diferentes; sem o sufixo o preço engana. */
export function formatPrice(value?: number, reason?: ReasonType) {
  const price = formatCurrency(value);

  if (!price) return "";

  return reason === "RENT" ? `${price}/mês` : price;
}

export function formatArea(value?: number) {
  return value == null ? "" : `${new Intl.NumberFormat("pt-BR").format(value)} m²`;
}

export function initials(name?: string) {
  const parts = name?.trim().split(/\s+/).filter(Boolean) ?? [];

  if (!parts.length) return "";

  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : ""))
    .toUpperCase();
}

/**
 * Os tipos para o seletor, na ordem em que aparecem na tela.
 *
 * O `valor` é o do enum do backend e o `rotulo` é o que a pessoa lê. Mandar o
 * rótulo na consulta é o erro que passa silencioso: a listagem volta vazia e
 * ninguém descobre por quê.
 */
export const TIPOS_DE_IMOVEL: { valor: PropertyType; rotulo: string }[] = [
  { valor: "APARTMENT", rotulo: PROPERTY_TYPE_LABEL.APARTMENT },
  { valor: "HOUSE", rotulo: PROPERTY_TYPE_LABEL.HOUSE },
  { valor: "CONDOMINIUM", rotulo: PROPERTY_TYPE_LABEL.CONDOMINIUM },
  { valor: "LAND", rotulo: PROPERTY_TYPE_LABEL.LAND },
];
